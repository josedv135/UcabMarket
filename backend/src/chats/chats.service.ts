import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly db: JsonDatabaseService) {}

  /** Solo los dos miembros del chat pueden entrar y escribir (Seguridad → Integridad) */
  async verificarMembresia(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.db.buscarPorId<Chat>('chats', chatId);
    return !!chat && (chat.compradorId === userId || chat.vendedorId === userId);
  }

  async guardarMensaje(data: CreateMessageDto): Promise<Message> {
    const mensaje: Message = {
      id: '',
      chatId: data.chatId,
      authorId: data.authorId,
      texto: data.texto,
      archivoUrl: data.archivoUrl,
      fecha: new Date().toISOString(),
    };
    return this.db.insertar<Message>('messages', mensaje);
  }
}
