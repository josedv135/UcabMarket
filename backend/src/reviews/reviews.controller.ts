import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
    @Request() req: any,
  ) {
    return this.reviewsService.crear(
      req.user.id,
      req.user.nombreCompleto,
      createReviewDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req: any,
  ) {
    return this.reviewsService.actualizar(id, req.user.id, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.eliminar(id, req.user.id);
  }
}
