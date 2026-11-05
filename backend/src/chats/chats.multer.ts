import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const UPLOAD_PATH = path.resolve(__dirname, '..', '..', 'uploads', 'chats');
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Se revisa la extensión porque es lo que decide cómo se sirve el archivo después
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx', '.zip'];

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
    const ext = path.extname(file.originalname).toLowerCase();
    if (!EXTENSIONES_PERMITIDAS.includes(ext)) {
      return cb(
        new BadRequestException('Formato no permitido. Solo se aceptan JPG, PNG, WEBP, PDF, Word o ZIP.'),
        false,
      );
    }
    cb(null, true);
  },
};

/** Multer entrega el nombre en latin1; sin esto «Añadir.pdf» se vería dañado en el chat. */
export function nombreOriginal(file: Express.Multer.File): string {
  return Buffer.from(file.originalname, 'latin1').toString('utf8');
}

/** Borra del disco el archivo subido cuando el mensaje no se guarda. */
export function descartarArchivo(file: Express.Multer.File): void {
  fs.promises.unlink(file.path).catch(() => undefined);
}
