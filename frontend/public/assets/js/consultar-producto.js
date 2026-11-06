/**
 * HU Consultar Producto
 *
 * El miembro abre una publicación desde el catálogo (o su perfil) y ve:
 * fotos (hasta 5), título, precio, categoría, estado (nuevo/usado),
 * fecha de publicación, descripción y vendedor.
 * Flujos alternos: producto no disponible y error de conexión (Reintentar).
 */

const FOTO_VACIA = 'https://placehold.co/600x400?text=UcabMarket';

let productoId = null;
let preguntasConectadas = false;

document.addEventListener('DOMContentLoaded', () => {
  // Precondición: solo miembros UCAB con sesión iniciada
  if (!api.getToken()) {
    window.location.href = 'index.html';
    return;
  }

  productoId = new URLSearchParams(window.location.search).get('id');
  document.getElementById('btnReintentar').addEventListener('click', cargarProducto);
  cargarProducto();
});

function mostrarVista(id) {
  ['vistaCargando', 'vistaNoDisponible', 'vistaErrorConexion', 'vistaProducto'].forEach((v) => {
    document.getElementById(v).hidden = v !== id;
  });
}

async function cargarProducto() {
  if (!productoId) {
    mostrarVista('vistaNoDisponible');
    return;
  }

  mostrarVista('vistaCargando');
  try {
    const prod = await api.get(`/products/${encodeURIComponent(productoId)}`);
    pintarProducto(prod);
    mostrarVista('vistaProducto');
    conectarPreguntasYChat(prod);
  } catch (err) {
    if (err.status === 401) {
      api.clearSession();
      window.location.href = 'index.html';
    } else if (err.status === 404) {
      mostrarVista('vistaNoDisponible');
    } else {
      // fetch lanza TypeError si no hay respuesta del servidor; 5xx = fallo del servidor
      mostrarVista('vistaErrorConexion');
    }
  }
}

function pintarProducto(prod) {
  document.title = `${prod.titulo} - UcabMarket`;
  document.getElementById('prodTitulo').textContent = prod.titulo;
  document.getElementById('prodPrecio').textContent = `$${Number(prod.precio).toFixed(2)}`;
  document.getElementById('prodCategoria').textContent = prod.categoria;
  document.getElementById('prodEstado').textContent = prod.estadoProducto;
  document.getElementById('prodDescripcion').textContent = prod.descripcion;
  document.getElementById('prodFecha').textContent = prod.fechaCreacion
    ? `Publicado el ${new Date(prod.fechaCreacion).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : '';

  // Avisa si la publicación ya no está activa (vendida o pausada)
  const etiquetas = { VENDIDO: 'Vendido', PAUSADO: 'Pausado' };
  const badge = document.getElementById('prodPublicacion');
  badge.hidden = !etiquetas[prod.estadoPublicacion];
  badge.textContent = etiquetas[prod.estadoPublicacion] || '';

  // Vendedor
  document.getElementById('vendedorNombre').textContent = prod.vendedor?.nombreCompleto || 'Miembro UCAB';
  document.getElementById('vendedorCarrera').textContent = prod.vendedor?.carrera || '';
  document.getElementById('linkPerfilVendedor').href = `profile.html?userId=${encodeURIComponent(prod.userId)}`;

  // El dueño no puede contactarse a sí mismo
  const usuario = api.getCurrentUser();
  const esPropietario = usuario && usuario.id === prod.userId;
  document.getElementById('btnContactarChat').hidden = esPropietario || prod.estadoPublicacion !== 'ACTIVO';
  document.getElementById('avisoPropietario').hidden = !esPropietario;

  pintarGaleria(prod.fotos || []);
}

function pintarGaleria(fotos) {
  const urls = fotos.length ? fotos.map((f) => `${CONFIG.UPLOAD_URL}/products/${encodeURIComponent(f)}`) : [FOTO_VACIA];

  document.getElementById('carouselInner').innerHTML = urls.map((url, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${url}" class="d-block w-100 rounded" style="height: 380px; object-fit: contain; background: #f1f5f9;"
           alt="Foto ${i + 1} del producto" onerror="this.src='${FOTO_VACIA}'">
    </div>`).join('');

  // Flechas y miniaturas solo si hay más de una foto
  const varias = urls.length > 1;
  document.querySelectorAll('#galeriaFotos .carousel-control-prev, #galeriaFotos .carousel-control-next')
    .forEach((b) => { b.hidden = !varias; });

  document.getElementById('miniaturas').innerHTML = varias
    ? urls.map((url, i) => `
        <button type="button" class="p-0 border-0 bg-transparent" data-bs-target="#galeriaFotos" data-bs-slide-to="${i}" aria-label="Ver foto ${i + 1}">
          <img src="${url}" alt="" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;" onerror="this.src='${FOTO_VACIA}'">
        </button>`).join('')
    : '';
}

// Integra las HU de otros compañeros que viven en esta pantalla (preguntas y chat)
function conectarPreguntasYChat(prod) {
  if (preguntasConectadas) return; // evita duplicar eventos al presionar Reintentar
  preguntasConectadas = true;

  document.getElementById('btnContactarChat').addEventListener('click', () => crearChat.iniciar(prod));

  if (typeof questions !== 'undefined') {
    questions.cargarPreguntas(prod.id, prod.userId);
    document.getElementById('formNuevaPregunta')
      .addEventListener('submit', (ev) => questions.enviarPregunta(ev, prod.id, prod.userId));
  }
}
