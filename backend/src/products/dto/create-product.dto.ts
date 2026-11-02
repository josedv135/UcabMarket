import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength, ArrayMaxSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El título de la publicación es obligatorio' })
  @MaxLength(100, { message: 'El título no puede exceder 100 caracteres' })
  @IsString()
  titulo: string;

  @IsNotEmpty({ message: 'La descripción del producto es obligatoria' })
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  @IsString()
  descripcion: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsString()
  categoria: string;

  @IsNotEmpty({ message: 'El estado del producto es obligatorio (Nuevo, Usado, etc.)' })
  @IsString()
  estadoProducto: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Máximo 5 fotos permitidas por publicación' })
  fotos?: string[];
}
