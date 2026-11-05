/**
 * HU Crear Chat (José) — pasos 7 a 10 y salida 11, en tiempo real con Socket.IO.
 * HU Añadir archivos (José) — adjunta fotos o documentos a la conversación.
 */
const EXTENSIONES_ARCHIVO = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'zip'];
const MAX_TAMANO_ARCHIVO = 10 * 1024 * 1024; // 10 MB

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
  document.getElementById('btnAdjuntar').addEventListener('click', () => document.getElementById('archivoInput').click());
  document.getElementById('archivoInput').addEventListener('change', adjuntarArchivo);

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

// HU Añadir archivos: valida, sube y el servidor lo muestra a los dos miembros por el socket
async function adjuntarArchivo(e) {
  const archivo = e.target.files[0];
  e.target.value = ''; // permite volver a elegir el mismo archivo
  if (!archivo || !chatActual) return;

  const error = errorDeArchivo(archivo);
  if (error) {
    mostrarAviso(error);
    return;
  }

  const btn = document.getElementById('btnAdjuntar');
  btn.disabled = true;
  ocultarAviso();
  const formData = new FormData();
  formData.append('archivo', archivo);
  try {
    await api.post(`/chats/${encodeURIComponent(chatActual.id)}/archivo`, formData);
  } catch (err) {
    mostrarAviso(err.message);
  } finally {
    btn.disabled = false;
  }
}

function errorDeArchivo(archivo) {
  const extension = archivo.name.split('.').pop().toLowerCase();
  if (!EXTENSIONES_ARCHIVO.includes(extension)) {
    return 'Formato no permitido. Solo se aceptan JPG, PNG, WEBP, PDF, Word o ZIP.';
  }
  if (archivo.size > MAX_TAMANO_ARCHIVO) {
    return 'El archivo pesa más de 10 MB. Elige uno más liviano.';
  }
  return null;
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
      ${contenidoMensaje(mensaje, esMio)}
      <small class="d-block text-end ${esMio ? 'text-white-50' : 'text-muted'}" style="font-size: 0.75rem;">${hora}</small>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function contenidoMensaje(mensaje, esMio) {
  if (!mensaje.archivoUrl) {
    return `<p class="mb-1">${escapeHtml(mensaje.texto)}</p>`;
  }

  const url = `${CONFIG.UPLOAD_URL}/chats/${encodeURIComponent(mensaje.archivoUrl)}`;
  const nombre = escapeHtml(mensaje.archivoNombre || mensaje.archivoUrl);
  if (/\.(jpe?g|png|webp)$/i.test(mensaje.archivoUrl)) {
    return `<a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${nombre}" class="rounded d-block mb-1" style="max-width: 240px; max-height: 240px;"></a>`;
  }
  return `<a href="${url}" target="_blank" rel="noopener" class="d-block mb-1 ${esMio ? 'text-white' : 'text-dark'}"><i class="bi bi-file-earmark-arrow-down me-1"></i>${nombre}</a>`;
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

function ocultarAviso() {
  document.getElementById('chatAviso').hidden = true;
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text ?? '').replace(/[&<>"']/g, (m) => map[m]);
}
