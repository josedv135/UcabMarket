import { IsEmail, IsNotEmpty, Matches, MinLength, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombreCompleto: string;

  @IsNotEmpty({ message: 'El correo institucional es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?ucab\.edu\.ve$/i, {
    message: 'Registro restringido: El correo debe pertenecer al dominio institucional de la UCAB (@ucab.edu.ve o @est.ucab.edu.ve)',
  })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener un mínimo de 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'La carrera o facultad es requerida' })
  @IsString({ message: 'La carrera debe ser una cadena de texto' })
  carrera: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;
}
