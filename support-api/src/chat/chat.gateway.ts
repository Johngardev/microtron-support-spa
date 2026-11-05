/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Chat gateway implementation
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinIncident')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() incidentId: string,
  ) {
    client.join(incidentId);
    console.log(`Client ${client.id} joined incident room: ${incidentId}`);
  }

  @SubscribeMessage('leaveIncident')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() incidentId: string,
  ) {
    client.leave(incidentId);
    console.log(`Client ${client.id} left incident room: ${incidentId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: {
      incidentId: string;
      text: string;
      sender: string;
      senderType: 'Admin' | 'User';
    },
  ) {
    const savedMessage = await this.chatService.createMessage(payload);

    this.server.to(payload.incidentId).emit('newMessage', savedMessage);
  }
}
