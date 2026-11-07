import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../src/app.module';
import { JsonDatabaseService } from '../../src/persistence/json-database.service';
import { BaseDatosEnMemoria } from './base-datos-en-memoria';

const usuario = (id: string, nombreCompleto: string) => ({
  id,
  nombreCompleto,
  email: `${id}@ucab.edu.ve`,
  password: 'hash-que-no-debe-salir',
  carrera: 'Ingeniería Informática',
  telefono: '04140000000',
  fechaRegistro: '2026-01-01T00:00:00.000Z',
});

const producto = (id: string, titulo: string, estadoPublicacion = 'ACTIVO') => ({
  id,
  userId: 'vendedor',
  titulo,
  descripcion: 'Producto de prueba',
  precio: 10,
  categoria: 'Otros',
  estadoProducto: 'Usado',
  fotos: [],
  estadoPublicacion,
  fechaCreacion: '2026-01-01T00:00:00.000Z',
});

/** Datos iniciales de cada prueba: vendedor, comprador y un tercero ajeno al chat */
export const datosIniciales = () => ({
  users: [
    usuario('vendedor', 'Valeria Vendedora'),
    usuario('comprador', 'Carlos Comprador'),
    usuario('tercero', 'Tomás Tercero'),
  ],
  products: [producto('activo', 'Calculadora'), producto('eliminado', 'Morral', 'ELIMINADO')],
  chats: [
    {
      id: 'chat-1',
      productId: 'activo',
      compradorId: 'comprador',
      vendedorId: 'vendedor',
      fechaCreacion: '2026-01-01T00:00:00.000Z',
    },
  ],
  messages: [],
});

export interface AppDePrueba {
  app: INestApplication;
  db: BaseDatosEnMemoria;
  url: string;
  token: (id: string) => string;
  conectar: (token?: string) => Socket;
}

/** Levanta la aplicación real (módulos, guardas y validación) con la base en memoria */
export async function crearAppDePrueba(): Promise<AppDePrueba> {
  const db = new BaseDatosEnMemoria();
  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(JsonDatabaseService)
    .useValue(db)
    .compile();

  const app = modulo.createNestApplication();
  // Igual que en main.ts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(0);

  const { port } = app.getHttpServer().address() as AddressInfo;
  const url = `http://localhost:${port}`;
  const jwt = app.get(JwtService);

  return {
    app,
    db,
    url,
    token: (id) => jwt.sign({ id, email: `${id}@ucab.edu.ve` }),
    conectar: (token) => io(url, { auth: { token }, transports: ['websocket'], forceNew: true, reconnection: false }),
  };
}
