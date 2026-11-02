import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo institucional es inválido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@ucab\.edu\.ve$/, {
    message: 'Solo se permiten correos institucionales con dominio @ucab.edu.ve',
  })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe contener al menos 6 caracteres' })
  password: string;
}
