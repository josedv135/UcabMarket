/**
 * Lógica de gestión del perfil de usuario para UcabMarket
 * Permite consultar perfiles públicos y editar el perfil propio.
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

  if (typeof reviews !== 'undefined' && reviews.cargarResenasUsuario) {
    reviews.cargarResenasUsuario(targetUserId);
  }

  const formEditar = document.getElementById('formEditarPerfil');
  if (formEditar && esPropio) {
    formEditar.addEventListener('submit', (e) => actualizarPerfil(e, user));
  }

  // Manejar envío de nueva reseña desde el modal (Sprint 1)
  const formResena = document.getElementById('formNuevaResena');
  if (formResena) {
    formResena.addEventListener('submit', async (e) => {
      e.preventDefault();
      const puntuacion = document.getElementById('resenaPuntuacion').value;
      const comentario = document.getElementById('resenaComentario').value;
      if (typeof reviews !== 'undefined' && reviews.enviarResena) {
        await reviews.enviarResena(targetUserId, puntuacion, comentario);
      }
      const modalEl = document.getElementById('modalNuevaResena');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      formResena.reset();
    });
  }
});

/**
 * Carga y muestra los datos del perfil de usuario
 */
async function cargarDatosPerfil(userId, esPropio) {
  try {
    const data = await api.get(esPropio ? '/users/me' : `/users/${encodeURIComponent(userId)}`);
    if (!data) throw new Error('Usuario no encontrado');

    const perfilNombre = document.getElementById('perfilNombre');
    const perfilEmail = document.getElementById('perfilEmail');
    const perfilCarrera = document.getElementById('perfilCarrera');
    const perfilTelefono = document.getElementById('perfilTelefono');
    const perfilFecha = document.getElementById('perfilFecha');
    const avatarContainer = document.getElementById('perfilAvatarContainer');

    if (perfilNombre) perfilNombre.textContent = data.nombreCompleto;
    if (perfilEmail) {
      perfilEmail.textContent = data.email || '';
      perfilEmail.hidden = !esPropio;
    }
    if (perfilCarrera) perfilCarrera.textContent = data.carrera || 'Estudiante UCAB';

    if (perfilTelefono) {
      perfilTelefono.hidden = !esPropio;
      if (data.telefono && data.telefono.trim().length > 0) {
        perfilTelefono.innerHTML = `<i class="bi bi-telephone-fill text-primary me-1"></i> <span>${escapeHtml(data.telefono)}</span>`;
      } else {
        perfilTelefono.innerHTML = `<i class="bi bi-telephone text-muted me-1"></i> <span class="text-muted fst-italic">Sin teléfono registrado</span>`;
      }
    }

    if (perfilFecha) {
      if (data.fechaRegistro) {
        try {
          const f = new Date(data.fechaRegistro);
          const fechaStr = f.toLocaleDateString('es-VE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          perfilFecha.innerHTML = `<i class="bi bi-calendar-check text-muted me-1"></i> Miembro desde ${fechaStr}`;
        } catch (_) {
          perfilFecha.innerHTML = `<i class="bi bi-calendar-check text-muted me-1"></i> Miembro de la comunidad UCAB`;
        }
      } else {
        perfilFecha.innerHTML = `<i class="bi bi-calendar-check text-muted me-1"></i> Miembro de la comunidad UCAB`;
      }
    }

    // Renderizar avatar (iniciales o foto de perfil)
    if (avatarContainer) {
      if (data.fotoPerfil && data.fotoPerfil.trim().length > 0) {
        avatarContainer.innerHTML = `<img src="${escapeHtml(data.fotoPerfil)}" alt="${escapeHtml(data.nombreCompleto)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'bi bi-person-fill\\'></i>';">`;
      } else {
        const partes = (data.nombreCompleto || '').trim().split(/\s+/);
        const iniciales = partes.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
        avatarContainer.innerHTML = iniciales ? `<span>${iniciales}</span>` : `<i class="bi bi-person-fill"></i>`;
      }
    }

    // Rellenar formulario de edición si es perfil propio
    if (esPropio) {
      const inputNombre = document.getElementById('inputNombre');
      const inputCarrera = document.getElementById('inputCarrera');
      const inputTelefono = document.getElementById('inputTelefono');
      const inputFotoPerfil = document.getElementById('inputFotoPerfil');
      const inputPassword = document.getElementById('inputPassword');

      if (inputNombre) inputNombre.value = data.nombreCompleto || '';
      if (inputCarrera) inputCarrera.value = data.carrera || '';
      if (inputTelefono) inputTelefono.value = data.telefono || '';
      if (inputFotoPerfil) inputFotoPerfil.value = data.fotoPerfil || '';
      if (inputPassword) inputPassword.value = '';
    } else {
      // Ocultar opciones de edición si no es el dueño
      const btnEditar = document.getElementById('btnEditarPerfil');
      if (btnEditar) btnEditar.classList.add('d-none');
    }
  } catch (err) {
    console.error('Error cargando perfil:', err);
    alert('No se pudo cargar la información del perfil: ' + err.message);
  }
}

/**
 * Carga las publicaciones activas del estudiante
 */
async function cargarProductosUsuario(userId) {
  const contenedor = document.getElementById('productosUsuario');
  if (!contenedor) return;

  try {
    const productos = await api.get(`/products/user/${userId}`);
    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<div class="col-12 text-center py-4"><i class="bi bi-box-seam text-muted fs-1 mb-2 d-block"></i><p class="text-muted">No hay publicaciones activas por el momento.</p></div>';
      return;
    }

    contenedor.innerHTML = productos.map((p) => `
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <img src="${p.fotos?.[0] ? CONFIG.UPLOAD_URL + '/products/' + p.fotos[0] : 'https://placehold.co/300x200?text=UcabMarket'}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${escapeHtml(p.titulo)}">
          <div class="card-body">
            <h6 class="card-title fw-bold">${escapeHtml(p.titulo)}</h6>
            <p class="text-primary fw-bold mb-1">$${p.precio}</p>
            <span class="badge bg-secondary">${escapeHtml(p.categoria)}</span>
          </div>
          <div class="card-footer bg-white border-0">
            <a href="product-detail.html?id=${p.id}" class="btn btn-sm btn-outline-primary w-100">Ver publicación</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error cargando productos:', err);
    contenedor.innerHTML = '<div class="col-12 text-center py-3"><p class="text-muted small">No se pudieron cargar las publicaciones activas.</p></div>';
  }
}

/**
 * Procesa y envía la actualización de datos del perfil
 */
async function actualizarPerfil(e, currentUser) {
  e.preventDefault();
  const alertBox = document.getElementById('alertEditarPerfil');
  const btnSubmit = document.getElementById('btnSubmitEditarPerfil');

  const inputNombre = document.getElementById('inputNombre');
  const inputCarrera = document.getElementById('inputCarrera');
  const inputTelefono = document.getElementById('inputTelefono');
  const inputFotoPerfil = document.getElementById('inputFotoPerfil');
  const inputPassword = document.getElementById('inputPassword');

  const nombreCompleto = inputNombre ? inputNombre.value.trim() : '';
  const carrera = inputCarrera ? inputCarrera.value.trim() : '';
  const telefono = inputTelefono ? inputTelefono.value.trim() : '';
  const fotoPerfil = inputFotoPerfil ? inputFotoPerfil.value.trim() : '';
  const password = inputPassword ? inputPassword.value : '';

  function mostrarAlertaModal(msg, tipo = 'danger') {
    if (alertBox) {
      alertBox.className = `alert alert-${tipo} small py-2 mb-3`;
      alertBox.innerHTML = msg;
      alertBox.classList.remove('d-none');
    } else {
      alert(msg);
    }
  }

  function ocultarAlertaModal() {
    if (alertBox) alertBox.classList.add('d-none');
  }

  ocultarAlertaModal();

  if (!nombreCompleto) {
    mostrarAlertaModal('El nombre completo es obligatorio', 'warning');
    return;
  }
  if (!carrera) {
    mostrarAlertaModal('La carrera o escuela es obligatoria', 'warning');
    return;
  }
  if (password && password.length < 6) {
    mostrarAlertaModal('La nueva contraseña debe tener al menos 6 caracteres', 'warning');
    return;
  }

  const payload = {
    nombreCompleto,
    carrera,
    telefono,
    fotoPerfil,
  };
  if (password && password.length >= 6) {
    payload.password = password;
  }

  try {
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    }

    const actualizado = await api.patch(`/users/${currentUser.id}`, payload);
    api.updateUser(actualizado);

    // Cerrar modal
    const modalEl = document.getElementById('modalEditarPerfil');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }

    // Actualizar vista inmediatamente sin forzar recarga brusca
    await cargarDatosPerfil(currentUser.id, true);
    alert('¡Perfil actualizado con éxito!');
  } catch (err) {
    mostrarAlertaModal('Error al actualizar perfil: ' + err.message, 'danger');
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="bi bi-check-lg me-1"></i> Guardar Cambios';
    }
  }
}
