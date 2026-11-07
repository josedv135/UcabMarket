import { Socket } from 'socket.io-client';
import * as request from 'supertest';
import { AppDePrueba, crearAppDePrueba, datosIniciales } from './utilidades/app-de-prueba';

/** Espera un evento del socket; falla si no llega a tiempo */
const esperarEvento = <T = any>(socket: Socket, evento: string, ms = 2000): Promise<T> =>
  new Promise((resolver, rechazar) => {
    const reloj = setTimeout(() => rechazar(new Error(`No llegó el evento ${evento}`)), ms);
    socket.once(evento, (datos: T) => {
      clearTimeout(reloj);
      resolver(datos);
    });
  });

describe('HU Crear Chat', () => {
  let t: AppDePrueba;
  let sockets: Socket[];

  const http = () => request(t.app.getHttpServer());
  const crearChat = (productId: unknown, usuario = 'comprador') =>
    http().post('/chats').set('Authorization', `Bearer ${t.token(usuario)}`).send({ productId });
  const obtener = (ruta: string, usuario = 'comprador') =>
    http().get(ruta).set('Authorization', `Bearer ${t.token(usuario)}`);

  /** Conecta a un miembro y lo une a la sala del chat */
  const entrar = async (usuario: string, chatId = 'chat-1') => {
    const socket = t.conectar(t.token(usuario));
    sockets.push(socket);
    await esperarEvento(socket, 'connect');
    socket.emit('joinChat', { chatId });
    // joinChat no responde nada: esta pausa le da tiempo al servidor para unirlo a la sala
    await new Promise((resolver) => setTimeout(resolver, 100));
    return socket;
  };

  beforeAll(async () => {
    t = await crearAppDePrueba();
  });

  beforeEach(() => {
    sockets = [];
    t.db.cargar(datosIniciales());
  });

  afterEach(() => sockets.forEach((s) => s.disconnect()));

  afterAll(() => t.app.close());

  describe('Crear el chat', () => {
    it('Regla 1: rechaza a quien no tiene sesión', async () => {
      await http().post('/chats').send({ productId: 'activo' }).expect(401);
    });

    it('CA1: crea el chat con el vendedor del producto', async () => {
      await t.db.guardar('chats', []);
      const { body } = await crearChat('activo').expect(201);

      expect(body.producto).toEqual({ id: 'activo', titulo: 'Calculadora' });
      expect(body.comprador).toEqual({ id: 'comprador', nombre: 'Carlos Comprador' });
      expect(body.vendedor).toEqual({ id: 'vendedor', nombre: 'Valeria Vendedora' });
    });

    it('CA3: no entrega contraseña, correo ni teléfono', async () => {
      const { text } = await crearChat('activo').expect(201);

      expect(text).not.toMatch(/password|hash-que-no-debe-salir|email|@ucab|telefono|0414/);
    });

    it('reutiliza el chat si el miembro ya lo tiene por ese producto', async () => {
      const { body } = await crearChat('activo').expect(201);

      expect(body.id).toBe('chat-1');
      expect(await t.db.leer('chats')).toHaveLength(1);
    });

    it('no permite crear un chat sobre el producto propio', async () => {
      await crearChat('activo', 'vendedor').expect(400);
    });

    it('CA5: avisa si el producto no existe', async () => {
      const { body } = await crearChat('no-existe').expect(404);

      expect(body.message).toBe('No se pudo crear el chat: el producto no existe');
    });

    it('CA5: no crea chats sobre un producto eliminado', async () => {
      await crearChat('eliminado').expect(404);

      expect(await t.db.leer('chats')).toHaveLength(1);
    });

    it('rechaza la petición sin producto', async () => {
      await crearChat(undefined).expect(400);
    });

    it('no acepta un vendedor enviado por el cliente', async () => {
      await http()
        .post('/chats')
        .set('Authorization', `Bearer ${t.token('comprador')}`)
        .send({ productId: 'activo', vendedorId: 'tercero' })
        .expect(400);
    });
  });

  describe('Consultar el chat', () => {
    it('CA3: los miembros ven el chat solo con nombres', async () => {
      const { body, text } = await obtener('/chats/chat-1', 'vendedor').expect(200);

      expect(body.comprador.nombre).toBe('Carlos Comprador');
      expect(text).not.toMatch(/password|email|telefono/);
    });

    it('CA6: un tercero no puede ver el chat', async () => {
      await obtener('/chats/chat-1', 'tercero').expect(403);
    });

    it('CA6: un tercero no puede leer los mensajes', async () => {
      await obtener('/chats/chat-1/messages', 'tercero').expect(403);
    });

    it('responde 404 si el chat no existe', async () => {
      await obtener('/chats/no-existe').expect(404);
    });

    it('un chat sigue abriendo si eliminaron su producto', async () => {
      await t.db.actualizar('products', 'activo', { estadoPublicacion: 'ELIMINADO' });
      const { body } = await obtener('/chats/chat-1').expect(200);

      expect(body.producto.titulo).toBe('Producto');
    });

    it('usa un nombre genérico si el vendedor ya no existe', async () => {
      await t.db.eliminar('users', 'vendedor');
      const { body } = await obtener('/chats/chat-1').expect(200);

      expect(body.vendedor.nombre).toBe('Miembro UCAB');
    });
  });

  describe('Enviar mensajes en tiempo real', () => {
    it('Regla 1: desconecta a quien no tiene sesión', async () => {
      const socket = t.conectar('token-falso');
      sockets.push(socket);
      const [aviso] = await Promise.all([
        esperarEvento(socket, 'chatError'),
        esperarEvento(socket, 'disconnect'),
      ]);

      expect(aviso.message).toBe('Debes iniciar sesión para usar el chat');
    });

    it('CA4: el mensaje llega a los dos miembros y queda guardado', async () => {
      const comprador = await entrar('comprador');
      const vendedor = await entrar('vendedor');
      const alComprador = esperarEvento(comprador, 'newMessage');
      const alVendedor = esperarEvento(vendedor, 'newMessage');

      comprador.emit('sendMessage', { chatId: 'chat-1', texto: '  ¿Sigue disponible?  ' });

      expect((await alComprador).texto).toBe('¿Sigue disponible?');
      expect((await alVendedor).texto).toBe('¿Sigue disponible?');
      const { body } = await obtener('/chats/chat-1/messages').expect(200);
      expect(body).toHaveLength(1);
    });

    it('CA6: el autor sale de la sesión, no de lo que mande el cliente', async () => {
      const comprador = await entrar('comprador');
      const recibido = esperarEvento(comprador, 'newMessage');

      comprador.emit('sendMessage', { chatId: 'chat-1', texto: 'Hola', authorId: 'vendedor' });

      expect((await recibido).authorId).toBe('comprador');
    });

    it('CA6: un tercero no puede entrar a la sala', async () => {
      const tercero = t.conectar(t.token('tercero'));
      sockets.push(tercero);
      await esperarEvento(tercero, 'connect');
      const aviso = esperarEvento(tercero, 'chatError');

      tercero.emit('joinChat', { chatId: 'chat-1' });

      expect((await aviso).message).toBe('No perteneces a esta conversación');
    });

    it('CA6: un tercero no recibe los mensajes del chat', async () => {
      const comprador = await entrar('comprador');
      const tercero = await entrar('tercero');
      const espia = jest.fn();
      tercero.on('newMessage', espia);
      const recibido = esperarEvento(comprador, 'newMessage');

      comprador.emit('sendMessage', { chatId: 'chat-1', texto: 'Privado' });
      await recibido;
      await new Promise((resolver) => setTimeout(resolver, 100));

      expect(espia).not.toHaveBeenCalled();
    });

    it('CA6: un tercero no puede escribir en el chat', async () => {
      const tercero = await entrar('tercero');
      const aviso = esperarEvento(tercero, 'chatError');

      tercero.emit('sendMessage', { chatId: 'chat-1', texto: 'Me colé' });

      expect((await aviso).message).toBe('No perteneces a este chat');
      expect(await t.db.leer('messages')).toHaveLength(0);
    });

    it('rechaza un mensaje vacío', async () => {
      const comprador = await entrar('comprador');
      const aviso = esperarEvento(comprador, 'chatError');

      comprador.emit('sendMessage', { chatId: 'chat-1', texto: '   ' });

      expect((await aviso).message).toBe('El mensaje no puede estar vacío');
    });

    it('rechaza un mensaje de más de 1000 caracteres', async () => {
      const comprador = await entrar('comprador');
      const aviso = esperarEvento(comprador, 'chatError');

      comprador.emit('sendMessage', { chatId: 'chat-1', texto: 'a'.repeat(1001) });

      expect((await aviso).message).toBe('El mensaje no puede superar 1000 caracteres');
    });
  });
});
