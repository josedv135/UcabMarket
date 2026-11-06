/**
 * Lógica del catálogo y detalle de productos para UcabMarket
 */
const PRODUCTOS_POR_PAGINA = 12;
let catalogo = { query: '', categoria: '', pagina: 1 };

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gridProductos');
  if (grid) {
    cargarCatalogo();
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) btnBuscar.addEventListener('click', filtrarProductos);
    const btnVerMas = document.getElementById('btnVerMas');
    if (btnVerMas) btnVerMas.addEventListener('click', () => cargarCatalogo(catalogo.query, catalogo.categoria, catalogo.pagina + 1));

    // La publicación de productos está en publicar-producto.html (HU Añadir Producto)
  }

  // El detalle de un producto está en consultar-producto.js (HU Consultar Producto)
});

async function cargarCatalogo(query = '', categoria = '', pagina = 1) {
  const grid = document.getElementById('gridProductos');
  if (!grid) return;

  try {
    let url = '/products';
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoria) params.append('categoria', categoria);
    params.append('pagina', pagina);
    params.append('limite', PRODUCTOS_POR_PAGINA);
    url += `?${params.toString()}`;

    const productos = await api.get(url);
    catalogo = { query, categoria, pagina };
    document.getElementById('btnVerMas').hidden = !productos || productos.length < PRODUCTOS_POR_PAGINA;

    if ((!productos || productos.length === 0) && pagina > 1) return;
    if (!productos || productos.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center text-muted py-5"><h5>No se encontraron productos disponibles</h5></div>';
      return;
    }

    const tarjetas = productos.map(p => {
      const portada = p.fotos?.[0] ? `${CONFIG.UPLOAD_URL}/products/${encodeURIComponent(p.fotos[0])}` : 'https://placehold.co/400x300?text=UcabMarket';
      return `
        <div class="col-md-4">
          <div class="card card-product h-100 shadow-sm border-0">
            <img src="${portada}" class="card-img-top" style="height: 220px; object-fit: cover;" alt="${escapeHtml(p.titulo)}">
            <div class="card-body">
              <span class="badge bg-secondary mb-2">${escapeHtml(p.categoria)}</span>
              <h5 class="card-title fw-bold text-truncate">${escapeHtml(p.titulo)}</h5>
              <h4 class="text-primary fw-bold mb-2">$${Number(p.precio)}</h4>
              <p class="card-text text-muted small text-truncate">${escapeHtml(p.descripcion)}</p>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="btn btn-outline-primary w-100 fw-semibold">Ver detalle</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (pagina === 1) grid.innerHTML = tarjetas;
    else grid.insertAdjacentHTML('beforeend', tarjetas);
  } catch (err) {
    console.error('Error cargando catálogo:', err);
  }
}

function filtrarProductos() {
  const query = document.getElementById('buscadorInput').value.trim();
  const categoria = document.getElementById('filtroCategoria').value;
  cargarCatalogo(query, categoria);
}
