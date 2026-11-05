import { BaseEntity } from '../persistence/json-database.service';

export class Review implements BaseEntity {
  id: string;
  authorId: string;
  autorNombre: string;
  targetUserId: string;
  puntuacion: number;
  comentario: string;
  productId?: string;
  fecha: string;
}
