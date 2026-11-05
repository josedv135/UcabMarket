import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  multerProductConfig,
  descartarFotos,
  MAX_FOTOS,
  MAX_ARCHIVOS_RECIBIDOS,
} from './products.multer';

// Valida el cuerpo multipart de forma manual para poder borrar las fotos
// subidas si los datos no son válidos (el pipe global corre después de multer).
const validarProducto = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getCatalog(
    @Query('q') q?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.productsService.listar(q, categoria);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.productsService.listarPorUsuario(userId);
  }

  /**
   * HU Consultar Producto: detalle de una publicación con los datos
   * públicos del vendedor. Solo para miembros con sesión iniciada.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productsService.consultar(id);
  }

  /**
   * CU Añadir Producto, paso 6: verifica el producto antes de mostrar
   * el «Resumen de Producto». Responde 409 «Producto ya existente» (CA4).
   */
  @UseGuards(AuthGuard)
  @Post('validar')
  async validarNuevoProducto(@Body() dto: CreateProductDto, @Request() req: any) {
    await this.productsService.verificarNuevo(req.user.id, dto);
    return { valido: true };
  }

  /**
   * CU Añadir Producto, paso 9: guarda el producto al presionar «Publicar».
   */
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('fotos', MAX_ARCHIVOS_RECIBIDOS, multerProductConfig))
  async createProduct(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Request() req: any,
  ) {
    try {
      // Regla de negocio 2 / CA3
      if (files.length > MAX_FOTOS) {
        throw new BadRequestException(
          `Error en las imágenes: se permiten como máximo ${MAX_FOTOS} fotos por publicación`,
        );
      }

      // Regla de negocio 4 / CA2: no se guardan productos vacíos
      const dto: CreateProductDto = await validarProducto.transform(body, {
        type: 'body',
        metatype: CreateProductDto,
      });

      const fotos = files.map((f) => f.filename);
      return await this.productsService.crear(req.user.id, dto, fotos);
    } catch (err) {
      descartarFotos(files);
      throw err;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('fotos', 5, multerProductConfig))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    const fotos = files && files.length > 0 ? files.map((f) => f.filename) : undefined;
    return this.productsService.actualizar(id, req.user.id, updateProductDto, fotos);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Request() req: any) {
    return this.productsService.eliminar(id, req.user.id);
  }
}
