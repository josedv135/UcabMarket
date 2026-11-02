/**
 * Lógica del chat en tiempo real para UcabMarket
 * Conexión mediante cliente Socket.IO (CDN jsDelivr)
 */
let socket = null;
let currentChatId = null;

document.addEventListener('DOMContentLoaded', () => {
  const user = api.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Obtener chatId de la URL (?chatId=...)
  const params = new URLSearchParams(window.location.search);
  currentChatId = params.get('chatId');

  // Inicializar la conexión Socket.IO usando CONFIG.SOCKET_URL
  inicializarSocket(user);

  // Configurar listeners de interfaz
  const chatForm = document.getElementById('chatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', enviarMensaje);
  }
});

function inicializarSocket(user) {
  // Conexión al servidor WebSocket de NestJS
  socket = io(CONFIG.SOCKET_URL, {
    auth: {
      token: api.getToken(),
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Conectado al servidor con ID:', socket.id);
    if (currentChatId) {
      // Unirse a la sala privada del chat (validado por ISO 25010 en backend)
      socket.emit('joinChat', {
        chatId: currentChatId,
        userId: user.id,
      });
    }
  });

  // Escuchar nuevos mensajes entrantes sin recargar la página
  socket.on('newMessage', (mensaje) => {
    renderizarMensaje(mensaje);
  });

  // Manejo de errores de autorización/seguridad
  socket.on('error', (err) => {
    alert(err.message || 'Error en el chat');
  });
}

async function enviarMensaje(e) {
  e.preventDefault();
  const inputTexto = document.getElementById('mensajeInput');
  const inputArchivo = document.getElementById('archivoInput');
  const user = api.getCurrentUser();

  const texto = inputTexto ? inputTexto.value.trim() : '';
  const archivo = inputArchivo?.files?.[0];

  if (!texto && !archivo) return;

  let archivoUrl = null;

  // Si incluye archivo adjunto, se sube primero vía endpoint Multer
  if (archivo) {
    const formData = new FormData();
    formData.append('file', archivo);
    try {
      const res = await api.post('/chats/upload', formData);
      archivoUrl = res.url;
    } catch (err) {
      alert('Error al subir archivo adjunto: ' + err.message);
      return;
    }
  }

  // Emitir evento por Socket.IO para entrega instantánea
  socket.emit('sendMessage', {
    chatId: currentChatId,
    authorId: user.id,
    texto,
    archivoUrl,
    fecha: new Date().toISOString(),
  });

  if (inputTexto) inputTexto.value = '';
  if (inputArchivo) inputArchivo.value = '';
}

function renderizarMensaje(mensaje) {
  const container = document.getElementById('mensajesContainer');
  if (!container) return;

  const user = api.getCurrentUser();
  const esMio = mensaje.authorId === user.id;

  const div = document.createElement('div');
  div.className = `d-flex mb-3 ${esMio ? 'justify-content-end' : 'justify-content-start'}`;

  const hora = new Date(mensaje.fecha || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  div.innerHTML = `
    <div class="p-3 rounded-3 shadow-sm ${esMio ? 'bg-primary text-white' : 'bg-light text-dark'}" style="max-width: 70%;">
      ${mensaje.texto ? `<p class="mb-1">${escapeHtml(mensaje.texto)}</p>` : ''}
      ${mensaje.archivoUrl ? `<a href="${CONFIG.UPLOAD_URL}/chats/${mensaje.archivoUrl}" target="_blank" class="${esMio ? 'text-white text-decoration-underline' : 'text-primary'}">📎 Ver archivo adjunto</a>` : ''}
      <small class="d-block text-end ${esMio ? 'text-white-50' : 'text-muted'}" style="font-size: 0.75rem;">${hora}</small>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
