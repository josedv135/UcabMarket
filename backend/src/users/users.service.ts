import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly coleccion = 'users';

  constructor(private readonly db: JsonDatabaseService) {}

  async buscarPorEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const usuarios = await this.db.leer<User>(this.coleccion);
    const normalizado = email.toLowerCase().trim();
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase().trim() === normalizado,
    );
    return encontrado || null;
  }

  async buscarPorId(id: string): Promise<Omit<User, 'password'> | null> {
    const usuario = await this.db.buscarPorId<User>(this.coleccion, id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, ...sinPassword } = usuario;
    return sinPassword;
  }

  /** Perfil visible para otros miembros: sin correo ni teléfono */
  async perfilPublico(id: string) {
    const { email, telefono, ...publico } = await this.buscarPorId(id);
    return publico;
  }

  async registrar(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const emailNormalizado = dto.email.toLowerCase().trim();
    if (!emailNormalizado.endsWith('@ucab.edu.ve')) {
      throw new BadRequestException(
        'Solo se permiten correos institucionales con dominio @ucab.edu.ve',
      );
    }

    const existente = await this.buscarPorEmail(emailNormalizado);
    if (existente) {
      throw new ConflictException('Ya existe una cuenta registrada con este correo');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const nuevoUsuario: User = {
      id: '',
      nombreCompleto: dto.nombreCompleto.trim(),
      email: emailNormalizado,
      password: hashedPassword,
      carrera: dto.carrera.trim(),
      telefono: dto.telefono && dto.telefono.trim().length > 0 ? dto.telefono.trim() : undefined,
      fotoPerfil: undefined,
      fechaRegistro: new Date().toISOString(),
    };

    await this.db.insertar<User>(this.coleccion, nuevoUsuario);

    const { password, ...resultado } = nuevoUsuario;
    return resultado;
  }

  async actualizar(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const usuario = await this.db.buscarPorId<User>(this.coleccion, id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const cambios: Partial<User> = {};

    if (dto.nombreCompleto !== undefined) {
      const nombreLimpio = dto.nombreCompleto.trim();
      if (nombreLimpio.length > 0) {
        cambios.nombreCompleto = nombreLimpio;
      }
    }
    if (dto.carrera !== undefined) {
      const carreraLimpia = dto.carrera.trim();
      if (carreraLimpia.length > 0) {
        cambios.carrera = carreraLimpia;
      }
    }
    if (dto.telefono !== undefined) {
      cambios.telefono = dto.telefono.trim();
    }
    if (dto.fotoPerfil !== undefined) {
      cambios.fotoPerfil = dto.fotoPerfil.trim();
    }
    if (dto.password && dto.password.trim().length >= 6) {
      cambios.password = await bcrypt.hash(dto.password.trim(), 10);
    }

    const actualizado = await this.db.actualizar<User>(
      this.coleccion,
      id,
      cambios,
    );
    const { password, ...resultado } = actualizado;
    return resultado;
  }

}
