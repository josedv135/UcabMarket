import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuarioActual, UsuarioSesion } from '../auth/decorators/usuario-actual.decorator';
import { multerAvatarConfig } from './users.multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registrar(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProfile(@UsuarioActual() usuario: UsuarioSesion) {
    return this.usersService.buscarPorId(usuario.id);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.perfilPublico(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    if (usuario.id !== id) {
      throw new ForbiddenException(
        'Solo puedes modificar los datos de tu propio perfil',
      );
    }
    return this.usersService.actualizar(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerAvatarConfig))
  async subirAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @UsuarioActual() usuario: UsuarioSesion,
  ) {
    if (usuario.id !== id) {
      throw new ForbiddenException(
        'Solo puedes subir foto a tu propio perfil',
      );
    }
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : '';
    return this.usersService.actualizar(id, { fotoPerfil: avatarUrl });
  }
}
