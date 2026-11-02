# UcabMarket

Marketplace web para que la comunidad UCAB ofrezca y busque productos nuevos y usados.
Ingeniería de Software · UCAB · **Equipo 87** (Brief v1.6, 16/10/2026).

**Equipo:** Eliavalentina González, Paola De La Cruz, Victoria Palumbo, José Viana, Gabriel García.

## Stack

| Capa | Herramienta |
|------|-------------|
| Frontend | HTML · CSS · JS + Bootstrap (`public/`) |
| Backend | Node.js + Express (`src/server.js`, rutas en `src/routes/`) |
| Tiempo real | Socket.IO (chats) |
| Archivos | Multer (máx. 5 fotos por publicación, archivos del chat) |
| Seguridad | bcrypt + express-session |
| Datos | Archivos JSON en `db/`, leídos solo desde `src/db.js` |

```bash
npm install
npm start   # http://localhost:3000
```

## Ramas

| Rama | Para qué |
|------|----------|
| `main` | Lo que se entrega y se presenta. Solo recibe merges de `develop` al cerrar cada sprint. |
| `develop` | Integración del equipo. Cada HU terminada se une aquí. |
| `feature/<meta>-<hu>` | Una rama por historia de usuario, sale de `develop` y vuelve a `develop`. |
| `docs` | Brief, diagramas, especificaciones y entregas (carpeta `docs/`). |

### Sprint 1 (10 HU, 2 por integrante)

| Rama | HU | Responsable |
|------|----|-------------|
| `feature/usuario-crear-cuenta` | Crear cuenta | Paola |
| `feature/usuario-consultar-perfil` | Consultar perfil | Paola |
| `feature/productos-anadir-publicacion` | Añadir publicación | Eliavalentina |
| `feature/productos-consultar-publicacion` | Consultar publicación | Eliavalentina |
| `feature/catalogo-visualizar` | Visualizar catálogo de productos | Victoria |
| `feature/catalogo-busqueda` | Búsqueda de productos | Victoria |
| `feature/chats-crear-chat` | Crear chat | José |
| `feature/chats-anadir-archivos` | Añadir archivos | José |
| `feature/resenas-anadir` | Añadir reseña | Gabriel |
| `feature/resenas-consultar` | Consultar reseña | Gabriel |

Las ramas del Sprint 2 se crean al empezarlo, con el mismo formato.

### Flujo de trabajo

```bash
git checkout develop
git pull
git checkout feature/chats-crear-chat
git merge develop          # traer lo último del equipo
# ... trabajar y hacer commits ...
git push -u origin feature/chats-crear-chat
```

Luego se abre un Pull Request hacia `develop`, otro integrante lo revisa y se une.
Mensajes de commit en español y en presente: «Añade ruta POST /api/chats».

## Documentación (`docs/`)

| Carpeta | Contenido |
|---------|-----------|
| `brief/` | Brief Equipo 87 2 (v1.6), plantilla editable, v1.1 y propuesta inicial |
| `planificacion/` | Stack, estructura y tarjetas del Trello, script del tablero |
| `diagramas/` | Diagramas de actividades (draw.io + PNG) |
| `segunda-entrega/` | Crear Chat: tabla 3C, especificación textual, texto para Trello |
| `instrucciones/` | Plan de clase V5 e instrucciones de cada unidad/entrega |

Trello del equipo: https://trello.com/b/IeyUlgM0
