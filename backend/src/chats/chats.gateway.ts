import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log(`[Socket.IO] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket.IO] Cliente desconectado: ${client.id}`);
  }

  /**
   * Unirse a una sala privada de chat previa verificación de membresía (ISO 25010)
   */
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ) {
    const { chatId, userId } = payload;
    const esMiembro = await this.chatsService.verificarMembresia(chatId, userId);
    if (!esMiembro) {
      client.emit('error', { message: 'Acceso denegado: No perteneces a esta conversación' });
      return;
    }
    client.join(`chat_${chatId}`);
    client.emit('joinedChat', { chatId, message: 'Conectado a la sala exitosamente' });
  }

  /**
   * Envío de mensaje en tiempo real sin recargar la página
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    // Verificación de Integridad y Confidencialidad (ISO 25010)
    const esMiembro = await this.chatsService.verificarMembresia(data.chatId, data.authorId);
    if (!esMiembro) {
      client.emit('error', { message: 'Seguridad ISO 25010: Solo los dos miembros pueden escribir en este chat' });
      return;
    }

    // Persistir mensaje en messages.json
    const nuevoMensaje = await this.chatsService.guardarMensaje(data);

    // Emitir a los integrantes de la sala
    this.server.to(`chat_${data.chatId}`).emit('newMessage', nuevoMensaje);
  }
}
