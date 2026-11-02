# Tarjetas completas de Trello · UcabMarket (versión sin Carrito)

Cada tarjeta lleva: título, etiqueta, actor, responsable, fecha límite, descripción y checklist de 12 tareas (Especificación, Diseño, Implementación y Pruebas).
Los responsables y las fechas son una propuesta: cámbienlos según como se reparta el equipo.

Reparto: Paola (Usuario) · Eliavalentina (Publicaciones) · Victoria (Catálogo de productos y Auditoría perfil reporte) · José (Chats y las auditorías de publicación y reseña) · Gabriel (Reseñas).

## Cómo cargar cada tarjeta

1. Abre la tarjeta. Botón **Miembros**: asigna al responsable (primero invita a todos desde Compartir).
2. Botón **Fechas**: pon la fecha límite.
3. Botón **Etiquetas**: elige la de la épica.
4. Pega la **Descripción** en el campo de descripción.
5. Botón **Checklist**: nómbrala `12 tareas` y pega las 12 líneas. En las demás tarjetas usa «Copiar elementos de...» y cambia los nombres, o pega la checklist de cada una.

Etiquetas: Publicaciones (verde), Usuario (azul), Chats (morado), Reseñas (amarillo), Catálogo de productos (naranja), Brief (gris).

Calendario: Sprint 1 del 12 al 27 de octubre (pausa por parciales del 18 al 23); integración el 28; Segunda Entrega el 29. Sprint 2 del 30 de octubre al 4 de noviembre; integrar y probar del 5 al 7; entrega el 8 de noviembre.

## Tarjetas de Brief (lista Inicio)

- **[Brief] Actualizar el Mapa de Impacto y las Restricciones (sin Carrito, con Catálogo de productos)** · Fecha límite: 6 oct · Responsable: todo el equipo
- **[Brief] Alinear el Backlog (Canva) con el Mapa de Impacto del Brief** · Fecha límite: 6 oct · Responsable: todo el equipo
- **[Brief] Poner el enlace público de Trello en la sección 5 y entregar el Brief** · Fecha límite: 6 oct · Responsable: todo el equipo

Checklist de la tarjeta de Brief (5 secciones): Necesidad, Backlog, Restricciones, Rangos de Calidad, Plan de Trabajo.

## Tarjetas de Planificación (lista Planificación)

- **Plan (cronograma)**: calendario de los sprints con las fechas de cada historia (12 al 27 de oct, Sprint 1; 30 de oct al 4 de nov, Sprint 2).
- **Herramientas**: repositorio Git y entorno, Trello, Canva (Backlog), herramienta de maquetas.
- **Maqueta general**: maquetas de las pantallas principales.
- **Arquitectura base**: estructura general de UcabMarket por módulos y tecnologías elegidas.

## Despliegue

El despliegue no cuenta dentro de las 12 tareas de cada historia: se hace al final de cada sprint con una tarjeta «Despliegue Sprint 1» y «Despliegue Sprint 2» al final de la lista de ese sprint.

## Seguimiento (lista Seguimiento, corre en paralelo con Ejecución)

Tarjetas de control del avance de cada sprint (revisión de avance, pruebas de aceptación del sprint, problemas y cambios).

## Cierre (lista Cierre)

Integración final, entrega y retrospectiva.


## Sprint 1 (lista Ejecución · Sprint 1)

