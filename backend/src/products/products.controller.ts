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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { multerProductConfig } from './products.multer';

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

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productsService.buscarPorId(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('fotos', 5, multerProductConfig))
  async createProduct(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    if (!body.titulo || !body.descripcion || body.precio === undefined) {
      throw new BadRequestException('Faltan datos obligatorios para publicar el producto');
    }

    const fotosFilenames = files && files.length > 0 ? files.map((f) => f.filename) : [];

    const dto: CreateProductDto = {
      titulo: body.titulo,
      descripcion: body.descripcion,
      precio: Number(body.precio),
      categoria: body.categoria || 'Otros',
      estadoProducto: body.estadoProducto || 'Usado',
      fotos: fotosFilenames,
    };

    return this.productsService.crear(req.user.id, dto, fotosFilenames);
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
