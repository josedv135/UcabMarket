import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuarioActual, UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.questionsService.listarPorProducto(productId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    return this.questionsService.crear(
      usuario.id,
      usuario.nombreCompleto,
      createQuestionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id/answer')
  async answerQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    return this.questionsService.responder(id, usuario.id, updateQuestionDto);
  }
}
