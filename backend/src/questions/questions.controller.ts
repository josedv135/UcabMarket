import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
    @Request() req: any,
  ) {
    return this.questionsService.crear(
      req.user.id,
      req.user.nombreCompleto,
      createQuestionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id/answer')
  async answerQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Request() req: any,
  ) {
    return this.questionsService.responder(id, req.user.id, updateQuestionDto);
  }
}
