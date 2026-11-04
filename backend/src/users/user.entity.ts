import { BaseEntity } from '../persistence/json-database.service';

export class User implements BaseEntity {
  id: string;
  nombreCompleto: string;
  email: string;
  password?: string;
  carrera: string;
  telefono?: string;
  fotoPerfil?: string;
  fechaRegistro: string;
}
