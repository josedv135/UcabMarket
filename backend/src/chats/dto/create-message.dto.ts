import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'El id del chat es obligatorio' })
  @IsString()
  chatId: string;

  @IsNotEmpty({ message: 'El id del autor es obligatorio' })
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsString()
  archivoUrl?: string; // URL o nombre del archivo adjunto si tiene

  @IsOptional()
  @IsString()
  fecha?: string;
}
