import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const UPLOAD_PATH = path.resolve(__dirname, '..', '..', 'uploads', 'products');
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

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
    files: 5,                  // Máximo 5 fotos por publicación
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Permitir solo imágenes JPEG, PNG y WebP
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException('Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.'),
        false,
      );
    }
    cb(null, true);
  },
};
