import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './chat.entity';
import { Message } from './message.entity';

@Injectable()
export class ChatsService {
  private readonly coleccionChats = 'chats';
  private readonly coleccionMensajes = 'messages';

  constructor(private readonly db: JsonDatabaseService) {}

  /**
   * Valida si un usuario pertenece a los dos miembros autorizados de la conversación (ISO 25010)
   */
  async verificarMembresia(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.db.buscarPorId<Chat>(this.coleccionChats, chatId);
    if (!chat) return false;
    return chat.buyerId === userId || chat.sellerId === userId;
  }

  /**
   * Crea una nueva sala de negociación o retorna la existente entre comprador y vendedor
   */
  async crearOBuscarChat(
    buyerId: string,
    sellerId: string,
    productId: string,
  ): Promise<Chat> {
    if (buyerId === sellerId) {
      throw new BadRequestException(
        'No puedes iniciar una conversación contigo mismo',
      );
    }

    const chats = await this.db.leer<Chat>(this.coleccionChats);
    const existente = chats.find(
      (c) =>
        c.productId === productId &&
        ((c.buyerId === buyerId && c.sellerId === sellerId) ||
          (c.buyerId === sellerId && c.sellerId === buyerId)),
    );

    if (existente) {
      return existente;
    }

    const nuevoChat: Chat = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      productId,
      sellerId,
      buyerId,
      fechaCreacion: new Date().toISOString(),
    };

    return this.db.insertar<Chat>(this.coleccionChats, nuevoChat);
  }

  /**
   * Obtiene la información de un chat verificando que el solicitante sea participante
   */
  async obtenerChatPorId(chatId: string, userId: string): Promise<Chat> {
    const chat = await this.db.buscarPorId<Chat>(this.coleccionChats, chatId);
    if (!chat) {
      throw new NotFoundException(`Chat con ID ${chatId} no encontrado`);
    }

    if (chat.buyerId !== userId && chat.sellerId !== userId) {
      throw new ForbiddenException(
        'Seguridad ISO 25010: Acceso denegado a esta conversación privada',
      );
    }

    return chat;
  }

  /**
   * Lista los mensajes del chat en orden cronológico
   */
  async obtenerMensajes(chatId: string, userId: string): Promise<Message[]> {
    const esMiembro = await this.verificarMembresia(chatId, userId);
    if (!esMiembro) {
      throw new ForbiddenException(
        'Seguridad ISO 25010: No tienes permiso para leer los mensajes de este chat',
      );
    }

    const mensajes = await this.db.leer<Message>(this.coleccionMensajes);
    return mensajes
      .filter((m) => m.chatId === chatId)
      .sort(
        (a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );
  }

  /**
   * Guarda un mensaje enviado en messages.json
   */
  async guardarMensaje(data: CreateMessageDto): Promise<Message> {
    const nuevoMensaje: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      chatId: data.chatId,
      authorId: data.authorId,
      texto: data.texto ? data.texto.trim() : undefined,
      archivoUrl: data.archivoUrl || undefined,
      fecha: data.fecha || new Date().toISOString(),
    };

    return this.db.insertar<Message>(this.coleccionMensajes, nuevoMensaje);
  }

  /**
   * Lista todos los chats donde participa el usuario
   */
  async obtenerChatsUsuario(userId: string): Promise<Chat[]> {
    const chats = await this.db.leer<Chat>(this.coleccionChats);
    return chats
      .filter((c) => c.buyerId === userId || c.sellerId === userId)
      .sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime(),
      );
  }
}
