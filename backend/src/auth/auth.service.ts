import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, contrasena: string): Promise<any> {
    const usuario = await this.usersService.buscarPorEmail(email);
    if (!usuario || !usuario.password) {
      return null;
    }

    const coincide = await bcrypt.compare(contrasena, usuario.password);
    if (!coincide) {
      return null;
    }

    const { password, ...resultado } = usuario;
    return resultado;
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
    const usuarioValido = await this.validarUsuario(
      loginDto.email,
      loginDto.password,
    );

    if (!usuarioValido) {
      throw new UnauthorizedException(
        'Credenciales inválidas: Correo o contraseña incorrectos',
      );
    }

    const payload = {
      id: usuarioValido.id,
      email: usuarioValido.email,
      nombreCompleto: usuarioValido.nombreCompleto,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: usuarioValido,
    };
  }
}
