import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo institucional es inválido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?ucab\.edu\.ve$/i, {
    message: 'Solo se permiten correos institucionales de la UCAB (@ucab.edu.ve o @est.ucab.edu.ve)',
  })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe contener al menos 6 caracteres' })
  password: string;
}
