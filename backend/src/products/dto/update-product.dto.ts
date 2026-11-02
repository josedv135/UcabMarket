import { IsArray, ArrayMaxSize, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @MaxLength(100)
  @IsString()
  titulo?: string;

  @IsOptional()
  @MaxLength(1000)
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  estadoProducto?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Máximo 5 fotos permitidas' })
  fotos?: string[];

  @IsOptional()
  @IsString()
  estadoPublicacion?: 'ACTIVO' | 'PAUSADO' | 'VENDIDO';
}
