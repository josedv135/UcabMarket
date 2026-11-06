/**
 * Módulo de preguntas y respuestas públicas para UcabMarket
 * Utilizado en product-detail.html
 */
const MAX_PREGUNTA = 300;
const MAX_RESPUESTA = 500;

const questions = {
  _preparado: false,

  /**
   * Configura la sección una sola vez: oculta el formulario si el usuario es
   * el vendedor, activa el contador de caracteres y escucha los formularios
   * de respuesta.
   */
  _preparar(productId, sellerId) {
    if (this._preparado) return;
    this._preparado = true;

    const currentUser = api.getCurrentUser();
    const esVendedor = currentUser && currentUser.id === sellerId;

    const form = document.getElementById('formNuevaPregunta');
    const aviso = document.getElementById('avisoVendedorPreguntas');
    if (esVendedor) {
      if (form) form.hidden = true;
      if (aviso) aviso.hidden = false;
    }

    const input = document.getElementById('inputNuevaPregunta');
    const contador = document.getElementById('contadorPregunta');
    if (input && contador) {
      input.addEventListener('input', () => {
        contador.textContent = input.value.length;
      });
    }

    // Un solo listener para todos los formularios de respuesta
    const contenedor = document.getElementById('contenedorPreguntas');
    if (contenedor) {
      contenedor.addEventListener('submit', (e) => {
        const formResp = e.target.closest('form[data-question-id]');
        if (formResp) {
          this.responderPregunta(e, formResp.dataset.questionId, productId, sellerId);
        }
      });
    }
  },

  mostrarAlerta(mensaje, tipo = 'danger') {
    const caja = document.getElementById('alertaPreguntas');
    if (!caja) return;
    caja.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show py-2" role="alert">
        ${escapeHtml(mensaje)}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>`;
  },

  limpiarAlerta() {
    const caja = document.getElementById('alertaPreguntas');
    if (caja) caja.innerHTML = '';
  },

  formatearFecha(iso) {
    return new Date(iso || Date.now()).toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  },

  async cargarPreguntas(productId, sellerId) {
    this._preparar(productId, sellerId);

    const contenedor = document.getElementById('contenedorPreguntas');
    if (!contenedor) return;

    try {
      const lista = await api.get(`/questions/product/${productId}`);
      const currentUser = api.getCurrentUser();
      const esVendedor = currentUser && currentUser.id === sellerId;

      if (!lista || lista.length === 0) {
        contenedor.innerHTML = esVendedor
          ? '<p class="text-muted">Todavía nadie ha preguntado sobre este producto.</p>'
          : '<p class="text-muted">Aún no hay preguntas sobre este producto. ¡Sé el primero!</p>';
        return;
      }

      contenedor.innerHTML = lista.map((q) => `
        <div class="border-bottom py-3">
          <div class="d-flex justify-content-between gap-3">
            <span class="fw-semibold text-dark"><i class="bi bi-chat-left-dots me-1"></i> ${escapeHtml(q.contenido)}</span>
            <small class="text-muted text-nowrap">${this.formatearFecha(q.fechaPregunta)}</small>
          </div>
          <small class="text-muted">
            <i class="bi bi-person me-1"></i>${escapeHtml(q.autorNombre || 'Estudiante UCAB')}
          </small>
          ${q.respuesta ? `
            <div class="ms-3 mt-2 ps-2 border-start border-3 border-success text-muted">
              <span class="fw-semibold text-success">Respuesta del vendedor:</span> ${escapeHtml(q.respuesta)}
              ${q.fechaRespuesta ? `<small class="d-block">${this.formatearFecha(q.fechaRespuesta)}</small>` : ''}
            </div>
          ` : (esVendedor ? `
            <div class="mt-2 ms-3">
              <form data-question-id="${escapeHtml(q.id)}" class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm" placeholder="Escribe tu respuesta..." maxlength="${MAX_RESPUESTA}" required id="respuesta-${escapeHtml(q.id)}">
                <button type="submit" class="btn btn-sm btn-outline-success">Responder</button>
              </form>
            </div>
          ` : '<p class="text-muted small ms-3 mt-1 fst-italic mb-0">Pendiente de respuesta del vendedor</p>')}
        </div>
      `).join('');
    } catch (err) {
      console.error('Error cargando preguntas:', err);
      contenedor.innerHTML = '<p class="text-danger">No se pudieron cargar las preguntas. Intenta recargar la página.</p>';
    }
  },

  async enviarPregunta(e, productId, sellerId) {
    e.preventDefault();
    const input = document.getElementById('inputNuevaPregunta');
    if (!input) return;

    const contenido = input.value.trim();
    if (!contenido) {
      this.mostrarAlerta('Escribe tu pregunta antes de enviarla.', 'warning');
      return;
    }
    if (contenido.length > MAX_PREGUNTA) {
      this.mostrarAlerta(`La pregunta no puede superar los ${MAX_PREGUNTA} caracteres.`, 'warning');
      return;
    }

    const boton = e.target.querySelector('button[type="submit"]');
    if (boton) boton.disabled = true;

    try {
      await api.post('/questions', { productId, contenido });
      input.value = '';
      const contador = document.getElementById('contadorPregunta');
      if (contador) contador.textContent = '0';
      this.mostrarAlerta('Tu pregunta fue publicada.', 'success');
      await this.cargarPreguntas(productId, sellerId);
    } catch (err) {
      this.mostrarAlerta('No se pudo publicar la pregunta: ' + err.message);
    } finally {
      if (boton) boton.disabled = false;
    }
  },

  async responderPregunta(e, questionId, productId, sellerId) {
    e.preventDefault();
    const input = document.getElementById(`respuesta-${questionId}`);
    if (!input) return;

    const respuesta = input.value.trim();
    if (!respuesta) {
      this.mostrarAlerta('Escribe una respuesta antes de enviarla.', 'warning');
      return;
    }

    const boton = e.target.querySelector('button[type="submit"]');
    if (boton) boton.disabled = true;

    try {
      await api.patch(`/questions/${questionId}/answer`, { respuesta });
      this.mostrarAlerta('Respuesta publicada.', 'success');
      await this.cargarPreguntas(productId, sellerId);
    } catch (err) {
      this.mostrarAlerta('No se pudo enviar la respuesta: ' + err.message);
      if (boton) boton.disabled = false;
    }
  },
};
