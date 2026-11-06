/**
 * HU Crear Chat (José) — pasos 1 a 6 y alternos 4 y 11, desde el detalle del producto.
 * Usa modales de Bootstrap en lugar de alert/confirm.
 */
const crearChat = {
  producto: null,
  modal: null,

  iniciar(producto) {
    this.producto = producto;
    this.insertarModal();
    // 2.- Muestra la interfaz «¿Deseas crear un chat con el vendedor?»
    this.mostrarConfirmacion();
  },

  insertarModal() {
    if (document.getElementById('modalCrearChat')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="modalCrearChat" tabindex="-1" data-bs-backdrop="static" aria-labelledby="modalCrearChatTitulo">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="modalCrearChatTitulo"></h5>
            </div>
            <div class="modal-body" id="modalCrearChatCuerpo"></div>
            <div class="modal-footer" id="modalCrearChatBotones"></div>
          </div>
        </div>
      </div>
    `);
    this.modal = new bootstrap.Modal(document.getElementById('modalCrearChat'));
  },

  pintar(titulo, cuerpo, botones) {
    document.getElementById('modalCrearChatTitulo').textContent = titulo;
    document.getElementById('modalCrearChatCuerpo').innerHTML = cuerpo;
    const pie = document.getElementById('modalCrearChatBotones');
    pie.innerHTML = '';
    botones.forEach(({ texto, clase, accion }) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `btn ${clase}`;
      b.textContent = texto;
      b.addEventListener('click', accion);
      pie.appendChild(b);
    });
    this.modal.show();
  },

  mostrarConfirmacion() {
    this.pintar(
      '¿Deseas crear un chat con el vendedor?',
      `<p class="mb-0">Podrás coordinar la compra de <strong>${escapeHtmlChat(this.producto.titulo)}</strong> por mensajes privados.</p>`,
      [
        { texto: 'Salir', clase: 'btn-outline-secondary', accion: () => this.salir() },
        { texto: 'Crear chat', clase: 'btn-primary', accion: () => this.crear() },
      ],
    );
  },

  // 3.- Presiona «Crear chat» → 4.- Crea el chat
  async crear() {
    try {
      const chat = await api.post('/chats', { productId: this.producto.id });
      // 5.- Muestra el mensaje «Chat creado»
      this.pintar('Chat creado', '<p class="mb-0">Ya puedes escribirle al vendedor.</p>', [
        { texto: 'Salir', clase: 'btn-outline-secondary', accion: () => this.salir() },
        // 6.- Presiona OK → 7.- Muestra el chat
        { texto: 'OK', clase: 'btn-primary', accion: () => { window.location.href = `chat.html?chatId=${encodeURIComponent(chat.id)}`; } },
      ]);
    } catch (err) {
      // 4.1 / 4.2: No se pudo crear el chat
      this.pintar(
        'No se pudo crear el chat, inténtalo de nuevo',
        `<p class="mb-0 text-muted">${escapeHtmlChat(err.message)}</p>`,
        // 4.3 Confirma la lectura → 4.4 Regresa al paso 2
        [{ texto: 'OK', clase: 'btn-primary', accion: () => this.mostrarConfirmacion() }],
      );
    }
  },

  // 11.2 Cancela el proceso → 11.3 Regresa a Consultar producto
  salir() {
    this.modal.hide();
  },
};

function escapeHtmlChat(texto) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(texto ?? '').replace(/[&<>"']/g, (m) => map[m]);
}
