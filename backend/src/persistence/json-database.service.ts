import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

export interface BaseEntity {
  id: string;
  [key: string]: any;
}

@Injectable()
export class JsonDatabaseService {
  private readonly dataPath: string;

  constructor() {
    const candidates = [
      path.resolve(process.cwd(), 'src', 'persistence', 'data'),
      path.resolve(process.cwd(), 'backend', 'src', 'persistence', 'data'),
      path.resolve(__dirname, '..', '..', 'src', 'persistence', 'data'),
      path.resolve(__dirname, 'data'),
    ];
    let found = candidates.find((dir) => fsSync.existsSync(dir));
    if (!found) {
      found = candidates[0];
      fsSync.mkdirSync(found, { recursive: true });
    }
    this.dataPath = found;
  }

  private getFilePath(filename: string): string {
    const cleanName = filename.endsWith('.json') ? filename : `${filename}.json`;
    return path.join(this.dataPath, cleanName);
  }

  /**
   * Lee todos los registros de una entidad JSON.
   */
  async leer<T>(nombreArchivo: string): Promise<T[]> {
    const filePath = this.getFilePath(nombreArchivo);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      if (!content.trim()) return [];
      return JSON.parse(content) as T[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, crearlo con un arreglo vacío
        await this.guardar(nombreArchivo, []);
        return [];
      }
      throw new InternalServerErrorException(`Error al leer archivo ${nombreArchivo}: ${error.message}`);
    }
  }

  /**
   * Sobrescribe completamente la lista de registros de una entidad JSON.
   */
  async guardar<T>(nombreArchivo: string, datos: T[]): Promise<void> {
    const filePath = this.getFilePath(nombreArchivo);
    try {
      await fs.writeFile(filePath, JSON.stringify(datos, null, 2), 'utf-8');
    } catch (error: any) {
      throw new InternalServerErrorException(`Error al guardar en archivo ${nombreArchivo}: ${error.message}`);
    }
  }

  /**
   * Busca un registro por su ID único.
   */
  async buscarPorId<T extends BaseEntity>(nombreArchivo: string, id: string): Promise<T | null> {
    const coleccion = await this.leer<T>(nombreArchivo);
    const encontrado = coleccion.find((item) => item.id === id);
    return encontrado || null;
  }

  /**
   * Inserta un nuevo registro con ID autogenerado si no lo posee.
   */
  async insertar<T extends BaseEntity>(nombreArchivo: string, nuevoElemento: T): Promise<T> {
    const coleccion = await this.leer<T>(nombreArchivo);
    if (!nuevoElemento.id) {
      nuevoElemento.id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    coleccion.push(nuevoElemento);
    await this.guardar(nombreArchivo, coleccion);
    return nuevoElemento;
  }

  /**
   * Actualiza parcialmente un registro existente por su ID.
   */
  async actualizar<T extends BaseEntity>(
    nombreArchivo: string,
    id: string,
    cambios: Partial<T>,
  ): Promise<T> {
    const coleccion = await this.leer<T>(nombreArchivo);
    const index = coleccion.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Elemento con ID ${id} no encontrado en ${nombreArchivo}`);
    }
    const actualizado = { ...coleccion[index], ...cambios, id };
    coleccion[index] = actualizado;
    await this.guardar(nombreArchivo, coleccion);
    return actualizado;
  }

  /**
   * Elimina un registro por su ID.
   */
  async eliminar<T extends BaseEntity>(nombreArchivo: string, id: string): Promise<boolean> {
    const coleccion = await this.leer<T>(nombreArchivo);
    const filtrados = coleccion.filter((item) => item.id !== id);
    if (filtrados.length === coleccion.length) {
      return false;
    }
    await this.guardar(nombreArchivo, filtrados);
    return true;
  }
}
