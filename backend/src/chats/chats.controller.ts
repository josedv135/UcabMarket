import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

/** Id del miembro con sesión, sacado del token que dejó AuthGuard en req.user */
export function usuarioId(user: any): string {
  return user?.id ?? user?.sub;
}

// Regla 1: solo miembros con sesión iniciada
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  crear(@Body() dto: CreateChatDto, @Req() req: any) {
    return this.chatsService.crearChat(dto.productId, usuarioId(req.user));
  }

  @Get(':id')
  obtener(@Param('id') id: string, @Req() req: any) {
    return this.chatsService.obtenerChat(id, usuarioId(req.user));
  }

  @Get(':id/messages')
  mensajes(@Param('id') id: string, @Req() req: any) {
    return this.chatsService.listarMensajes(id, usuarioId(req.user));
  }
}
