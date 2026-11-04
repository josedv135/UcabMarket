import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { multerChatConfig } from './chats.multer';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrGetChat(@Body() dto: CreateChatDto, @Request() req: any) {
    return this.chatsService.crearOBuscarChat(
      req.user.id,
      dto.sellerId,
      dto.productId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getMyChats(@Request() req: any) {
    return this.chatsService.obtenerChatsUsuario(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getChatById(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.obtenerChatPorId(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req: any) {
    return this.chatsService.obtenerMensajes(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerChatConfig))
  async uploadAttachment(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo para adjuntar');
    }
    return {
      url: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
