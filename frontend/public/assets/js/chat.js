/**
 * HU Crear Chat (José) — pasos 7 a 10 y salida 11, en tiempo real con Socket.IO.
 */
let socket = null;
let chatActual = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = api.getCurrentUser();
  if (!user || !api.getToken()) {
    window.location.href = 'index.html';
    return;
  }

  const chatId = new URLSearchParams(window.location.search).get('chatId');
  if (!chatId) {
    mostrarAviso('No se indicó qué chat abrir.');
    return;
  }

  document.getElementById('chatForm').addEventListener('submit', enviarMensaje);
  document.getElementById('btnSalir').addEventListener('click', salir);

  try {
    // 7.- Muestra el chat (solo si soy uno de los dos miembros)
    chatActual = await api.get(`/chats/${encodeURIComponent(chatId)}`);
    pintarEncabezado(user);
    const mensajes = await api.get(`/chats/${encodeURIComponent(chatId)}/messages`);
    mensajes.forEach(renderizarMensaje);
    actualizarVacio();
    conectarSocket();
  } catch (err) {
    mostrarAviso(err.message);
    document.getElementById('btnEnviar').disabled = true;
  }
});

function pintarEncabezado(user) {
  const otro = chatActual.comprador.id === user.id ? chatActual.vendedor : chatActual.comprador;
  document.getElementById('chatTitulo').textContent = `Chat con ${otro.nombre}`;
  document.getElementById('chatProducto').textContent = `Producto: ${chatActual.producto.titulo}`;
}

function conectarSocket() {
  socket = io(CONFIG.SOCKET_URL, {
    auth: { token: api.getToken() },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    socket.emit('joinChat', { chatId: chatActual.id });
  });

  // 10.- Muestra el mensaje actualizado, a los dos miembros, sin recargar
  socket.on('newMessage', (mensaje) => {
    renderizarMensaje(mensaje);
    actualizarVacio();
  });

  socket.on('chatError', (err) => mostrarAviso(err.message));
}

// 9.- Presiona «Enviar»
function enviarMensaje(e) {
  e.preventDefault();
  const input = document.getElementById('mensajeInput');
  const texto = input.value.trim();
  if (!texto || !socket) return;

  socket.emit('sendMessage', { chatId: chatActual.id, texto });
  input.value = '';
  input.focus();
}

// 11.- Salir: cancela y regresa a Consultar producto
function salir() {
  if (socket) socket.disconnect();
  window.location.href = chatActual
    ? `product-detail.html?id=${encodeURIComponent(chatActual.producto.id)}`
    : 'catalog.html';
}

function renderizarMensaje(mensaje) {
  const container = document.getElementById('mensajesContainer');
  const esMio = mensaje.authorId === api.getCurrentUser().id;
  const hora = new Date(mensaje.fecha).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = `d-flex mb-3 ${esMio ? 'justify-content-end' : 'justify-content-start'}`;
  div.innerHTML = `
    <div class="p-3 rounded-3 shadow-sm ${esMio ? 'bg-primary text-white' : 'bg-light text-dark'}" style="max-width: 70%;">
      <p class="mb-1">${escapeHtml(mensaje.texto)}</p>
      <small class="d-block text-end ${esMio ? 'text-white-50' : 'text-muted'}" style="font-size: 0.75rem;">${hora}</small>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function actualizarVacio() {
  const hayMensajes = document.querySelectorAll('#mensajesContainer > .d-flex').length > 0;
  document.getElementById('chatVacio').hidden = hayMensajes;
}

function mostrarAviso(texto) {
  const aviso = document.getElementById('chatAviso');
  aviso.textContent = texto;
  aviso.hidden = false;
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text ?? '').replace(/[&<>"']/g, (m) => map[m]);
}
