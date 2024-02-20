interface User {
  id: string;
  username?: string;
  point?: number;
}

interface Room {
  id: string;
  creator: User;
  clients: User[];
  difficulty: string;
  theme: string;
  nbQuestions: number;
  timeQuestions: number;
  quizz?: any;
  isStarted: boolean;
}

// interface Question {
//   id: string;
//   question: string;
//   possibleAnswers: string[];
//   answer: string;
// }

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuizzService } from './quizz.service';

@Module({
  imports: [ConfigModule.forRoot()],
})
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  users: User[] = [];
  rooms: Room[] = [];

  constructor(private quizzService: QuizzService) {}

  private currentQuestionIndex: number = 1;
  private selectedAnswerTime: number;
  private questionStartTime: number;
  private selectedAnswer: string;

  @SubscribeMessage('createRoom')
  async createRoom(client: any, payload: any) {
    const c = this.users.find((c) => c.id === client.id);
    const roomName = `quizzRoom-${Date.now()}`;

    const newRoom: Room = {
      id: roomName,
      creator: c,
      clients: [c],
      difficulty: payload.selectedDifficulty,
      theme: payload.selectedQuizzTitle,
      nbQuestions: payload.selectedQuestionCount,
      timeQuestions: payload.selectedTime,
      quizz: [],
      isStarted: false,
    };

    this.rooms.push(newRoom);
    this.server.emit('allRooms', this.rooms);
    client.join(newRoom.id);
    this.server.to(newRoom.id).emit('room', newRoom);
  }

  @SubscribeMessage('getRooms')
  async getRooms() {
    this.server.emit('allRooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: any, payload: any) {
    //Quitter la room précédentes
    for (const room of this.rooms) {
      const index = room.clients.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        room.clients.splice(index, 1);
        client.leave(room.id);
      }
    }

    // Rejoindre la nouvelle room
    const room = this.rooms.find((r) => r.id === payload);
    console.log(room);
    if (room) {
      const joiningUser = this.users.find((u) => u.id === client.id);
      if (joiningUser && !room.clients.some((u) => u.id === client.id)) {
        room.clients.push(joiningUser);
        client.join(room.id);

        this.server.to(room.id).emit('room', room);
        this.server.emit('allRooms', this.rooms);
      }
    }
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket) {
    for (const room of this.rooms) {
      const index = room.clients.findIndex((u) => u.id === client.id);
      if (index !== -1) {
        room.clients.splice(index, 1);
        client.leave(room.id);
        // send 'room' event to all clients in room
        this.server.to(room.id).emit('room', room);
        this.server.emit('rooms', this.rooms);
        this.server.to(client.id).emit('newRoom', {});
      }
    }
  }

  @SubscribeMessage('startQuizz')
  async startQuizz(client: Socket, payload: any) {
    const room = this.rooms.find((r) => r.id === payload.id);

    room.quizz = await this.quizzService.getQuestions(
      room.difficulty,
      room.nbQuestions,
      room.theme,
    );

    console.log(room);

    this.server.to(room.id).emit('roomWithQuizz', room);
  }

  @SubscribeMessage('launchQuizz')
  async launchQuizz(client: Socket, payload: any) {
    const quizz = payload.quizz;
    const room = payload.maRoom;

    for (let i = 0; i < quizz[0].length; i++) {
      this.currentQuestionIndex = i + 1;

      // Envoyer la question actuelle
      await this.sendQuestion(client, quizz[0]);

      // Interdiction de répondre après le délai spécifié (selectedTime)
      await this.sleep(room.timeQuestions * 1000);

      // Envoyer la réponse correcte après le délai spécifié
      this.sendCorrectAnswer(quizz[0]);

      // Passer à la question suivante après un court délai
      await this.sleep(5000); // Ajoutez un délai ici entre l'envoi de la réponse correcte et la question suivante
    }

    // Fin du quiz
    this.server.emit('quizFinished', { message: 'Quiz finished' });
  }

  @SubscribeMessage('chat-message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('chat-message', payload);
    return 'Hello world!';
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private sendCorrectAnswer(question) {
    const questionId = 'question' + this.currentQuestionIndex;
    const questionToSend =
      question[this.currentQuestionIndex - 1]?.[questionId];
    const userResponseTime =
      (this.selectedAnswerTime - this.questionStartTime) / 1000;

    // Envoie de la réponse correcte et le temps de réponse au frontend
    if (questionToSend.bonne_reponse == this.selectedAnswer) {
      this.server.emit('answerSubmitted', {
        correctAnswer: questionToSend.bonne_reponse,
        userResponseTime: userResponseTime,
      });
    } else {
      this.server.emit('answerSubmitted', {
        correctAnswer: questionToSend.bonne_reponse,
        userResponseTime: null,
      });
    }
  }

  private async sendQuestion(client: Socket, questions: any) {
    const questionId = 'question' + this.currentQuestionIndex;
    const questionToSend =
      questions[this.currentQuestionIndex - 1]?.[questionId];
    const question = {
      question: questionToSend.question,
      reponses: {
        reponse1: questionToSend.bonne_reponse,
        reponse2: questionToSend.mauvaises_reponses[0],
        reponse3: questionToSend.mauvaises_reponses[1],
        reponse4: questionToSend.mauvaises_reponses[2],
      },
    };
    client.emit('newQuestion', { question });
    this.questionStartTime = Date.now();
  }

  handleConnection(client: Socket) {
    console.log(Object.entries(client.handshake.auth).length === 0);
    console.log(client.handshake.auth);

    if (!(Object.entries(client.handshake.auth).length === 0)) {
      console.log('client connected ', client.handshake.auth);
      console.log('client connected ', client.id);
      this.users.push({
        id: client.id,
        username: client.handshake.auth.username,
        point: 0,
      });
    }

    client.on('selectedAnswer', async (params: any) => {
      this.selectedAnswer = params.response;
      this.selectedAnswerTime = Date.now();
    });
  }

  handleDisconnect(client: any) {
    console.log('client disconnected', client.id);

    const roomWithDisconnectedClient = this.rooms.find((room) =>
      room.clients.some((c) => c.id === client.id),
    );

    if (roomWithDisconnectedClient) {
      roomWithDisconnectedClient.clients =
        roomWithDisconnectedClient.clients.filter((c) => c.id !== client.id);

      this.server
        .to(roomWithDisconnectedClient.id)
        .emit('room', roomWithDisconnectedClient);
    }
    this.users = this.users.filter((c) => c.id !== client.id);

    console.log(client.handshake.auth.username + ' est parti');

    // Update all clients with the new list of rooms
    this.server.emit('rooms', this.rooms);

    client.leaveAll();
  }
}
