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
  quizz?: Question[];
  isStarted: boolean;
}

interface Question {
  id: string;
  question: string;
  possibleAnswers: string[];
  answer: string;
}

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

@Module({
  imports: [ConfigModule.forRoot()],
})
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  users: User[] = [];
  rooms: Room[] = [];

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
  async getRooms(client: any) {
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

    console.log("room quitté...")

    console.log(this.rooms);

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
      console.log("room rejoinds...");
    }
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket) {
    // leave all rooms previously joined
    for (const room of this.rooms) {
      const index = room.clients.findIndex((u) => u.id === client.id);
      if (index !== -1) {
        room.clients.splice(index, 1);
        client.leave(room.id);
        // send 'room' event to all clients in room
        this.server.to(room.id).emit('room', room);
        this.server.emit('rooms', this.rooms);
      }
    }
  }

  @SubscribeMessage('chat-message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('chat-message', payload);
    return 'Hello world!';
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

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { QuizzService } from './quizz.service';

// class User {
//   constructor(
//     public id: string,
//     public username: string,
//   ) {}
// }

// interface RoomInfo {
//   roomName: string;
//   users: User[];
// }

// @WebSocketGateway()
// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private users: User[] = [];
//   private rooms: RoomInfo[] = [];

//   private currentQuestionIndex: number = 1;
//   private isAnswerVisible: boolean = false;
//   private isAnsweringAllowed: boolean = false;
//   private questions: any[] = [];
//   private selectedDifficulty: any;
//   private selectedQuestionCount: any;
//   private selectedQuizzTitle: any;
//   private selectedTime: any;
//   private selectedAnswer: string;
//   private selectedAnswerTime: number;
//   private questionStartTime: number;

//   constructor(private quizzService: QuizzService) {}

//   // async handleConnection(client: Socket) {
//   //   console.log(client.id);
//   //   this.server.emit('message', {
//   //     content: 'Utilisateur connecté',
//   //     username: 'Système',
//   //   });
//   // }

//   //   @SubscribeMessage('connectionUser')
//   //   connexionUser(client: any) {
//   //     console.log('client connected', client.id);

//   //     // Vérifier si l'utilisateur existe déjà
//   //     const existingUser = this.users.find((user) => user.id === client.id);

//   //     if (!existingUser) {
//   //       console.log('client connected', client.id);
//   //       const newUser = new User(client.id, 'Utilisateur par défaut');
//   //       this.users.push(newUser);
//   //     }
//   // }

//   // @SubscribeMessage('createRoom')
//   // createRoom(client: any) {
//   //   console.log('Client 2: ', client.id);
//   //   const roomName = `quizzRoom-${Date.now()}`;
//   //   client.join(roomName); // Le client qui a émis la demande rejoint la room

//   //   const newRoom: RoomInfo = {
//   //     roomName,
//   //     users: [new User(client.id, 'Utilisateur par défaut')],
//   //   };

//   //   this.rooms.push(newRoom);

//   //   this.server.emit('roomCreated', { roomName }); // Émettre un événement pour informer le client de la création de la room
//   // }

//   // @SubscribeMessage('countRoom')
//   // countRoom(client: any) {
//   //   const roomInfoList = this.rooms.map((room) => ({
//   //     roomName: room.roomName,
//   //     numberOfUsers: room.users.length,
//   //     userList: room.users.map((user) => user.username),
//   //   }));

//   //   console.log(roomInfoList);

//   //   this.server.to(client.id).emit('roomsInfo', roomInfoList);
//   // }

//   // // Pour supprimer toutes les rooms
//   // @SubscribeMessage('clearAllRooms')
//   // clearAllRooms(client: any) {
//   //   // Récupérer tous les sockets connectés
//   //   const sockets = this.server.sockets.sockets;

//   //   // Forcer chaque socket à quitter toutes les rooms
//   //   Object.keys(sockets).forEach((socketId) => {
//   //     const rooms = Object.keys(sockets[socketId].rooms);
//   //     rooms.forEach((room) => {
//   //       sockets[socketId].leave(room);
//   //     });
//   //   });

//   //   // Effacer la liste des rooms
//   //   this.rooms = [];

//   //   console.log("C'est supprimé");

//   //   // Envoyer un message pour indiquer que toutes les rooms ont été vidées
//   //   client.emit('allRoomsCleared');
//   // }

//   handleConnection(client: Socket, payload: any) {
//     console.log('client connected ', client.id);
//     this.users.push({
//       id: client.id,
//       username: client.handshake.auth.username,
//     });
//   }

//   handleDisconnect(client: any) {
//     console.log('client disconnected', client.id);
//     const index = this.users.findIndex((user) => user.id === client.id);
//     if (index !== -1) {
//       this.users.splice(index, 1);
//     }
//   }

//   // async handleConnection(client: Socket) {
//   //   this.server.emit('message', {
//   //     content: 'Utilisateur connecté',
//   //     username: 'Système',
//   //   });

//   //   // Vérifiez si l'événement 'connected' n'est pas déjà écouté
//   //   if (!client.eventNames().includes('connected')) {
//   //     console.log(`Client connecté : ${client.id}`);
//   //     // À la connexion, émettez un événement 'connected' pour obtenir les paramètres de connexion
//   //     client.on('connected', async (params: any) => {
//   //       // Utilisez ces paramètres comme nécessaire
//   //       this.selectedDifficulty = params.selectedDifficulty;
//   //       this.selectedQuestionCount = params.selectedQuestionCount;
//   //       this.selectedQuizzTitle = params.selectedQuizzTitle;
//   //       this.selectedTime = params.selectedTime;

//   //       // Chargez les questions avec les paramètres avant d'appeler le QuizzService
//   //       await this.loadQuestions(
//   //         this.selectedDifficulty,
//   //         this.selectedQuestionCount,
//   //         this.selectedQuizzTitle,
//   //       );

//   //       // Envoyer la question actuelle
//   //       await this.startQuestionProcess(client);
//   //     });

//   //     client.on('selectedAnswer', async (params: any) => {
//   //       this.selectedAnswer = params.response;
//   //       this.selectedAnswerTime = Date.now();
//   //     });
//   //   }
//   // }

//   // private async startQuestionProcess(client: Socket) {
//   //   for (let i = 0; i < this.questions[0].length; i++) {
//   //     this.currentQuestionIndex = i + 1;

//   //     // Vérifier si le client est toujours connecté
//   //     if (!this.isClientConnected(client)) {
//   //       console.log(`Client disconnected: ${client.id}`);
//   //       break;
//   //     }

//   //     // Envoyer la question actuelle
//   //     await this.sendQuestion(client);

//   //     // Interdiction de répondre après le délai spécifié (selectedTime)
//   //     await this.sleep(this.selectedTime * 1000);

//   //     // Envoyer la réponse correcte après le délai spécifié
//   //     this.sendCorrectAnswer();

//   //     // Passer à la question suivante après un court délai
//   //     await this.sleep(5000); // Ajoutez un délai ici entre l'envoi de la réponse correcte et la question suivante

//   //     // Vérifier à nouveau si le client est toujours connecté
//   //     if (!this.isClientConnected(client)) {
//   //       console.log(`Client disconnected: ${client.id}`);
//   //       break;
//   //     }
//   //   }

//   //   // Fin du quiz
//   //   this.server.emit('quizFinished', { message: 'Quiz finished' });
//   // }

//   // private isClientConnected(client: Socket): boolean {
//   //   const room = this.server.sockets.adapter.rooms.get(client.id);
//   //   return room !== undefined;
//   // }

//   // private async sleep(ms: number) {
//   //   return new Promise((resolve) => setTimeout(resolve, ms));
//   // }

//   // handleDisconnect(client: Socket) {
//   //   console.log(`Client disconnected: ${client.id}`);
//   //   this.server.emit('message', {
//   //     content: 'User disconnected',
//   //     username: 'System',
//   //   });
//   // }

//   // private sendCorrectAnswer() {
//   //   const questionId = 'question' + this.currentQuestionIndex;
//   //   const questionToSend =
//   //     this.questions[0][this.currentQuestionIndex - 1]?.[questionId];
//   //   const userResponseTime =
//   //     (this.selectedAnswerTime - this.questionStartTime) / 1000;

//   //   console.log(userResponseTime);

//   //   // Envoie de la réponse correcte et le temps de réponse au frontend
//   //   if (questionToSend.bonne_reponse == this.selectedAnswer) {
//   //     this.server.emit('answerSubmitted', {
//   //       correctAnswer: questionToSend.bonne_reponse,
//   //       userResponseTime: userResponseTime,
//   //     });
//   //   } else {
//   //     this.server.emit('answerSubmitted', {
//   //       correctAnswer: questionToSend.bonne_reponse,
//   //       userResponseTime: null,
//   //     });
//   //   }
//   // }

//   // private async loadQuestions(
//   //   selectedDifficulty,
//   //   selectedQuestionCount,
//   //   selectedQuizzTitle,
//   // ) {
//   //   // Charger les questions depuis le service QuizzService
//   //   this.questions = await this.quizzService.getQuestions(
//   //     selectedDifficulty,
//   //     selectedQuestionCount,
//   //     selectedQuizzTitle,
//   //   );
//   // }

//   // private async sendQuestion(client: Socket) {
//   //   const questionId = 'question' + this.currentQuestionIndex;
//   //   const questionToSend =
//   //     this.questions[0][this.currentQuestionIndex - 1]?.[questionId];
//   //   const question = {
//   //     question: questionToSend.question,
//   //     reponses: {
//   //       reponse1: questionToSend.bonne_reponse,
//   //       reponse2: questionToSend.mauvaises_reponses[0],
//   //       reponse3: questionToSend.mauvaises_reponses[1],
//   //       reponse4: questionToSend.mauvaises_reponses[2],
//   //     },
//   //   };
//   //   client.emit('newQuestion', { question });
//   //   this.questionStartTime = Date.now();
//   // }
// }
