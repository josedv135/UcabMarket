import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registrar(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProfile(@Request() req: any) {
    return this.usersService.buscarPorId(req.user.id);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.buscarPorId(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'Solo puedes modificar los datos de tu propio perfil',
      );
    }
    return this.usersService.actualizar(id, updateUserDto);
  }

  @Get()
  async getAll() {
    return this.usersService.listarTodos();
  }
}
