import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS para el frontend (cliente web de escritorio y live server)
  const defaultOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ];
  const envOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
    : [];
  const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

  app.enableCors({
    origin: (origin, callback) => { if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error("Bloqueado por CORS"), false); } },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Servir frontend directamente en http://localhost:3000
  const candidatesFrontend = [
    path.resolve(process.cwd(), '..', 'frontend', 'public'),
    path.resolve(process.cwd(), 'frontend', 'public'),
    path.resolve(__dirname, '..', '..', 'frontend', 'public'),
  ];
  const frontendPath = candidatesFrontend.find((p) => fs.existsSync(p));
  if (frontendPath) {
    app.useStaticAssets(frontendPath);
  }

  // Servir archivos estáticos de uploads (fotos de productos y adjuntos)
  const candidatesUploads = [
    path.resolve(process.cwd(), 'uploads'),
    path.resolve(process.cwd(), 'backend', 'uploads'),
    path.resolve(__dirname, '..', '..', 'uploads'),
  ];
  let uploadsPath = candidatesUploads.find((p) => fs.existsSync(p));
  if (!uploadsPath) {
    uploadsPath = candidatesUploads[0];
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[UcabMarket Backend] Servidor ejecutándose en http://localhost:${port}`);
  console.log(`[UcabMarket Frontend] Aplicación disponible en http://localhost:${port}`);
}
bootstrap();
