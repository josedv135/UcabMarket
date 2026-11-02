import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateQuestionDto {
  @IsNotEmpty({ message: 'La respuesta no puede estar vacía' })
  @MaxLength(500, { message: 'La respuesta no puede superar los 500 caracteres' })
  @IsString()
  respuesta: string;
}
