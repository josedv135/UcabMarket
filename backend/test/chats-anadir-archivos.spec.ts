import * as fs from 'fs';
import * as path from 'path';
import { Socket } from 'socket.io-client';
import * as request from 'supertest';
import { AppDePrueba, crearAppDePrueba, datosIniciales } from './utilidades/app-de-prueba';

// Los archivos de estas pruebas van a una carpeta temporal, nunca a backend/uploads
jest.mock('../src/chats/chats.multer', () => {
  const fsReal = jest.requireActual('fs');
  const osReal = jest.requireActual('os');
  const pathReal = jest.requireActual('path');
  const { diskStorage } = jest.requireActual('multer');
  const real = jest.requireActual('../src/chats/chats.multer');
  const carpetaDePrueba = fsReal.mkdtempSync(pathReal.join(osReal.tmpdir(), 'ucabmarket-pruebas-'));
  return {
    ...real,
    carpetaDePrueba,
    multerChatConfig: {
      ...real.multerChatConfig,
      storage: diskStorage({
        destination: carpetaDePrueba,
        filename: real.multerChatConfig.storage.getFilename,
      }),
    },
  };
});

const { carpetaDePrueba } = jest.requireMock('../src/chats/chats.multer');

const archivosEnDisco = () => fs.readdirSync(carpetaDePrueba);

/** Espera a que se cumpla una condición que ocurre después de responder */
const esperarQue = async (condicion: () => boolean) => {
  for (let i = 0; i < 40 && !condicion(); i++) {
    await new Promise((resolver) => setTimeout(resolver, 25));
  }
};

describe('HU Añadir archivos', () => {
  let t: AppDePrueba;
  let sockets: Socket[];

  const subir = (nombre: string, usuario = 'comprador', contenido = Buffer.from('contenido')) =>
    request(t.app.getHttpServer())
      .post('/chats/chat-1/archivo')
      .set('Authorization', `Bearer ${t.token(usuario)}`)
      .attach('archivo', contenido, nombre);

  beforeAll(async () => {
    t = await crearAppDePrueba();
  });

  beforeEach(() => {
    sockets = [];
    t.db.cargar(datosIniciales());
    archivosEnDisco().forEach((f) => fs.unlinkSync(path.join(carpetaDePrueba, f)));
  });

  afterEach(() => sockets.forEach((s) => s.disconnect()));

  afterAll(async () => {
    await t.app.close();
    fs.rmSync(carpetaDePrueba, { recursive: true, force: true });
  });

  it('rechaza a quien no tiene sesión', async () => {
    await request(t.app.getHttpServer())
      .post('/chats/chat-1/archivo')
      .attach('archivo', Buffer.from('x'), 'tarea.pdf')
      .expect(401);

    expect(archivosEnDisco()).toHaveLength(0);
  });

  it.each(['foto.jpg', 'foto.jpeg', 'foto.png', 'foto.webp', 'guia.pdf', 'guia.doc', 'guia.docx', 'todo.zip'])(
    'acepta %s',
    async (nombre) => {
      const { body } = await subir(nombre).expect(201);

      expect(body.archivoNombre).toBe(nombre);
      expect(archivosEnDisco()).toEqual([body.archivoUrl]);
    },
  );

  it('guarda el archivo como un mensaje del miembro con sesión', async () => {
    await subir('guia.pdf', 'vendedor').expect(201);

    const mensajes = await t.db.leer<any>('messages');
    expect(mensajes).toHaveLength(1);
    expect(mensajes[0]).toMatchObject({ chatId: 'chat-1', authorId: 'vendedor', archivoNombre: 'guia.pdf' });
  });

  it('conserva los acentos y la ñ del nombre', async () => {
    const { body } = await subir('Añadir reseña.pdf').expect(201);

    expect(body.archivoNombre).toBe('Añadir reseña.pdf');
  });

  it('avisa en vivo a los miembros del chat', async () => {
    const vendedor = t.conectar(t.token('vendedor'));
    sockets.push(vendedor);
    await new Promise<void>((resolver) => vendedor.once('connect', () => resolver()));
    vendedor.emit('joinChat', { chatId: 'chat-1' });
    await new Promise((resolver) => setTimeout(resolver, 100));
    const recibido = new Promise<any>((resolver) => vendedor.once('newMessage', resolver));

    await subir('guia.pdf').expect(201);

    expect((await recibido).archivoNombre).toBe('guia.pdf');
  });

  it.each(['virus.exe', 'pagina.html', 'script.js', 'sin-extension'])('rechaza %s', async (nombre) => {
    const { body } = await subir(nombre).expect(400);

    expect(body.message).toBe('Formato no permitido. Solo se aceptan JPG, PNG, WEBP, PDF, Word o ZIP.');
    expect(archivosEnDisco()).toHaveLength(0);
    expect(await t.db.leer('messages')).toHaveLength(0);
  });

  it('pide un archivo si no se envió ninguno', async () => {
    const { body } = await request(t.app.getHttpServer())
      .post('/chats/chat-1/archivo')
      .set('Authorization', `Bearer ${t.token('comprador')}`)
      .expect(400);

    expect(body.message).toBe('Selecciona un archivo para enviarlo');
  });

  it('acepta un archivo de 10 MB exactos', async () => {
    await subir('grande.zip', 'comprador', Buffer.alloc(10 * 1024 * 1024)).expect(201);
  });

  it('rechaza un archivo de más de 10 MB y no lo deja en disco', async () => {
    await subir('grande.zip', 'comprador', Buffer.alloc(10 * 1024 * 1024 + 1)).expect(413);

    await esperarQue(() => archivosEnDisco().length === 0);
    expect(archivosEnDisco()).toHaveLength(0);
    expect(await t.db.leer('messages')).toHaveLength(0);
  });

  it('un tercero no puede subir archivos y su archivo no queda en disco', async () => {
    await subir('guia.pdf', 'tercero').expect(403);

    await esperarQue(() => archivosEnDisco().length === 0);
    expect(archivosEnDisco()).toHaveLength(0);
    expect(await t.db.leer('messages')).toHaveLength(0);
  });
});
