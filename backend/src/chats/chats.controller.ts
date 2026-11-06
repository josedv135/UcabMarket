import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuarioActual, UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { CreateChatDto } from './dto/create-chat.dto';
import { descartarArchivo, multerChatConfig, nombreOriginal } from './chats.multer';

// Regla 1: solo miembros con sesión iniciada
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  @Post()
  crear(@Body() dto: CreateChatDto, @UsuarioActual() usuario: UsuarioSesion) {
    return this.chatsService.crearChat(dto.productId, usuario.id);
  }

  /** HU Añadir archivos: sube el archivo y lo muestra en la conversación */
  @Post(':id/archivo')
  @UseInterceptors(FileInterceptor('archivo', multerChatConfig))
  async adjuntar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    if (!file) {
      throw new BadRequestException('Selecciona un archivo para enviarlo');
    }
    try {
      const mensaje = await this.chatsService.guardarArchivo(
        id,
        usuario.id,
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
  obtener(@Param('id') id: string, @UsuarioActual() usuario: UsuarioSesion) {
    return this.chatsService.obtenerChat(id, usuario.id);
  }

  @Get(':id/messages')
  mensajes(@Param('id') id: string, @UsuarioActual() usuario: UsuarioSesion) {
    return this.chatsService.listarMensajes(id, usuario.id);
  }
}
