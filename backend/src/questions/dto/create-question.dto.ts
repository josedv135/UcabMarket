import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsString()
  productId: string;

  @IsNotEmpty({ message: 'El texto de la pregunta es obligatorio' })
  @MaxLength(300, { message: 'La pregunta no puede superar los 300 caracteres' })
  @IsString()
  contenido: string;
}
