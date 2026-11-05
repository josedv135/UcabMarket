import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const UPLOAD_PATH = path.resolve(__dirname, '..', '..', 'uploads', 'products');
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Regla de negocio 2: máximo 5 fotos de formato válido por publicación
export const MAX_FOTOS = 5;

// Multer acepta hasta 10 archivos para que el controlador pueda responder
// «Error en las imágenes» con un mensaje claro si llegan más de 5 (CA3).
export const MAX_ARCHIVOS_RECIBIDOS = 10;

export const multerProductConfig = {
  storage: diskStorage({
    destination: UPLOAD_PATH,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `prod-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5 MB por imagen
    files: MAX_ARCHIVOS_RECIBIDOS,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Permitir solo imágenes JPEG, PNG y WebP
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException(
          'Error en las imágenes: formato no permitido. Solo se aceptan JPG, PNG o WEBP.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};

/** Borra del disco las fotos subidas cuando la publicación no se guarda. */
export function descartarFotos(files: Express.Multer.File[] = []): void {
  for (const f of files) {
    fs.promises.unlink(f.path).catch(() => undefined);
  }
}
