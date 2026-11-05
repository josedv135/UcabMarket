import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { Chat } from './chat.entity';
import { Message } from './message.entity';

const MAX_TEXTO = 1000;

/** Vista del chat que se envía al cliente: solo nombres, nunca correo ni teléfono (regla 2, CA3) */
export interface ChatVista {
  id: string;
  producto: { id: string; titulo: string };
  comprador: { id: string; nombre: string };
  vendedor: { id: string; nombre: string };
  fechaCreacion: string;
}

@Injectable()
export class ChatsService {
  constructor(private readonly db: JsonDatabaseService) {}

  /** Paso 4: crea el chat entre el miembro y el vendedor del producto */
  async crearChat(productId: string, compradorId: string): Promise<ChatVista> {
    const producto = await this.db.buscarPorId<any>('products', productId);
    if (!producto) {
      throw new NotFoundException('No se pudo crear el chat: el producto no existe');
    }

    const vendedorId: string = producto.vendedorId ?? producto.userId;
    if (!vendedorId) {
      throw new BadRequestException('No se pudo crear el chat: el producto no tiene vendedor');
    }
    if (vendedorId === compradorId) {
      throw new BadRequestException('No puedes crear un chat contigo mismo sobre tu propio producto');
    }

    // Si ya existe un chat de este miembro por este producto, se reutiliza
    const chats = await this.db.leer<Chat>('chats');
    const existente = chats.find(
      (c) => c.productId === productId && c.compradorId === compradorId,
    );
    if (existente) {
      return this.armarVista(existente);
    }

    const chat = await this.db.insertar<Chat>('chats', {
      id: '',
      productId,
      compradorId,
      vendedorId,
      fechaCreacion: new Date().toISOString(),
    });
    return this.armarVista(chat);
  }

  /** Paso 7: muestra el chat, solo a sus dos miembros */
  async obtenerChat(chatId: string, userId: string): Promise<ChatVista> {
    const chat = await this.buscarChatDeMiembro(chatId, userId);
    return this.armarVista(chat);
  }

  async listarMensajes(chatId: string, userId: string): Promise<Message[]> {
    await this.buscarChatDeMiembro(chatId, userId);
    const mensajes = await this.db.leer<Message>('messages');
    return mensajes
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  /** Solo los dos miembros del chat pueden entrar y escribir (Seguridad → Integridad) */
  async verificarMembresia(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.db.buscarPorId<Chat>('chats', chatId);
    return !!chat && (chat.compradorId === userId || chat.vendedorId === userId);
  }

  /** Paso 10: guarda el mensaje. El autor viene del token, nunca del cliente. */
  async guardarMensaje(chatId: string, authorId: string, texto: string): Promise<Message> {
    const limpio = (texto ?? '').trim();
    if (!limpio) {
      throw new BadRequestException('El mensaje no puede estar vacío');
    }
    if (limpio.length > MAX_TEXTO) {
      throw new BadRequestException(`El mensaje no puede superar ${MAX_TEXTO} caracteres`);
    }
    await this.buscarChatDeMiembro(chatId, authorId);

    return this.db.insertar<Message>('messages', {
      id: '',
      chatId,
      authorId,
      texto: limpio,
      fecha: new Date().toISOString(),
    });
  }

  private async buscarChatDeMiembro(chatId: string, userId: string): Promise<Chat> {
    const chat = await this.db.buscarPorId<Chat>('chats', chatId);
    if (!chat) {
      throw new NotFoundException('El chat no existe');
    }
    if (chat.compradorId !== userId && chat.vendedorId !== userId) {
      throw new ForbiddenException('No perteneces a este chat');
    }
    return chat;
  }

  private async armarVista(chat: Chat): Promise<ChatVista> {
    const [producto, comprador, vendedor] = await Promise.all([
      this.db.buscarPorId<any>('products', chat.productId),
      this.db.buscarPorId<any>('users', chat.compradorId),
      this.db.buscarPorId<any>('users', chat.vendedorId),
    ]);
    return {
      id: chat.id,
      producto: { id: chat.productId, titulo: producto?.titulo ?? 'Producto' },
      comprador: { id: chat.compradorId, nombre: comprador?.nombreCompleto ?? 'Miembro UCAB' },
      vendedor: { id: chat.vendedorId, nombre: vendedor?.nombreCompleto ?? 'Miembro UCAB' },
      fechaCreacion: chat.fechaCreacion,
    };
  }
}
