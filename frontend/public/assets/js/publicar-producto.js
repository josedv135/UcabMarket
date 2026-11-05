/**
 * HU / CU Añadir Producto
 *
 * Sigue el flujo del caso de uso:
 *   2  Muestra el formulario          5  Valida campos e imágenes
 *   6  Verifica el producto           7  Muestra «Resumen de Producto»
 *   9  Guarda el producto             10 «Producto publicado exitosamente»
 *   12 «¿Desea añadir otro producto?» 14 Regresa a «Gestión de Producto»
 * y sus flujos alternos (campos vacíos, error en imágenes, producto ya
 * existente, editar producto, error de conexión y salir).
 */

// Pantalla a la que se regresa al terminar o al presionar «Salir»
const GESTION_PRODUCTO_URL = 'catalog.html';

const MAX_FOTOS = 5;
const MAX_TAMANO_FOTO = 5 * 1024 * 1024; // 5 MB
const FORMATOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const CAMPOS = ['titulo', 'precio', 'categoria', 'estadoProducto', 'descripcion'];

// Fotos elegidas: { file, url, error }
let fotos = [];
let modales = {};

document.addEventListener('DOMContentLoaded', () => {
  // Precondición: el miembro debe haber iniciado sesión (regla de negocio 1)
  if (!api.getToken()) {
    window.location.href = 'index.html';
    return;
  }

  modales = {
    existente: new bootstrap.Modal('#modalExistente'),
    conexion: new bootstrap.Modal('#modalConexion'),
    publicado: new bootstrap.Modal('#modalPublicado'),
    otro: new bootstrap.Modal('#modalOtro'),
  };

  document.getElementById('formProducto').addEventListener('submit', presionarAceptar);
  document.getElementById('fotosInput').addEventListener('change', agregarFotos);
  document.getElementById('btnEditar').addEventListener('click', editarProducto);
  document.getElementById('btnPublicar').addEventListener('click', publicar);
  document.getElementById('btnOkExistente').addEventListener('click', okProductoExistente);
  document.getElementById('btnReintentar').addEventListener('click', reintentar);
  document.getElementById('btnAceptarPublicado').addEventListener('click', aceptarPublicado);
  document.getElementById('btnOtroSi').addEventListener('click', anadirOtro);
  document.getElementById('btnOtroNo').addEventListener('click', regresarAGestion);
  document.querySelectorAll('.btn-salir').forEach((b) => b.addEventListener('click', salir));

  // Al corregir un campo se quita su marca de error
  CAMPOS.forEach((c) => {
    const el = document.getElementById(c);
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
  });

  mostrarFormulario();
});

/* ---------- Vistas ---------- */

// Paso 2
function mostrarFormulario() {
  document.getElementById('vistaResumen').hidden = true;
  document.getElementById('vistaFormulario').hidden = false;
  window.scrollTo(0, 0);
}

// Paso 7
function mostrarResumen(datos) {
  document.getElementById('resTitulo').textContent = datos.titulo;
  document.getElementById('resPrecio').textContent = `$${Number(datos.precio).toFixed(2)}`;
  document.getElementById('resCategoria').textContent = datos.categoria;
  document.getElementById('resEstado').textContent = datos.estadoProducto;
  document.getElementById('resDescripcion').textContent = datos.descripcion;

  const contenedor = document.getElementById('resumenFotos');
  contenedor.innerHTML = fotos.length
    ? fotos.map((f) => `<img src="${f.url}" alt="" class="rounded border" style="width:120px;height:120px;object-fit:cover;">`).join('')
    : '<span class="text-muted small">Sin fotos</span>';

  document.getElementById('vistaFormulario').hidden = true;
  document.getElementById('vistaResumen').hidden = false;
  window.scrollTo(0, 0);
}

/* ---------- Fotos ---------- */

function agregarFotos(e) {
  for (const file of e.target.files) {
    fotos.push({ file, url: URL.createObjectURL(file), error: errorDeFoto(file) });
  }
  e.target.value = ''; // permite volver a elegir el mismo archivo
  ocultarAlerta('alertaImagenes');
  pintarFotos();
}

function errorDeFoto(file) {
  if (!FORMATOS_VALIDOS.includes(file.type)) return 'Formato no válido';
  if (file.size > MAX_TAMANO_FOTO) return 'Pesa más de 5 MB';
  return null;
}

function quitarFoto(indice) {
  URL.revokeObjectURL(fotos[indice].url);
  fotos.splice(indice, 1);
  ocultarAlerta('alertaImagenes');
  pintarFotos();
}

function pintarFotos() {
  const lista = document.getElementById('listaFotos');
  lista.innerHTML = fotos.map((f, i) => {
    const conError = f.error || i >= MAX_FOTOS;
    const motivo = f.error || (i >= MAX_FOTOS ? 'Excede el límite' : '');
    return `
      <div class="position-relative text-center" style="width:110px;">
        <img src="${f.url}" alt="" class="rounded ${conError ? 'border border-2 border-danger' : 'border'}"
             style="width:110px;height:110px;object-fit:cover;" onerror="this.style.visibility='hidden'">
        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1"
                title="Quitar foto" onclick="quitarFoto(${i})"><i class="bi bi-x"></i></button>
        <div class="small text-truncate ${conError ? 'text-danger' : 'text-muted'}" title="${escapeHtml(f.file.name)}">
          ${conError ? escapeHtml(motivo) : escapeHtml(f.file.name)}
        </div>
      </div>`;
  }).join('');
}

/* ---------- Pasos 4 a 7: Aceptar, validar y verificar ---------- */

