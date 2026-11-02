/**
 * Lógica del catálogo y detalle de productos para UcabMarket
 */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gridProductos');
  if (grid) {
    cargarCatalogo();
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) btnBuscar.addEventListener('click', filtrarProductos);

    const formPublicar = document.getElementById('formPublicarProducto');
    if (formPublicar) formPublicar.addEventListener('submit', publicarProducto);
  }

  // Página de detalle
  if (window.location.pathname.includes('product-detail.html')) {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    if (prodId) {
      cargarDetalleProducto(prodId);
    }
  }
});

async function cargarCatalogo(query = '', categoria = '') {
  const grid = document.getElementById('gridProductos');
  if (!grid) return;

  try {
    let url = '/products';
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoria) params.append('categoria', categoria);
    if (params.toString()) url += `?${params.toString()}`;

    const productos = await api.get(url);

    if (!productos || productos.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center text-muted py-5"><h5>No se encontraron productos disponibles</h5></div>';
      return;
    }

    grid.innerHTML = productos.map(p => {
      const portada = p.fotos?.[0] ? `${CONFIG.UPLOAD_URL}/products/${p.fotos[0]}` : 'https://placehold.co/400x300?text=UcabMarket';
      return `
        <div class="col-md-4">
          <div class="card card-product h-100 shadow-sm border-0">
            <img src="${portada}" class="card-img-top" style="height: 220px; object-fit: cover;" alt="${escapeHtml(p.titulo)}">
            <div class="card-body">
              <span class="badge bg-secondary mb-2">${p.categoria}</span>
              <h5 class="card-title fw-bold text-truncate">${escapeHtml(p.titulo)}</h5>
              <h4 class="text-primary fw-bold mb-2">$${p.precio}</h4>
              <p class="card-text text-muted small text-truncate">${escapeHtml(p.descripcion)}</p>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <a href="product-detail.html?id=${p.id}" class="btn btn-outline-primary w-100 fw-semibold">Ver detalle</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error cargando catálogo:', err);
  }
}

function filtrarProductos() {
  const query = document.getElementById('buscadorInput').value.trim();
  const categoria = document.getElementById('filtroCategoria').value;
  cargarCatalogo(query, categoria);
}

async function publicarProducto(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const fileInput = document.getElementById('fotosInput');

  if (fileInput && fileInput.files.length > 5) {
    alert('Solo se permite un máximo de 5 fotos por publicación');
    return;
  }

  try {
    await api.post('/products', formData);
    alert('¡Publicación creada exitosamente!');
    window.location.reload();
  } catch (err) {
    alert('Error al publicar: ' + err.message);
  }
}

async function cargarDetalleProducto(id) {
  try {
    const prod = await api.get(`/products/${id}`);
    document.getElementById('prodTitulo').textContent = prod.titulo;
    document.getElementById('prodPrecio').textContent = `$${prod.precio}`;
    document.getElementById('prodDescripcion').textContent = prod.descripcion;
    document.getElementById('prodCategoria').textContent = prod.categoria;

    // Vendedor
    const linkPerfil = document.getElementById('linkPerfilVendedor');
    if (linkPerfil && prod.userId) {
      linkPerfil.href = `profile.html?userId=${prod.userId}`;
    }

    // Botón de chat privado
    const btnChat = document.getElementById('btnContactarChat');
    if (btnChat) {
      btnChat.addEventListener('click', async () => {
        try {
          const chat = await api.post('/chats', { productId: prod.id, sellerId: prod.userId });
          window.location.href = `chat.html?chatId=${chat.id}`;
        } catch (err) {
          alert('Error al iniciar chat: ' + err.message);
        }
      });
    }

    // Galería (máximo 5 fotos)
    const carouselInner = document.getElementById('carouselInner');
    if (carouselInner) {
      const fotos = prod.fotos && prod.fotos.length > 0 ? prod.fotos : ['placeholder'];
      carouselInner.innerHTML = fotos.map((f, idx) => `
        <div class="carousel-item ${idx === 0 ? 'active' : ''}">
          <img src="${f === 'placeholder' ? 'https://placehold.co/600x400?text=UcabMarket' : `${CONFIG.UPLOAD_URL}/products/${f}`}" class="d-block w-100 rounded" style="height: 380px; object-fit: contain; background: #000;" alt="Foto producto">
        </div>
      `).join('');
    }

    // Cargar preguntas públicas
    if (typeof questions !== 'undefined') {
      questions.cargarPreguntas(prod.id, prod.userId);
      const formPregunta = document.getElementById('formNuevaPregunta');
      if (formPregunta) {
        formPregunta.addEventListener('submit', (ev) => questions.enviarPregunta(ev, prod.id, prod.userId));
      }
    }
  } catch (err) {
    console.error('Error cargando producto:', err);
  }
}
