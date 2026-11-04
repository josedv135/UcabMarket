import { BaseEntity } from '../persistence/json-database.service';

export class Product implements BaseEntity {
  id: string;
  userId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  estadoProducto: string;
  fotos: string[];
  estadoPublicacion: 'ACTIVO' | 'PAUSADO' | 'VENDIDO' | 'ELIMINADO';
  fechaCreacion: string;
}
