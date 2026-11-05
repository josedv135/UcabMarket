import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { User } from '../users/user.entity';

/** Datos del vendedor que se muestran al consultar un producto (sin correo ni teléfono). */
export interface VendedorPublico {
  id: string;
  nombreCompleto: string;
  carrera?: string;
}

export type ProductoConsultado = Product & { vendedor: VendedorPublico | null };

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

  /** HU Consultar Producto: el producto con los datos públicos de su vendedor. */
  async consultar(id: string): Promise<ProductoConsultado> {
    const producto = await this.buscarPorId(id);
    const usuario = await this.db.buscarPorId<User & { id: string }>('users', producto.userId);
    const vendedor = usuario
      ? { id: usuario.id, nombreCompleto: usuario.nombreCompleto, carrera: usuario.carrera }
      : null;
    return { ...producto, vendedor };
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

  /**
   * Regla de negocio 4: no se permiten productos duplicados.
   * Se considera duplicado si el mismo miembro ya tiene una publicación
   * activa con el mismo título (sin distinguir mayúsculas, acentos ni espacios extra).
   */
  async existeDuplicado(userId: string, titulo: string): Promise<boolean> {
    const clave = normalizarTitulo(titulo);
    const productos = await this.db.leer<Product>(this.coleccion);
    return productos.some(
      (p) =>
        p.userId === userId &&
        p.estadoPublicacion !== 'ELIMINADO' &&
        normalizarTitulo(p.titulo) === clave,
    );
  }

  /** Paso 6 del CU Añadir Producto: verifica el producto antes del resumen. */
  async verificarNuevo(userId: string, dto: CreateProductDto): Promise<void> {
    if (await this.existeDuplicado(userId, dto.titulo)) {
      throw new ConflictException('Producto ya existente');
    }
  }

  /** Paso 9 del CU Añadir Producto: guarda el producto. */
  async crear(
    userId: string,
    dto: CreateProductDto,
    fotos: string[] = [],
  ): Promise<Product> {
    // Se vuelve a verificar por si se publicó otro igual entre el resumen y el guardado
    await this.verificarNuevo(userId, dto);

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

    try {
      return await this.db.insertar<Product>(this.coleccion, nuevoProducto);
    } catch {
      // Flujo alterno 9.1: se perdió la conexión con el archivo de datos
      throw new ServiceUnavailableException('Error de conexión');
    }
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

function normalizarTitulo(titulo: string): string {
  return (titulo || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
