import { IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
    message: 'El nombre no debe contener números ni caracteres especiales',
  })
  nombreCompleto?: string;

  @IsOptional()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'La nueva contraseña debe incluir tanto letras como números',
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'La carrera debe ser una cadena de texto' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
    message: 'La carrera no debe contener números ni caracteres especiales',
  })
  carrera?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\d{11}$/, {
    message: 'El número telefónico debe tener exactamente 11 dígitos numéricos (ej. 04141234567)',
  })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La foto de perfil debe ser una URL o identificador válido' })
  fotoPerfil?: string;
}
