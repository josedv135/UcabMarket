import { IsInt, IsOptional, IsString, Max, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion?: number;

  @IsOptional()
  @MaxLength(500)
  @IsString()
  comentario?: string;
}
