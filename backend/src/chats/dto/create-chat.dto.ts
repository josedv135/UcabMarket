import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  // El vendedor no se recibe del cliente: se toma del producto en el servidor
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsString()
  productId: string;
}
