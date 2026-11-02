/**
 * Módulo de preguntas y respuestas públicas para UcabMarket
 * Utilizado en product-detail.html
 */
const questions = {
  async cargarPreguntas(productId, sellerId) {
    const contenedor = document.getElementById('contenedorPreguntas');
    if (!contenedor) return;

    try {
      const lista = await api.get(`/questions/product/${productId}`);
      const currentUser = api.getCurrentUser();
      const esVendedor = currentUser && currentUser.id === sellerId;

      if (!lista || lista.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">Aún no hay preguntas sobre este producto. ¡Sé el primero!</p>';
        return;
      }

      contenedor.innerHTML = lista.map(q => `
        <div class="border-bottom py-3">
          <div class="d-flex justify-content-between">
            <span class="fw-semibold text-dark"><i class="bi bi-chat-left-dots me-1"></i> ${escapeHtml(q.contenido)}</span>
            <small class="text-muted">${new Date(q.fechaPregunta || Date.now()).toLocaleDateString()}</small>
          </div>
          ${q.respuesta ? `
            <div class="ms-3 mt-2 ps-2 border-start border-3 border-success text-muted">
              <span class="fw-semibold text-success">Respuesta del vendedor:</span> ${escapeHtml(q.respuesta)}
            </div>
          ` : (esVendedor ? `
            <div class="mt-2 ms-3">
              <form onsubmit="questions.responderPregunta(event, '${q.id}', '${productId}', '${sellerId}')" class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm" placeholder="Escribe tu respuesta..." required id="respuesta-${q.id}">
                <button type="submit" class="btn btn-sm btn-outline-success">Responder</button>
              </form>
            </div>
          ` : '<p class="text-muted small ms-3 mt-1 fst-italic">Pendiente de respuesta del vendedor</p>')}
        </div>
      `).join('');
    } catch (err) {
      console.error('Error cargando preguntas:', err);
    }
  },

  async enviarPregunta(e, productId, sellerId) {
    e.preventDefault();
    const input = document.getElementById('inputNuevaPregunta');
    if (!input || !input.value.trim()) return;

    try {
      await api.post('/questions', {
        productId,
        contenido: input.value.trim(),
      });
      input.value = '';
      await this.cargarPreguntas(productId, sellerId);
    } catch (err) {
      alert('Error al publicar pregunta: ' + err.message);
    }
  },

  async responderPregunta(e, questionId, productId, sellerId) {
    e.preventDefault();
    const input = document.getElementById(`respuesta-${questionId}`);
    if (!input || !input.value.trim()) return;

    try {
      await api.patch(`/questions/${questionId}/answer`, {
        respuesta: input.value.trim(),
      });
      await this.cargarPreguntas(productId, sellerId);
    } catch (err) {
      alert('Error al enviar respuesta: ' + err.message);
    }
  },
};
