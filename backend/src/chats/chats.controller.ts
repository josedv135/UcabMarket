import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { CreateChatDto } from './dto/create-chat.dto';
import { descartarArchivo, multerChatConfig, nombreOriginal } from './chats.multer';
import { usuarioId } from './usuario-id';

// Regla 1: solo miembros con sesión iniciada
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  @Post()
  crear(@Body() dto: CreateChatDto, @Req() req: any) {
    return this.chatsService.crearChat(dto.productId, usuarioId(req.user));
  }

  /** HU Añadir archivos: sube el archivo y lo muestra en la conversación */
  @Post(':id/archivo')
  @UseInterceptors(FileInterceptor('archivo', multerChatConfig))
  async adjuntar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Selecciona un archivo para enviarlo');
    }
    try {
      const mensaje = await this.chatsService.guardarArchivo(
        id,
        usuarioId(req.user),
        file.filename,
        nombreOriginal(file),
      );
      this.chatsGateway.emitirMensaje(id, mensaje);
      return mensaje;
    } catch (err) {
      descartarArchivo(file);
      throw err;
    }
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
