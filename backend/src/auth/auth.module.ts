import { Module, forwardRef } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      // Sin JWT_SECRET en .env se usa una clave temporal: las sesiones duran hasta reiniciar
      secret: process.env.JWT_SECRET || randomBytes(32).toString('hex'),
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
