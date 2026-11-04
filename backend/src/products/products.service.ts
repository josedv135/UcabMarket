import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  private readonly coleccion = 'products';

  constructor(private readonly db: JsonDatabaseService) {}

  async listar(q?: string, categoria?: string): Promise<Product[]> {
    const productos = await this.db.leer<Product>(this.coleccion);
    let filtrados = productos.filter((p) => p.estadoPublicacion !== 'ELIMINADO');

    if (categoria && categoria.trim()) {
      filtrados = filtrados.filter(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase().trim(),
      );
    }

    if (q && q.trim()) {
      const termino = q.toLowerCase().trim();
      filtrados = filtrados.filter(
        (p) =>
          p.titulo.toLowerCase().includes(termino) ||
          p.descripcion.toLowerCase().includes(termino),
      );
    }

    // Ordenar de más reciente a más antiguo
    return filtrados.sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
    );
  }

  async buscarPorId(id: string): Promise<Product> {
    const producto = await this.db.buscarPorId<Product>(this.coleccion, id);
    if (!producto || producto.estadoPublicacion === 'ELIMINADO') {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async listarPorUsuario(userId: string): Promise<Product[]> {
    const productos = await this.db.leer<Product>(this.coleccion);
    return productos
      .filter((p) => p.userId === userId && p.estadoPublicacion !== 'ELIMINADO')
      .sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime(),
      );
  }

  async crear(
    userId: string,
    dto: CreateProductDto,
    fotos: string[] = [],
  ): Promise<Product> {
    const nuevoProducto: Product = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      userId,
      titulo: dto.titulo.trim(),
      descripcion: dto.descripcion.trim(),
      precio: Number(dto.precio),
      categoria: dto.categoria.trim(),
      estadoProducto: dto.estadoProducto.trim(),
      fotos: fotos.length > 0 ? fotos : (dto.fotos || []),
      estadoPublicacion: 'ACTIVO',
      fechaCreacion: new Date().toISOString(),
    };

    return this.db.insertar<Product>(this.coleccion, nuevoProducto);
  }

  async actualizar(
    id: string,
    userId: string,
    dto: UpdateProductDto,
    nuevasFotos?: string[],
  ): Promise<Product> {
    const producto = await this.buscarPorId(id);
    if (producto.userId !== userId) {
      throw new ForbiddenException(
        'Operación no permitida: Solo el creador de la publicación puede modificarla',
      );
    }

    const cambios: Partial<Product> = {};
    if (dto.titulo) cambios.titulo = dto.titulo.trim();
    if (dto.descripcion) cambios.descripcion = dto.descripcion.trim();
    if (dto.precio !== undefined) cambios.precio = Number(dto.precio);
    if (dto.categoria) cambios.categoria = dto.categoria.trim();
    if (dto.estadoProducto) cambios.estadoProducto = dto.estadoProducto.trim();
    if (dto.estadoPublicacion) cambios.estadoPublicacion = dto.estadoPublicacion;
    if (nuevasFotos && nuevasFotos.length > 0) {
      cambios.fotos = nuevasFotos;
    } else if (dto.fotos !== undefined) {
      cambios.fotos = dto.fotos;
    }

    return this.db.actualizar<Product>(this.coleccion, id, cambios);
  }

  async eliminar(id: string, userId: string): Promise<boolean> {
    const producto = await this.buscarPorId(id);
    if (producto.userId !== userId) {
      throw new ForbiddenException(
        'Operación no permitida: Solo el creador de la publicación puede eliminarla',
      );
    }

    await this.db.actualizar<Product>(this.coleccion, id, {
      estadoPublicacion: 'ELIMINADO',
    });
    return true;
  }
}