### 1. [Usuario] Crear cuenta

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Usuario
- **Actor:** Usuario
- **Responsable:** Paola
- **Fecha límite:** 12 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario nuevo, quiero registrarme con mi correo @ucab.edu.ve, una clave y mi nombre para crear mi cuenta.
Criterio de aceptación: Solo acepta correos @ucab.edu.ve. La clave se guarda cifrada. Si falta un dato o el correo ya existe, muestra el error al instante.
Característica ISO 25010: Seguridad (autenticidad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «crear cuenta»: qué debe hacer
Especificación no funcional de «crear cuenta»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «crear cuenta»
Estudio de datos de «crear cuenta»: qué información usa y guarda
Diseño de la lógica de «crear cuenta»
Diseño de la arquitectura de «crear cuenta»: dónde encaja en el sistema
Implementación de «crear cuenta»
Prueba de «crear cuenta» por quien la programó
Integración de «crear cuenta» con el resto del sistema
Probar «crear cuenta» ya integrada
Corregir los errores encontrados en «crear cuenta»
Pruebas finales de «crear cuenta» contra su criterio de aceptación
```

### 2. [Usuario] Consultar perfil

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Usuario
- **Actor:** Usuario
- **Responsable:** Paola
- **Fecha límite:** 13 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario registrado, quiero ver mis datos personales.
Criterio de aceptación: Muestra nombre y correo del usuario con sesión iniciada. Nadie más puede ver los datos privados de ese perfil.
Característica ISO 25010: Seguridad (confidencialidad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «consultar perfil»: qué debe hacer
Especificación no funcional de «consultar perfil»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «consultar perfil»
Estudio de datos de «consultar perfil»: qué información usa y guarda
Diseño de la lógica de «consultar perfil»
Diseño de la arquitectura de «consultar perfil»: dónde encaja en el sistema
Implementación de «consultar perfil»
Prueba de «consultar perfil» por quien la programó
Integración de «consultar perfil» con el resto del sistema
Probar «consultar perfil» ya integrada
Corregir los errores encontrados en «consultar perfil»
Pruebas finales de «consultar perfil» contra su criterio de aceptación
```

### 3. [Publicaciones] Añadir publicación

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Publicaciones
- **Actor:** Usuario
- **Responsable:** Eliavalentina
- **Fecha límite:** 14 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como vendedor, quiero publicar un recurso con fotos, precio, categoría y descripción para ofrecerlo a los clientes.
Criterio de aceptación: Valida los campos obligatorios y las fotos. Al guardar, la publicación aparece en el listado.
Característica ISO 25010: Adecuación funcional
```

**Checklist «12 tareas»:**
```
Especificación funcional de «añadir publicación»: qué debe hacer
Especificación no funcional de «añadir publicación»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «añadir publicación»
Estudio de datos de «añadir publicación»: qué información usa y guarda
Diseño de la lógica de «añadir publicación»
Diseño de la arquitectura de «añadir publicación»: dónde encaja en el sistema
Implementación de «añadir publicación»
Prueba de «añadir publicación» por quien la programó
Integración de «añadir publicación» con el resto del sistema
Probar «añadir publicación» ya integrada
Corregir los errores encontrados en «añadir publicación»
Pruebas finales de «añadir publicación» contra su criterio de aceptación
```

### 4. [Publicaciones] Consultar publicación

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Publicaciones
- **Actor:** Usuario
- **Responsable:** Eliavalentina
- **Fecha límite:** 15 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como vendedor, quiero consultar mis propias publicaciones para revisar lo que tengo ofrecido.
Criterio de aceptación: Muestra solo las publicaciones del vendedor con foto, precio, categoría y estado. Carga en menos de 2 segundos.
Característica ISO 25010: Eficiencia de desempeño (comportamiento temporal)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «consultar publicación»: qué debe hacer
Especificación no funcional de «consultar publicación»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «consultar publicación»
Estudio de datos de «consultar publicación»: qué información usa y guarda
Diseño de la lógica de «consultar publicación»
Diseño de la arquitectura de «consultar publicación»: dónde encaja en el sistema
Implementación de «consultar publicación»
Prueba de «consultar publicación» por quien la programó
Integración de «consultar publicación» con el resto del sistema
Probar «consultar publicación» ya integrada
Corregir los errores encontrados en «consultar publicación»
Pruebas finales de «consultar publicación» contra su criterio de aceptación
```

### 5. [Catálogo de productos] Visualizar catálogo de productos

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Catálogo de productos
- **Actor:** Ambos
- **Responsable:** Victoria
- **Fecha límite:** 16 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario, quiero ver el catálogo de productos publicados para elegir lo que me interesa.
Criterio de aceptación: Muestra foto, título, precio y vendedor de cada producto. Carga en menos de 2 segundos. Si no hay productos, lo indica.
Característica ISO 25010: Eficiencia de desempeño (comportamiento temporal)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «visualizar catálogo de productos»: qué debe hacer
Especificación no funcional de «visualizar catálogo de productos»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «visualizar catálogo de productos»
Estudio de datos de «visualizar catálogo de productos»: qué información usa y guarda
Diseño de la lógica de «visualizar catálogo de productos»
Diseño de la arquitectura de «visualizar catálogo de productos»: dónde encaja en el sistema
Implementación de «visualizar catálogo de productos»
Prueba de «visualizar catálogo de productos» por quien la programó
Integración de «visualizar catálogo de productos» con el resto del sistema
Probar «visualizar catálogo de productos» ya integrada
Corregir los errores encontrados en «visualizar catálogo de productos»
Pruebas finales de «visualizar catálogo de productos» contra su criterio de aceptación
```

### 6. [Catálogo de productos] Búsqueda de productos

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Catálogo de productos
- **Actor:** Ambos
- **Responsable:** Victoria
- **Fecha límite:** 17 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario, quiero buscar productos por nombre para encontrar rápido lo que necesito.
Criterio de aceptación: Devuelve los productos cuyo nombre contiene el texto buscado y avisa si no hay resultados. Responde en menos de 2 segundos.
Característica ISO 25010: Capacidad de interacción (operabilidad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «búsqueda de productos»: qué debe hacer
Especificación no funcional de «búsqueda de productos»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «búsqueda de productos»
Estudio de datos de «búsqueda de productos»: qué información usa y guarda
Diseño de la lógica de «búsqueda de productos»
Diseño de la arquitectura de «búsqueda de productos»: dónde encaja en el sistema
Implementación de «búsqueda de productos»
Prueba de «búsqueda de productos» por quien la programó
Integración de «búsqueda de productos» con el resto del sistema
Probar «búsqueda de productos» ya integrada
Corregir los errores encontrados en «búsqueda de productos»
Pruebas finales de «búsqueda de productos» contra su criterio de aceptación
```

### 7. [Chats] Crear chat

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Chats
- **Actor:** Usuario
- **Responsable:** José
- **Fecha límite:** 24 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como vendedor o cliente, quiero iniciar un chat con la otra persona para coordinar la compra.
Criterio de aceptación: El chat se crea entre dos usuarios con sesión iniciada. No muestra datos personales (correo, teléfono) de entrada.
Característica ISO 25010: Seguridad (confidencialidad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «crear chat»: qué debe hacer
Especificación no funcional de «crear chat»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «crear chat»
Estudio de datos de «crear chat»: qué información usa y guarda
Diseño de la lógica de «crear chat»
Diseño de la arquitectura de «crear chat»: dónde encaja en el sistema
Implementación de «crear chat»
Prueba de «crear chat» por quien la programó
Integración de «crear chat» con el resto del sistema
Probar «crear chat» ya integrada
Corregir los errores encontrados en «crear chat»
Pruebas finales de «crear chat» contra su criterio de aceptación
```

### 8. [Chats] Añadir archivos

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Chats
- **Actor:** Usuario
- **Responsable:** José
- **Fecha límite:** 25 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario, quiero añadir fotos o documentos en el chat.
Criterio de aceptación: Acepta los formatos permitidos y rechaza otros con un mensaje claro. El archivo se ve en la conversación.
Característica ISO 25010: Capacidad de interacción (protección frente a errores)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «añadir archivos»: qué debe hacer
Especificación no funcional de «añadir archivos»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «añadir archivos»
Estudio de datos de «añadir archivos»: qué información usa y guarda
Diseño de la lógica de «añadir archivos»
Diseño de la arquitectura de «añadir archivos»: dónde encaja en el sistema
Implementación de «añadir archivos»
Prueba de «añadir archivos» por quien la programó
Integración de «añadir archivos» con el resto del sistema
Probar «añadir archivos» ya integrada
Corregir los errores encontrados en «añadir archivos»
Pruebas finales de «añadir archivos» contra su criterio de aceptación
```

### 9. [Reseñas] Añadir reseña

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Reseñas
- **Actor:** Usuario
- **Responsable:** Gabriel
- **Fecha límite:** 26 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como cliente, quiero calificar y comentar a un vendedor.
Criterio de aceptación: Solo usuarios registrados pueden reseñar. La calificación es obligatoria. La reseña aparece en el perfil del vendedor.
Característica ISO 25010: Seguridad (integridad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «añadir reseña»: qué debe hacer
Especificación no funcional de «añadir reseña»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «añadir reseña»
Estudio de datos de «añadir reseña»: qué información usa y guarda
Diseño de la lógica de «añadir reseña»
Diseño de la arquitectura de «añadir reseña»: dónde encaja en el sistema
Implementación de «añadir reseña»
Prueba de «añadir reseña» por quien la programó
Integración de «añadir reseña» con el resto del sistema
Probar «añadir reseña» ya integrada
Corregir los errores encontrados en «añadir reseña»
Pruebas finales de «añadir reseña» contra su criterio de aceptación
```

### 10. [Reseñas] Consultar reseña

- **Lista:** Ejecución · Sprint 1
- **Etiqueta:** Reseñas
- **Actor:** Usuario
- **Responsable:** Gabriel
- **Fecha límite:** 27 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como cliente, quiero ver las reseñas de un vendedor antes de comprarle.
Criterio de aceptación: Lista las reseñas con puntuación y comentario, y muestra el promedio del vendedor.
Característica ISO 25010: Adecuación funcional
```

**Checklist «12 tareas»:**
```
Especificación funcional de «consultar reseña»: qué debe hacer
Especificación no funcional de «consultar reseña»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «consultar reseña»
Estudio de datos de «consultar reseña»: qué información usa y guarda
Diseño de la lógica de «consultar reseña»
Diseño de la arquitectura de «consultar reseña»: dónde encaja en el sistema
Implementación de «consultar reseña»
Prueba de «consultar reseña» por quien la programó
Integración de «consultar reseña» con el resto del sistema
Probar «consultar reseña» ya integrada
Corregir los errores encontrados en «consultar reseña»
Pruebas finales de «consultar reseña» contra su criterio de aceptación
```

## Sprint 2 (lista Ejecución · Sprint 2)

### 11. [Publicaciones] Modificar publicación

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Publicaciones
- **Actor:** Usuario
- **Responsable:** Eliavalentina
- **Fecha límite:** 30 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como vendedor, quiero editar el precio, las fotos o la descripción de mi publicación.
Criterio de aceptación: Solo el dueño puede editarla. Los cambios se ven al guardar.
Característica ISO 25010: Seguridad (integridad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «modificar publicación»: qué debe hacer
Especificación no funcional de «modificar publicación»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «modificar publicación»
Estudio de datos de «modificar publicación»: qué información usa y guarda
Diseño de la lógica de «modificar publicación»
Diseño de la arquitectura de «modificar publicación»: dónde encaja en el sistema
Implementación de «modificar publicación»
Prueba de «modificar publicación» por quien la programó
Integración de «modificar publicación» con el resto del sistema
Probar «modificar publicación» ya integrada
Corregir los errores encontrados en «modificar publicación»
Pruebas finales de «modificar publicación» contra su criterio de aceptación
```

### 12. [Usuario] Modificar perfil

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Usuario
- **Actor:** Usuario
- **Responsable:** Paola
- **Fecha límite:** 30 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario registrado, quiero actualizar mis datos personales.
Criterio de aceptación: Solo el dueño puede modificarlo. Valida los datos antes de guardar.
Característica ISO 25010: Seguridad (integridad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «modificar perfil»: qué debe hacer
Especificación no funcional de «modificar perfil»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «modificar perfil»
Estudio de datos de «modificar perfil»: qué información usa y guarda
Diseño de la lógica de «modificar perfil»
Diseño de la arquitectura de «modificar perfil»: dónde encaja en el sistema
Implementación de «modificar perfil»
Prueba de «modificar perfil» por quien la programó
Integración de «modificar perfil» con el resto del sistema
Probar «modificar perfil» ya integrada
Corregir los errores encontrados en «modificar perfil»
Pruebas finales de «modificar perfil» contra su criterio de aceptación
```

### 13. [Publicaciones] Eliminar publicación

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Publicaciones
- **Actor:** Usuario
- **Responsable:** Eliavalentina
- **Fecha límite:** 31 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como vendedor, quiero retirar una publicación.
Criterio de aceptación: Solo el dueño puede eliminarla. Pide confirmación. Deja de aparecer en el listado y en el catálogo.
Característica ISO 25010: Capacidad de interacción (protección frente a errores)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «eliminar publicación»: qué debe hacer
Especificación no funcional de «eliminar publicación»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «eliminar publicación»
Estudio de datos de «eliminar publicación»: qué información usa y guarda
Diseño de la lógica de «eliminar publicación»
Diseño de la arquitectura de «eliminar publicación»: dónde encaja en el sistema
Implementación de «eliminar publicación»
Prueba de «eliminar publicación» por quien la programó
Integración de «eliminar publicación» con el resto del sistema
Probar «eliminar publicación» ya integrada
Corregir los errores encontrados en «eliminar publicación»
Pruebas finales de «eliminar publicación» contra su criterio de aceptación
```

### 14. [Catálogo de productos] Consultar productos

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Catálogo de productos
- **Actor:** Ambos
- **Responsable:** Victoria
- **Fecha límite:** 31 oct

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario, quiero consultar el detalle de un producto para decidir si me interesa.
Criterio de aceptación: Desde el catálogo se abre el detalle con fotos, descripción, precio, categoría y vendedor del producto.
Característica ISO 25010: Adecuación funcional
```

**Checklist «12 tareas»:**
```
Especificación funcional de «consultar productos»: qué debe hacer
Especificación no funcional de «consultar productos»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «consultar productos»
Estudio de datos de «consultar productos»: qué información usa y guarda
Diseño de la lógica de «consultar productos»
Diseño de la arquitectura de «consultar productos»: dónde encaja en el sistema
Implementación de «consultar productos»
Prueba de «consultar productos» por quien la programó
Integración de «consultar productos» con el resto del sistema
Probar «consultar productos» ya integrada
Corregir los errores encontrados en «consultar productos»
Pruebas finales de «consultar productos» contra su criterio de aceptación
```

### 15. [Reseñas] Modificar reseña

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Reseñas
- **Actor:** Usuario
- **Responsable:** Gabriel
- **Fecha límite:** 1 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como cliente, quiero editar mi reseña.
Criterio de aceptación: Solo el autor puede editarla. El promedio del vendedor se recalcula.
Característica ISO 25010: Seguridad (integridad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «modificar reseña»: qué debe hacer
Especificación no funcional de «modificar reseña»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «modificar reseña»
Estudio de datos de «modificar reseña»: qué información usa y guarda
Diseño de la lógica de «modificar reseña»
Diseño de la arquitectura de «modificar reseña»: dónde encaja en el sistema
Implementación de «modificar reseña»
Prueba de «modificar reseña» por quien la programó
Integración de «modificar reseña» con el resto del sistema
Probar «modificar reseña» ya integrada
Corregir los errores encontrados en «modificar reseña»
Pruebas finales de «modificar reseña» contra su criterio de aceptación
```

### 16. [Reseñas] Eliminar reseña

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Reseñas
- **Actor:** Usuario
- **Responsable:** Gabriel
- **Fecha límite:** 2 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como cliente, quiero borrar mi reseña.
Criterio de aceptación: Solo el autor la elimina. Pide confirmación. El promedio se recalcula.
Característica ISO 25010: Capacidad de interacción (protección frente a errores)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «eliminar reseña»: qué debe hacer
Especificación no funcional de «eliminar reseña»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «eliminar reseña»
Estudio de datos de «eliminar reseña»: qué información usa y guarda
Diseño de la lógica de «eliminar reseña»
Diseño de la arquitectura de «eliminar reseña»: dónde encaja en el sistema
Implementación de «eliminar reseña»
Prueba de «eliminar reseña» por quien la programó
Integración de «eliminar reseña» con el resto del sistema
Probar «eliminar reseña» ya integrada
Corregir los errores encontrados en «eliminar reseña»
Pruebas finales de «eliminar reseña» contra su criterio de aceptación
```

### 17. [Chats] Reportar cuenta

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Chats
- **Actor:** Usuario
- **Responsable:** José
- **Fecha límite:** 2 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como usuario, quiero reportar una cuenta cuando haya un problema, para que el administrador la revise.
Criterio de aceptación: El reporte pide un motivo y queda registrado para el administrador.
Característica ISO 25010: Seguridad (responsabilidad)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «reportar cuenta»: qué debe hacer
Especificación no funcional de «reportar cuenta»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «reportar cuenta»
Estudio de datos de «reportar cuenta»: qué información usa y guarda
Diseño de la lógica de «reportar cuenta»
Diseño de la arquitectura de «reportar cuenta»: dónde encaja en el sistema
Implementación de «reportar cuenta»
Prueba de «reportar cuenta» por quien la programó
Integración de «reportar cuenta» con el resto del sistema
Probar «reportar cuenta» ya integrada
Corregir los errores encontrados en «reportar cuenta»
Pruebas finales de «reportar cuenta» contra su criterio de aceptación
```

### 18. [Usuario] Auditoría perfil reporte

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Usuario
- **Actor:** Administrador
- **Responsable:** Victoria
- **Fecha límite:** 3 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como administrador, quiero revisar el perfil reportado para decidir si el reporte procede y bloquear o no al usuario.
Criterio de aceptación: Solo el administrador accede a los perfiles reportados. Puede aceptar o rechazar el reporte y bloquear al usuario. Cada decisión queda registrada.
Característica ISO 25010: Seguridad (responsabilidad y no-repudio)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «auditoría perfil reporte»: qué debe hacer
Especificación no funcional de «auditoría perfil reporte»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «auditoría perfil reporte»
Estudio de datos de «auditoría perfil reporte»: qué información usa y guarda
Diseño de la lógica de «auditoría perfil reporte»
Diseño de la arquitectura de «auditoría perfil reporte»: dónde encaja en el sistema
Implementación de «auditoría perfil reporte»
Prueba de «auditoría perfil reporte» por quien la programó
Integración de «auditoría perfil reporte» con el resto del sistema
Probar «auditoría perfil reporte» ya integrada
Corregir los errores encontrados en «auditoría perfil reporte»
Pruebas finales de «auditoría perfil reporte» contra su criterio de aceptación
```

### 19. [Publicaciones] Auditoría publicación reporte

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Publicaciones
- **Actor:** Administrador
- **Responsable:** José
- **Fecha límite:** 3 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como administrador, quiero revisar la publicación reportada para decidir si el reporte procede y eliminarla si incumple las normas.
Criterio de aceptación: Solo el administrador accede a las publicaciones reportadas. Puede aceptar o rechazar el reporte y eliminar la publicación. Cada decisión queda registrada.
Característica ISO 25010: Seguridad (responsabilidad y no-repudio)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «auditoría publicación reporte»: qué debe hacer
Especificación no funcional de «auditoría publicación reporte»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «auditoría publicación reporte»
Estudio de datos de «auditoría publicación reporte»: qué información usa y guarda
Diseño de la lógica de «auditoría publicación reporte»
Diseño de la arquitectura de «auditoría publicación reporte»: dónde encaja en el sistema
Implementación de «auditoría publicación reporte»
Prueba de «auditoría publicación reporte» por quien la programó
Integración de «auditoría publicación reporte» con el resto del sistema
Probar «auditoría publicación reporte» ya integrada
Corregir los errores encontrados en «auditoría publicación reporte»
Pruebas finales de «auditoría publicación reporte» contra su criterio de aceptación
```

### 20. [Reseñas] Auditoría reseña reporte

- **Lista:** Ejecución · Sprint 2
- **Etiqueta:** Reseñas
- **Actor:** Administrador
- **Responsable:** José
- **Fecha límite:** 4 nov

**Descripción (pegar en la tarjeta):**
```
Historia: Como administrador, quiero revisar la reseña reportada para decidir si el reporte procede y eliminarla si incumple las normas.
Criterio de aceptación: Solo el administrador accede a las reseñas reportadas. Puede aceptar o rechazar el reporte y eliminar la reseña. Cada decisión queda registrada.
Característica ISO 25010: Seguridad (responsabilidad y no-repudio)
```

**Checklist «12 tareas»:**
```
Especificación funcional de «auditoría reseña reporte»: qué debe hacer
Especificación no funcional de «auditoría reseña reporte»: calidad exigida (ISO 25010)
Diseño de la interfaz (HM) de «auditoría reseña reporte»
Estudio de datos de «auditoría reseña reporte»: qué información usa y guarda
Diseño de la lógica de «auditoría reseña reporte»
Diseño de la arquitectura de «auditoría reseña reporte»: dónde encaja en el sistema
Implementación de «auditoría reseña reporte»
Prueba de «auditoría reseña reporte» por quien la programó
Integración de «auditoría reseña reporte» con el resto del sistema
Probar «auditoría reseña reporte» ya integrada
Corregir los errores encontrados en «auditoría reseña reporte»
Pruebas finales de «auditoría reseña reporte» contra su criterio de aceptación
```
