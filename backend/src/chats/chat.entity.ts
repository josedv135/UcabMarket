import { BaseEntity } from '../persistence/json-database.service';

export class Chat implements BaseEntity {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  fechaCreacion: string;
}
