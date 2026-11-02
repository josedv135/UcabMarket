export class Product {
  id: string;
  vendedorId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  estadoProducto: string;
  fotos: string[];
  estadoPublicacion: 'ACTIVO' | 'PAUSADO' | 'VENDIDO';
  fechaPublicacion: string;
}
