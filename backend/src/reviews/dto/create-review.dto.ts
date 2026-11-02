import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'El ID del usuario evaluado es obligatorio' })
  @IsString()
  targetUserId: string;

  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  @Type(() => Number)
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1 estrella' })
  @Max(5, { message: 'La calificación máxima es 5 estrellas' })
  puntuacion: number;

  @IsNotEmpty({ message: 'El comentario de la reseña es obligatorio' })
  @MaxLength(500, { message: 'El comentario no puede exceder los 500 caracteres' })
  @IsString()
  comentario: string;

  @IsOptional()
  @IsString()
  productId?: string;
}
