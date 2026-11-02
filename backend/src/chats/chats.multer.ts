import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const UPLOAD_PATH = path.resolve(__dirname, '..', '..', 'uploads', 'chats');
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

export const multerChatConfig = {
  storage: diskStorage({
    destination: UPLOAD_PATH,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `chat-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // Máximo 10 MB por archivo adjunto
    files: 1,                   // 1 archivo adjunto por envío
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Permitir PDFs, documentos y formatos de imagen comunes
    const allowed = /\/(jpg|jpeg|png|webp|pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|zip)$/;
    if (!file.mimetype.match(allowed)) {
      return cb(
        new BadRequestException('Tipo de archivo no permitido. Solo se aceptan imágenes, PDF, DOCX o ZIP.'),
        false,
      );
    }
    cb(null, true);
  },
};
