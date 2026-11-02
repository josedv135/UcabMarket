# Crear Chat: cómo subirlo al Trello (Segunda Entrega)

La especificación completa (HU, 3C, flujo textual y alternos) es la que corregiste el 28/10:
`C:\Users\josev\UCabestudios\IS\Segunda Entrega\HU Crear Chat.md`

Archivos de esta carpeta que vas a subir:
- `Crear Chat - Tabla 3C.png`: la tabla de 3 columnas.
- `Crear Chat - Diagrama de Actividades.png`: el diagrama con calles, rombos en Sistema, barras y conector ①.

---

## 1. Qué usamos de la ISO/IEC 25010

| | |
|---|---|
| Norma | ISO/IEC 25010 (los nombres que usa la profesora, como «Capacidad de interacción», «Flexibilidad» y «Protección», son los de la versión 2023) |
| Rango de calidad del Brief | Seguridad: la información de las cuentas debe estar resguardada |
| Característica | **Seguridad** |
| Subcaracterística | **Confidencialidad**: el producto garantiza que solo puedan acceder a los datos quienes están autorizados |
| Dónde aparece en Crear Chat | Regla de negocio 3 y CA4: el chat es privado entre los dos y no muestra correo ni teléfono |
| Por qué esta y no otra | Seguridad tiene también Integridad, No repudio, Responsabilidad, Autenticidad y Resistencia. Pero lo que protege esta HU es que los datos personales **no se vean**, y eso es confidencialidad. Además, tu tarjeta de Trello ya decía «ISO 25010: Seguridad (confidencialidad)». |

Va en **dos lugares** del Trello:
1. **En tu HU**, dentro de la Conversación (en «Otras restricciones»). Ya está en la imagen de la tabla.
2. **En la tarjeta «Especificación de Requisitos No Funcionales»**, en el punto 5 del formulario (ver el paso 4).

---

## 2. Subir el diagrama a la tarjeta «Crear Chat»

1. Entra a trello.com con tu cuenta y abre el tablero **UcabMarket - Brief y Sprints**.
2. En la lista **Ejecución - Sprint 1**, haz clic en la tarjeta **Crear Chat** para abrirla.
3. Debajo del título, pulsa **+ Añadir** y luego **Adjunto**.
4. Pulsa **Elige un archivo** y selecciona `Crear Chat - Diagrama de Actividades.png`. Aparece en la sección **Adjuntos** de la tarjeta.
5. Copia el enlace del diagrama: en **Adjuntos**, haz clic derecho sobre el nombre del archivo y elige **Copiar dirección del enlace**.
   - Si no te sale esa opción, haz clic en el adjunto para abrirlo, pulsa el icono de abrirlo en una pestaña nueva y copia la dirección de la barra del navegador.
   - Guarda ese enlace: lo pegas en el paso 3.

## 3. Escribir la descripción (como el ejemplo de la profesora)

1. En la tarjeta, junto a **Descripción**, pulsa **Editar**.
2. Borra el texto viejo («Historia: … Criterio: … ISO 25010: …»): Ctrl+A y luego Supr.
3. Escribe exactamente esto:
   - 1.ª línea: **Historia Crear Chat** (selecciónala y pulsa Ctrl+B para ponerla en negrita).
   - Enter. 2.ª línea: `Autor: Viana, José`
   - Enter.
4. Mete la imagen de la tabla: arrastra `Crear Chat - Tabla 3C.png` desde la carpeta de Windows hasta el cuadro de la descripción. Suéltala y se inserta ahí, igual que en el ejemplo de la profesora. Trello la guarda también como adjunto.
5. Debajo de la imagen, escribe `Diagrama de Actividades: ` y pega (Ctrl+V) el enlace que copiaste en el paso 2.5.
   - Va debajo de la tabla porque dentro de una imagen el enlace no se puede pulsar. Por eso la columna Conversación dice «ver el enlace debajo de esta tabla».
6. Pulsa **Guardar**.
7. Comprueba:
   - se ve la tabla;
   - al hacer clic en el enlace se abre el diagrama;
   - la tarjeta muestra el icono de adjuntos (📎).

Así debe quedar la descripción:

> **Historia Crear Chat**
> Autor: Viana, José
> [imagen de la tabla 3C]
> Diagrama de Actividades: https://trello.com/1/cards/…/attachments/…/Crear%20Chat%20-%20Diagrama…png

## 4. Tu parte del formulario de Requisitos No Funcionales

Uno del equipo crea la tarjeta **Especificación de Requisitos No Funcionales** en **Ejecución - Sprint 1**. Para eso pulsa **+ Añade una tarjeta** al final de la lista. En la descripción va el formulario de 8 puntos de la profesora: lo que no se usa se deja en blanco, no se borra.

Tu propuesta para el punto 5 (coordínalo con el equipo, porque cada rango lo redacta uno):

```
5. Seguridad
   a. Confidencialidad: El sistema debe mostrar en los chats solo el nombre de usuario y el producto, sin el correo ni el teléfono de los miembros, y permitir que solo los dos participantes de un chat puedan verlo.
```

## 5. Tarjeta «Añadir Archivos»

Esta no se especifica, porque cada uno especifica una sola historia. Ábrela, pulsa **Editar** en la Descripción y añade al principio:

```
Autor: Viana, José
```

Después pulsa **Guardar**.