async function presionarAceptar(e) {
  e.preventDefault();
  ocultarAlerta('alertaFormulario');
  ocultarAlerta('alertaImagenes');

  // Paso 5: validar campos obligatorios (CA2)
  const datos = leerFormulario();
  const vacios = validarCampos(datos);
  if (vacios.length > 0) {
    mostrarAlerta('alertaFormulario', 'Completa los campos obligatorios señalados para continuar.');
    document.getElementById(vacios[0]).focus();
    return;
  }

  // Paso 5: validar imágenes (CA3)
  const errorImagenes = validarImagenes();
  if (errorImagenes) {
    mostrarAlerta('alertaImagenes', `<strong>Error en las imágenes.</strong> ${errorImagenes}`);
    return;
  }

  // Paso 6: verificar que el producto no exista ya (CA4)
  const btn = document.getElementById('btnAceptar');
  btn.disabled = true;
  try {
    await api.post('/products/validar', datos);
    mostrarResumen(datos);
  } catch (err) {
    if (err.status === 409) {
      modales.existente.show();
    } else if (err.status === 401) {
      sesionExpirada();
    } else if (esErrorDeConexion(err)) {
      mostrarAlerta('alertaFormulario', 'Error de conexión. Revisa tu conexión e intenta de nuevo.');
    } else {
      mostrarAlerta('alertaFormulario', escapeHtml(err.message));
    }
  } finally {
    btn.disabled = false;
  }
}

function leerFormulario() {
  const valor = (id) => document.getElementById(id).value.trim();
  return {
    titulo: valor('titulo'),
    precio: valor('precio'),
    categoria: valor('categoria'),
    estadoProducto: valor('estadoProducto'),
    descripcion: valor('descripcion'),
  };
}

/** Marca los campos vacíos o inválidos y devuelve sus ids. */
function validarCampos(datos) {
  const invalidos = CAMPOS.filter((c) => {
    if (c === 'precio') return datos.precio === '' || isNaN(datos.precio) || Number(datos.precio) < 0;
    return !datos[c];
  });
  CAMPOS.forEach((c) => document.getElementById(c).classList.toggle('is-invalid', invalidos.includes(c)));
  return invalidos;
}

function validarImagenes() {
  if (fotos.length > MAX_FOTOS) {
    return `Solo se permiten ${MAX_FOTOS} fotos y elegiste ${fotos.length}. Quita ${fotos.length - MAX_FOTOS}.`;
  }
  if (fotos.some((f) => f.error)) {
    return 'Quita las fotos marcadas en rojo. Solo se aceptan JPG, PNG o WEBP de hasta 5 MB.';
  }
  return null;
}

// Flujo alterno 6: al presionar OK regresa al formulario (con los datos para corregirlos)
function okProductoExistente() {
  modales.existente.hide();
  mostrarFormulario();
  document.getElementById('titulo').classList.add('is-invalid');
  document.getElementById('titulo').focus();
}

// Flujo alterno 8: «Editar producto» regresa al formulario con los datos ingresados (CA5)
function editarProducto() {
  mostrarFormulario();
}

/* ---------- Pasos 8 a 10: Publicar y guardar ---------- */

async function publicar() {
  const btn = document.getElementById('btnPublicar');
  btn.disabled = true;

  const formData = new FormData();
  const datos = leerFormulario();
  Object.entries(datos).forEach(([k, v]) => formData.append(k, v));
  fotos.forEach((f) => formData.append('fotos', f.file));

  try {
    await api.post('/products', formData);
    modales.publicado.show(); // Paso 10
  } catch (err) {
    if (esErrorDeConexion(err)) {
      modales.conexion.show(); // Flujo alterno 9 (CA6)
    } else if (err.status === 409) {
      modales.existente.show();
    } else if (err.status === 401) {
      sesionExpirada();
    } else if (/imágenes/i.test(err.message)) {
      mostrarFormulario();
      mostrarAlerta('alertaImagenes', escapeHtml(err.message));
    } else {
      mostrarFormulario();
      mostrarAlerta('alertaFormulario', escapeHtml(err.message));
    }
  } finally {
    btn.disabled = false;
  }
}

// Flujo alterno 9: «Reintentar» vuelve a intentar el guardado (regresa al paso 8)
function reintentar() {
  modales.conexion.hide();
  publicar();
}

function esErrorDeConexion(err) {
  // fetch lanza TypeError cuando no hay respuesta del servidor
  return err instanceof TypeError || (err.status && err.status >= 500);
}

/* ---------- Pasos 11 a 14 ---------- */

// Paso 11 → 12
function aceptarPublicado() {
  modales.publicado.hide();
  modales.otro.show();
}

// Flujo alterno 13: «Sí» regresa al paso 2 con un formulario nuevo
function anadirOtro() {
  modales.otro.hide();
  limpiarFormulario();
  mostrarFormulario();
}

// Paso 14
function regresarAGestion() {
  window.location.href = GESTION_PRODUCTO_URL;
}

// Flujo alterno 15 (CA8): descarta cualquier acción y regresa a «Gestión de Producto»
function salir() {
  limpiarFormulario();
  regresarAGestion();
}

/* ---------- Utilidades ---------- */

function limpiarFormulario() {
  document.getElementById('formProducto').reset();
  CAMPOS.forEach((c) => document.getElementById(c).classList.remove('is-invalid'));
  fotos.forEach((f) => URL.revokeObjectURL(f.url));
  fotos = [];
  pintarFotos();
  ocultarAlerta('alertaFormulario');
  ocultarAlerta('alertaImagenes');
}

function mostrarAlerta(id, html) {
  const el = document.getElementById(id);
  el.innerHTML = html;
  el.hidden = false;
}

function ocultarAlerta(id) {
  document.getElementById(id).hidden = true;
}

function sesionExpirada() {
  api.clearSession();
  window.location.href = 'index.html';
}
