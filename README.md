# UcabMarket 🛒
**Marketplace Web para la Comunidad UCAB**  
*Materia:* Ingeniería de Software – **Equipo 87.2** (5 integrantes)  
*Restricción de Acceso:* Exclusivo para usuarios con correo `@ucab.edu.ve`.  
*Alcance:* Plataforma web de escritorio, idioma español.

---

## 🛠️ Stack Tecnológico

- **Backend:** NestJS (TypeScript, Programación Orientada a Objetos, Arquitectura Modular).
- **Persistencia:** Capa centralizada `JsonDatabaseService` sobre archivos planos JSON locales (`data/*.json`).
- **Comunicación en Tiempo Real:** Socket.IO Gateway (`chats.gateway.ts`).
- **Gestión de Archivos:** Multer (carpeta `uploads/` local excluida de Git, límite de 5 fotos por producto de máx 5MB).
- **Validación:** `class-validator` y `class-transformer` con DTOs tipados.
- **Frontend:** HTML5 semántico, CSS3 personalizado (`custom.css`), JavaScript ES6 modular y Bootstrap 5 vía CDN oficial.

---

## 🌳 Estrategia de Ramas en Git

El equipo adopta una estrategia de ramificación basada en GitFlow adaptada a la dinámica del proyecto:

| Rama | Propósito | Reglas y Protección |
| :--- | :--- | :--- |
| `main` | Código de producción / entregas oficiales de los Sprints. | Protegida. Solo recibe merges validados desde `develop` mediante Pull Request aprobado. |
| `develop` | Rama de integración continua de desarrollo activo. | Recibe merges de las ramas de características (`feature/*`). Debe estar siempre funcional. |
| `docs` | Documentación formal: Brief v1.6, diagramas de actividades UML y especificaciones de Casos de Uso. | Centraliza cambios de la carpeta `docs/`. |
| `feature/<meta>-<hu>` | Ramas de trabajo para cada Historia de Usuario asignada a un integrante. | Se desprende de `develop` y se integra a `develop` vía PR. |

### Ramas del Sprint 1

| Rama | HU | Responsable |
| :--- | :--- | :--- |
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

---

## 🚀 Guía de Instalación y Ejecución

### 1. Prerrequisitos
- **Node.js** (versión LTS 18.x o superior).
- **npm** (incluido con Node.js).
- Navegador web moderno en resolución de escritorio (mínimo 1024px).

---

### 2. Configurar y Ejecutar el Backend

1. Abre una terminal y dirígete a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Crea tu archivo de variables de entorno a partir de la plantilla:
   ```bash
   # En Windows PowerShell:
   Copy-Item .env.example .env

   # En Linux / macOS / Git Bash:
   cp .env.example .env
   ```
4. Inicia el servidor de desarrollo con recarga en caliente:
   ```bash
   npm run start:dev
   ```
5. El backend estará listo en: `http://localhost:3000`.

---

### 3. Ejecutar el Frontend

Dado que el frontend es HTML/CSS/JavaScript nativo con Bootstrap vía CDN:

#### Opción A (Extensión Live Server en VS Code):
1. Abre la carpeta `frontend/public/` en VS Code.
2. Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.
3. Se abrirá automáticamente en `http://127.0.0.1:5500`.

#### Opción B (Servidor estático simple con Node.js `http-server` o `npx serve`):
1. En una nueva terminal, navega a la carpeta de la interfaz:
   ```bash
   cd frontend/public
   npx serve -l 5500
   ```
2. Abre tu navegador en: `http://localhost:5500`.

---

## 📁 Estructura del Repositorio

```text
UcabMarket/
├── README.md                      # Esta guía de instalación, ramas y arquitectura
├── .gitignore                     # Exclusión global de dependencias, entornos e imágenes
├── docs/                          # Documentación formal del proyecto
│   ├── brief/                     # Brief Equipo 87 2 (v1.6) y versiones anteriores
│   ├── planificacion/             # Stack, Trello y cronograma
│   ├── diagramas/                 # Diagramas de actividades (draw.io + PNG)
│   ├── segunda-entrega/           # HU Crear Chat: tabla 3C y especificación
│   └── instrucciones/             # Plan de clase V5 e instrucciones de las entregas
├── backend/                       # Servidor NestJS
│   ├── .env.example               # Variables de entorno de referencia
│   ├── .gitignore                 # Exclusiones de Git (node_modules, uploads/, dist/)
│   ├── package.json               # Dependencias y scripts
│   ├── tsconfig.json              # Configuración de TypeScript
│   ├── uploads/                   # Archivos físicos locales (fuera de Git)
│   │   ├── products/              # Fotos de publicaciones (máx 5 fotos)
│   │   └── chats/                 # Archivos adjuntos de mensajería
│   └── src/
│       ├── main.ts                # Entrada principal, CORS y ValidationPipe
│       ├── app.module.ts          # Módulo raíz
│       ├── persistence/           # Única capa autorizada para leer y escribir JSON
│       │   ├── json-database.service.ts
│       │   ├── persistence.module.ts
│       │   └── data/              # Base de datos basada en archivos planos JSON
│       │       ├── users.json
│       │       ├── products.json
│       │       ├── questions.json
│       │       ├── chats.json
│       │       ├── messages.json
│       │       └── reviews.json
│       ├── auth/                  # Autenticación, JWT y Guards
│       ├── users/                 # Gestión de cuentas y perfiles @ucab.edu.ve
│       ├── products/              # Catálogo, fotos Multer y publicaciones
│       ├── questions/             # Preguntas públicas sobre productos
│       ├── chats/                 # Socket.IO Gateway y mensajería en tiempo real
│       └── reviews/               # Reseñas comunitarias de confianza
└── frontend/                      # Cliente web de escritorio
    └── public/
        ├── index.html             # Acceso y registro @ucab.edu.ve
        ├── catalog.html           # Catálogo y búsqueda de productos
        ├── product-detail.html    # Detalle con galería y preguntas públicas
        ├── profile.html           # Perfil y pestaña de reseñas de confianza
        ├── chat.html              # Mensajería Socket.IO en tiempo real
        └── assets/
            ├── css/
            │   └── custom.css     # Estilos complementarios a Bootstrap 5
            └── js/
                ├── config.js      # URL base del backend centralizada
                ├── api.js         # Módulo fetch reutilizable con token Bearer
                ├── auth.js        # Lógica de login/registro @ucab.edu.ve
                ├── products.js    # Renderizado y filtros de catálogo
                ├── questions.js   # Preguntas y respuestas públicas
                ├── profile.js     # Gestión de perfil del estudiante
                ├── reviews.js     # Añadir y consultar reseñas de confianza
                └── chat.js        # Cliente Socket.IO y salas privadas
```
