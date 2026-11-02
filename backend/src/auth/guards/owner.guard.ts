import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceOwnerId = request.body?.userId || request.params?.userId || request.resource?.userId;

    if (!user) {
      throw new ForbiddenException('No hay un usuario autenticado en la solicitud');
    }

    if (resourceOwnerId && user.id !== resourceOwnerId) {
      throw new ForbiddenException('Operación no permitida: Solo el propietario puede modificar este recurso');
    }

    return true;
  }
}
