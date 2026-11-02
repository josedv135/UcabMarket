import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsString()
  productId: string;

  @IsNotEmpty({ message: 'El ID del vendedor es obligatorio' })
  @IsString()
  sellerId: string;
}
