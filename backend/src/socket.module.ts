import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { QuizzService } from './quizz.service';
@Module({
  providers: [SocketGateway, QuizzService],
})
export class SocketModule {}
