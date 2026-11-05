/** Id del miembro con sesión, sacado del token que dejó AuthGuard en req.user */
export function usuarioId(user: any): string {
  return user?.id ?? user?.sub;
}
