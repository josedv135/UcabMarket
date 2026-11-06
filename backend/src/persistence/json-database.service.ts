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

  // Cola por archivo: dos operaciones sobre el mismo JSON corren una tras otra y no se pisan
  private readonly colas = new Map<string, Promise<unknown>>();

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

  private enCola<R>(nombreArchivo: string, tarea: () => Promise<R>): Promise<R> {
    const anterior = this.colas.get(nombreArchivo) ?? Promise.resolve();
    const actual = anterior.then(tarea);
    this.colas.set(nombreArchivo, actual.catch(() => undefined));
    return actual;
  }

  /**
   * Lee todos los registros de una entidad JSON.
   */
  leer<T>(nombreArchivo: string): Promise<T[]> {
    return this.enCola(nombreArchivo, () => this.leerArchivo<T>(nombreArchivo));
  }

  private async leerArchivo<T>(nombreArchivo: string): Promise<T[]> {
    const filePath = this.getFilePath(nombreArchivo);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      if (!content.trim()) return [];
      return JSON.parse(content) as T[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, crearlo con un arreglo vacío
        await this.guardarArchivo(nombreArchivo, []);
        return [];
      }
      throw new InternalServerErrorException(`Error al leer archivo ${nombreArchivo}: ${error.message}`);
    }
  }

  /**
   * Sobrescribe completamente la lista de registros de una entidad JSON.
   */
  guardar<T>(nombreArchivo: string, datos: T[]): Promise<void> {
    return this.enCola(nombreArchivo, () => this.guardarArchivo(nombreArchivo, datos));
  }

  private async guardarArchivo<T>(nombreArchivo: string, datos: T[]): Promise<void> {
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
  insertar<T extends BaseEntity>(nombreArchivo: string, nuevoElemento: T): Promise<T> {
    return this.enCola(nombreArchivo, async () => {
      const coleccion = await this.leerArchivo<T>(nombreArchivo);
      if (!nuevoElemento.id) {
        nuevoElemento.id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }
      coleccion.push(nuevoElemento);
      await this.guardarArchivo(nombreArchivo, coleccion);
      return nuevoElemento;
    });
  }

  /**
   * Actualiza parcialmente un registro existente por su ID.
   */
  actualizar<T extends BaseEntity>(
    nombreArchivo: string,
    id: string,
    cambios: Partial<T>,
  ): Promise<T> {
    return this.enCola(nombreArchivo, async () => {
      const coleccion = await this.leerArchivo<T>(nombreArchivo);
      const index = coleccion.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Elemento con ID ${id} no encontrado en ${nombreArchivo}`);
      }
      const actualizado = { ...coleccion[index], ...cambios, id };
      coleccion[index] = actualizado;
      await this.guardarArchivo(nombreArchivo, coleccion);
      return actualizado;
    });
  }

  /**
   * Elimina un registro por su ID.
   */
  eliminar<T extends BaseEntity>(nombreArchivo: string, id: string): Promise<boolean> {
    return this.enCola(nombreArchivo, async () => {
      const coleccion = await this.leerArchivo<T>(nombreArchivo);
      const filtrados = coleccion.filter((item) => item.id !== id);
      if (filtrados.length === coleccion.length) {
        return false;
      }
      await this.guardarArchivo(nombreArchivo, filtrados);
      return true;
    });
  }
}
