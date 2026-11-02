/**
 * Lógica de gestión del perfil de usuario para UcabMarket
 */
document.addEventListener('DOMContentLoaded', async () => {
  const user = api.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Detectar si vemos el perfil propio o el de otro usuario vía ?userId=...
  const params = new URLSearchParams(window.location.search);
  const targetUserId = params.get('userId') || user.id;
  const esPropio = targetUserId === user.id;

  cargarDatosPerfil(targetUserId, esPropio);
  cargarProductosUsuario(targetUserId);

  if (typeof reviews !== 'undefined') {
    reviews.cargarResenasUsuario(targetUserId);
  }

  const formEditar = document.getElementById('formEditarPerfil');
  if (formEditar && esPropio) {
    formEditar.addEventListener('submit', actualizarPerfil);
  }
});

async function cargarDatosPerfil(userId, esPropio) {
  try {
    const data = await api.get(`/users/${userId}`);
    document.getElementById('perfilNombre').textContent = data.nombreCompleto;
    document.getElementById('perfilEmail').textContent = data.email;
    document.getElementById('perfilCarrera').textContent = data.carrera || 'Estudiante UCAB';

    // Rellenar formulario de edición si es propio
    if (esPropio) {
      const inputNombre = document.getElementById('inputNombre');
      const inputCarrera = document.getElementById('inputCarrera');
      const inputTelefono = document.getElementById('inputTelefono');
      if (inputNombre) inputNombre.value = data.nombreCompleto || '';
      if (inputCarrera) inputCarrera.value = data.carrera || '';
      if (inputTelefono) inputTelefono.value = data.telefono || '';
    } else {
      // Ocultar opciones de edición si no es el dueño
      const btnEditar = document.getElementById('btnEditarPerfil');
      if (btnEditar) btnEditar.classList.add('d-none');
    }
  } catch (err) {
    console.error('Error cargando perfil:', err);
  }
}

async function cargarProductosUsuario(userId) {
  const contenedor = document.getElementById('productosUsuario');
  if (!contenedor) return;

  try {
    const productos = await api.get(`/products/user/${userId}`);
    if (productos.length === 0) {
      contenedor.innerHTML = '<p class="text-muted">No hay publicaciones activas.</p>';
      return;
    }

    contenedor.innerHTML = productos.map(p => `
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <img src="${p.fotos?.[0] ? CONFIG.UPLOAD_URL + '/products/' + p.fotos[0] : 'https://placehold.co/300x200?text=UcabMarket'}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${escapeHtml(p.titulo)}">
          <div class="card-body">
            <h6 class="card-title fw-bold">${escapeHtml(p.titulo)}</h6>
            <p class="text-primary fw-bold mb-1">$${p.precio}</p>
            <span class="badge bg-secondary">${p.categoria}</span>
          </div>
          <div class="card-footer bg-white border-0">
            <a href="product-detail.html?id=${p.id}" class="btn btn-sm btn-outline-primary w-100">Ver publicación</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}

async function actualizarPerfil(e) {
  e.preventDefault();
  const user = api.getCurrentUser();
  const nombreCompleto = document.getElementById('inputNombre').value;
  const carrera = document.getElementById('inputCarrera').value;
  const telefono = document.getElementById('inputTelefono').value;

  try {
    const actualizado = await api.patch(`/users/${user.id}`, {
      nombreCompleto,
      carrera,
      telefono,
    });
    api.setSession(api.getToken(), { ...user, ...actualizado });
    alert('Perfil actualizado con éxito');
    window.location.reload();
  } catch (err) {
    alert('Error al actualizar perfil: ' + err.message);
  }
}
