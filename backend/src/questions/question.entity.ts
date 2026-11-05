import { BaseEntity } from '../persistence/json-database.service';

export class Question implements BaseEntity {
  id: string;
  productId: string;
  userId: string;
  autorNombre: string;
  contenido: string;
  respuesta?: string;
  fechaPregunta: string;
  fechaRespuesta?: string;
}
