import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';
import { ProductsService } from '../products/products.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  private readonly coleccion = 'questions';

  constructor(
    private readonly db: JsonDatabaseService,
    private readonly productsService: ProductsService,
  ) {}

  async listarPorProducto(productId: string): Promise<Question[]> {
    const preguntas = await this.db.leer<Question>(this.coleccion);
    return preguntas
      .filter((q) => q.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.fechaPregunta).getTime() -
          new Date(a.fechaPregunta).getTime(),
      );
  }

  async crear(
    userId: string,
    autorNombre: string,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    // Validar que el producto existe
    const producto = await this.productsService.buscarPorId(dto.productId);

    // El vendedor no puede preguntar en su propia publicación
    if (producto.userId === userId) {
      throw new ForbiddenException(
        'No puedes hacer preguntas en tu propia publicación',
      );
    }

    const nuevaPregunta: Question = {
      id: '',
      productId: dto.productId,
      userId,
      autorNombre: autorNombre || 'Estudiante UCAB',
      contenido: dto.contenido.trim(),
      fechaPregunta: new Date().toISOString(),
    };

    return this.db.insertar<Question>(this.coleccion, nuevaPregunta);
  }

  async responder(
    questionId: string,
    userId: string,
    dto: UpdateQuestionDto,
  ): Promise<Question> {
    const pregunta = await this.db.buscarPorId<Question>(
      this.coleccion,
      questionId,
    );
    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${questionId} no encontrada`);
    }

    // Validar que el usuario es el vendedor del producto
    const producto = await this.productsService.buscarPorId(pregunta.productId);
    if (producto.userId !== userId) {
      throw new ForbiddenException(
        'Solo el vendedor de este producto puede responder la pregunta',
      );
    }

    // Cada pregunta se responde una sola vez
    if (pregunta.respuesta) {
      throw new ConflictException('Esta pregunta ya fue respondida');
    }

    return this.db.actualizar<Question>(this.coleccion, questionId, {
      respuesta: dto.respuesta.trim(),
      fechaRespuesta: new Date().toISOString(),
    });
  }
}
