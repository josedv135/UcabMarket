import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength, ArrayMaxSize, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

// Un campo con solo espacios cuenta como vacío (CA2)
const Recortar = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export class CreateProductDto {
  @IsNotEmpty({ message: 'El título de la publicación es obligatorio' })
  @MaxLength(100, { message: 'El título no puede exceder 100 caracteres' })
  @IsString()
  @Recortar()
  titulo: string;

  @IsNotEmpty({ message: 'La descripción del producto es obligatoria' })
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  @IsString()
  @Recortar()
  descripcion: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  // Un precio vacío no debe convertirse en 0
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
  )
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsString()
  @Recortar()
  categoria: string;

  @IsNotEmpty({ message: 'El estado del producto es obligatorio (Nuevo, Usado, etc.)' })
  @IsString()
  @Recortar()
  estadoProducto: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Máximo 5 fotos permitidas por publicación' })
  fotos?: string[];
}
