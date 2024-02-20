import { Module } from '@nestjs/common';
import { SocketModule } from './socket.module'; // Créez ce module si vous ne l'avez pas déjà
// import { SocketGateway } from './socket.gateway';

@Module({
  imports: [SocketModule],
  providers: [],
})
export class AppModule {}
