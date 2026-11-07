type Registro = { id: string; [campo: string]: any };

const copiar = <T>(valor: T): T => JSON.parse(JSON.stringify(valor));

/**
 * Reemplaza a JsonDatabaseService durante las pruebas: guarda todo en memoria,
 * así ninguna prueba lee ni modifica los archivos de persistence/data.
 */
export class BaseDatosEnMemoria {
  private colecciones = new Map<string, Registro[]>();
  private contador = 0;

  /** Deja la base con estos datos antes de cada prueba */
  cargar(datos: Record<string, Registro[]>): void {
    this.colecciones = new Map(Object.entries(copiar(datos)));
  }

  async leer<T>(coleccion: string): Promise<T[]> {
    return copiar(this.colecciones.get(coleccion) ?? []) as unknown as T[];
  }

  async guardar<T>(coleccion: string, datos: T[]): Promise<void> {
    this.colecciones.set(coleccion, copiar(datos) as unknown as Registro[]);
  }

  async buscarPorId<T>(coleccion: string, id: string): Promise<T | null> {
    const registros = await this.leer<Registro>(coleccion);
    return (registros.find((r) => r.id === id) as unknown as T) ?? null;
  }

  async insertar<T extends Registro>(coleccion: string, elemento: T): Promise<T> {
    const nuevo = copiar(elemento);
    if (!nuevo.id) {
      this.contador += 1;
      nuevo.id = `${coleccion}-${this.contador}`;
    }
    const registros = this.colecciones.get(coleccion) ?? [];
    registros.push(copiar(nuevo));
    this.colecciones.set(coleccion, registros);
    return nuevo;
  }

  async actualizar<T extends Registro>(coleccion: string, id: string, cambios: Partial<T>): Promise<T> {
    const registros = this.colecciones.get(coleccion) ?? [];
    const indice = registros.findIndex((r) => r.id === id);
    registros[indice] = { ...registros[indice], ...copiar(cambios) };
    return copiar(registros[indice]) as T;
  }

  async eliminar(coleccion: string, id: string): Promise<boolean> {
    const registros = this.colecciones.get(coleccion) ?? [];
    this.colecciones.set(coleccion, registros.filter((r) => r.id !== id));
    return true;
  }
}
