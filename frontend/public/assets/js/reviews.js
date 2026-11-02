/**
 * Módulo de reseñas y reputación comunitaria para UcabMarket
 * Integrado principalmente en profile.html (evaluación de confianza del estudiante)
 */
const reviews = {
  /**
   * Cargar y listar las reseñas asociadas a un estudiante
   */
  async cargarResenasUsuario(userId) {
    try {
      const lista = await api.get(`/reviews/user/${userId}`);
      this.renderizarResenas(lista);
      this.actualizarPromedio(lista);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    }
  },

  /**
   * Enviar una nueva reseña de confianza (Sprint 1)
   */
  async enviarResena(targetUserId, puntuacion, comentario, productId = null) {
    try {
      const data = await api.post('/reviews', {
        targetUserId,
        puntuacion: Number(puntuacion),
        comentario,
        productId,
      });
      alert('¡Reseña registrada con éxito!');
      await this.cargarResenasUsuario(targetUserId);
      return data;
    } catch (err) {
      alert('Error al enviar reseña: ' + err.message);
    }
  },

  /**
   * Renderizar lista de reseñas en el contenedor de perfil
   */
  renderizarResenas(lista) {
    const contenedor = document.getElementById('listaResenas');
    if (!contenedor) return;

    if (!lista || lista.length === 0) {
      contenedor.innerHTML = '<p class="text-muted">Este usuario aún no tiene reseñas registradas.</p>';
      return;
    }

    contenedor.innerHTML = lista
      .map((r) => {
        const estrellas = '★'.repeat(r.puntuacion) + '☆'.repeat(5 - r.puntuacion);
        const fecha = new Date(r.fecha || Date.now()).toLocaleDateString();
        return `
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-warning fw-bold fs-5">${estrellas}</span>
              <small class="text-muted">${fecha}</small>
            </div>
            <p class="card-text text-secondary mb-1">${escapeHtml(r.comentario)}</p>
            <small class="text-muted fst-italic">Por: ${escapeHtml(r.autorNombre || 'Compañero UCAB')}</small>
          </div>
        </div>
      `;
      })
      .join('');
  },

  /**
   * Calcular y mostrar el promedio de estrellas
   */
  actualizarPromedio(lista) {
    const badge = document.getElementById('reputacionPromedio');
    if (!badge || lista.length === 0) return;
    const promedio = (lista.reduce((acc, curr) => acc + curr.puntuacion, 0) / lista.length).toFixed(1);
    badge.textContent = `★ ${promedio} / 5 (${lista.length} opiniones)`;
  },
};
