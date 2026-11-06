import { BaseEntity } from '../persistence/json-database.service';

export class Message implements BaseEntity {
  id: string;
  chatId: string;
  authorId: string;
  texto?: string;
  archivoUrl?: string;
  fecha: string;
}
