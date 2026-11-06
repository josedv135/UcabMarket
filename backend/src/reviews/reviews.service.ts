import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  private readonly coleccion = 'reviews';

  constructor(private readonly db: JsonDatabaseService) {}

  async listarPorUsuario(targetUserId: string): Promise<Review[]> {
    const resenas = await this.db.leer<Review>(this.coleccion);
    return resenas
      .filter((r) => r.targetUserId === targetUserId)
      .sort(
        (a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
  }

  async crear(
    authorId: string,
    autorNombre: string,
    dto: CreateReviewDto,
  ): Promise<Review> {
    if (authorId === dto.targetUserId) {
      throw new BadRequestException(
        'No puedes registrar una reseña sobre tu propio perfil',
      );
    }

    const nuevaResena: Review = {
      id: '',
      authorId,
      autorNombre: autorNombre || 'Compañero UCAB',
      targetUserId: dto.targetUserId,
      puntuacion: Number(dto.puntuacion),
      comentario: dto.comentario.trim(),
      productId: dto.productId || undefined,
      fecha: new Date().toISOString(),
    };

    return this.db.insertar<Review>(this.coleccion, nuevaResena);
  }

  async actualizar(
    id: string,
    authorId: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    const resena = await this.db.buscarPorId<Review>(this.coleccion, id);
    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    if (resena.authorId !== authorId) {
      throw new ForbiddenException(
        'Operación no permitida: Solo el autor puede editar su reseña',
      );
    }

    const cambios: Partial<Review> = {};
    if (dto.puntuacion !== undefined) cambios.puntuacion = Number(dto.puntuacion);
    if (dto.comentario) cambios.comentario = dto.comentario.trim();

    return this.db.actualizar<Review>(this.coleccion, id, cambios);
  }

  async eliminar(id: string, authorId: string): Promise<boolean> {
    const resena = await this.db.buscarPorId<Review>(this.coleccion, id);
    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    if (resena.authorId !== authorId) {
      throw new ForbiddenException(
        'Operación no permitida: Solo el autor puede eliminar su reseña',
      );
    }

    return this.db.eliminar<Review>(this.coleccion, id);
  }
}
