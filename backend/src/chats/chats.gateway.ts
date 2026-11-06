import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { Message } from './message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
  ) {}

  /** Regla 1: sin token válido no hay conexión al chat */
  handleConnection(client: Socket) {
    try {
      const payload = this.jwtService.verify(client.handshake.auth?.token);
      client.data.userId = payload.id;
    } catch {
      client.emit('chatError', { message: 'Debes iniciar sesión para usar el chat' });
      client.disconnect();
    }
  }

  /** Unirse a la sala privada del chat previa verificación de membresía (ISO 25010) */
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string },
  ) {
    const esMiembro = await this.chatsService.verificarMembresia(payload?.chatId, client.data.userId);
    if (!esMiembro) {
      client.emit('chatError', { message: 'No perteneces a esta conversación' });
      return;
    }
    client.join(`chat_${payload.chatId}`);
  }

  /** Muestra un mensaje a los dos miembros de la sala sin recargar */
  emitirMensaje(chatId: string, mensaje: Message) {
    this.server.to(`chat_${chatId}`).emit('newMessage', mensaje);
  }

  /** Paso 9-10: envía el mensaje y lo muestra a los dos miembros sin recargar */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; texto: string },
  ) {
    // CA6: el autor es siempre quien tiene la sesión, no lo que diga el cliente
    try {
      const mensaje = await this.chatsService.guardarMensaje(data?.chatId, client.data.userId, data?.texto);
      this.emitirMensaje(data.chatId, mensaje);
    } catch (err) {
      client.emit('chatError', { message: err.message });
    }
  }
}
