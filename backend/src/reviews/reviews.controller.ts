import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuarioActual, UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.reviewsService.listarPorUsuario(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    return this.reviewsService.crear(
      usuario.id,
      usuario.nombreCompleto,
      createReviewDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    return this.reviewsService.actualizar(id, usuario.id, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: string, @UsuarioActual() usuario: UsuarioSesion) {
    return this.reviewsService.eliminar(id, usuario.id);
  }
}
