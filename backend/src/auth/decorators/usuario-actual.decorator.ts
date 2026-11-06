import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Datos del miembro con sesión que AuthGuard saca del token */
export interface UsuarioSesion {
  id: string;
  email: string;
  nombreCompleto: string;
}

/** Entrega al controlador el miembro con sesión: `@UsuarioActual() usuario: UsuarioSesion` */
export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UsuarioSesion => ctx.switchToHttp().getRequest().user,
);
