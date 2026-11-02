# HU Crear Chat — UcabMarket (Equipo 87)

Autor: Viana, Jose

| Historia de Usuario | Conversación | Criterios de Aceptación |
|---|---|---|
| **Como** miembro de la comunidad UCAB, **quiero** crear un chat con el vendedor de un producto, **para** coordinar la compra por mensajes. | **Épica:** Gestionar chats.<br><br>**Escenario de uso:** El miembro ve el detalle de un producto del catálogo y presiona «Contactar vendedor». El sistema le pide confirmar y, al presionar «Crear chat», crea la conversación privada con el vendedor y se la muestra. Ahí el miembro escribe su mensaje y lo envía, y puede seguir escribiendo. Si el chat no se pudo crear, el sistema avisa y vuelve a preguntar; si el miembro presiona «Salir», se cancela el proceso y regresa a Consultar producto.<br><br>**Reglas de negocio:**<br>1. Solo pueden crear chats los miembros UCAB con sesión iniciada.<br>2. El chat no muestra datos personales de ninguno de los dos (correo, teléfono).<br>3. Solo los dos miembros del chat pueden escribir en él; nadie más puede modificar ni eliminar sus mensajes.<br><br>**Alcance:** Incluye crear el chat desde el detalle del producto, mostrarlo y enviar un mensaje en él. No incluye adjuntar archivos (HU Añadir Archivos).<br><br>**Dependencias:** Crear Cuenta (para tener sesión iniciada); Añadir producto (debe existir un producto publicado); Consultar producto (desde ahí se llega al botón).<br><br>**Otras restricciones:** Solo en español y en web de escritorio. Requisito no funcional (ISO/IEC 25010): **Seguridad → Integridad** (regla 3 y CA6).<br><br>**Diagrama de actividades:** [enlace al diagrama] | **CA1 — Chat creado:** Dado que inicié sesión y estoy viendo un producto de otro miembro, cuando presiono «Contactar vendedor» y luego «Crear chat», entonces el sistema muestra «Chat creado» y, al presionar OK, me muestra el chat nuevo con el vendedor.<br><br>**CA2 — Salir:** Dado que el sistema me pide confirmar la creación, me avisa «Chat creado» o me muestra el chat, cuando presiono «Salir» en lugar de «Crear chat», OK o «Enviar», entonces se cancela el proceso y regreso a Consultar producto.<br><br>**CA3 — Sin datos personales:** Dado que se creó el chat, cuando lo veo, entonces se muestran solo los nombres de usuario y el producto, sin el correo ni el teléfono del vendedor ni los míos.<br><br>**CA4 — Enviar mensaje:** Dado que el chat está creado y lo estoy viendo, cuando escribo un mensaje y presiono «Enviar», entonces el sistema muestra mi mensaje actualizado en el chat y puedo seguir escribiendo.<br><br>**CA5 — No se pudo crear:** Dado que presioné «Crear chat», cuando el sistema no puede crear el chat, entonces muestra «No se pudo crear el chat, inténtalo de nuevo» y, al confirmar la lectura, me vuelve a preguntar si deseo crear el chat.<br><br>**CA6 — Chat protegido:** Dado que existe un chat entre dos miembros, cuando otro miembro que no pertenece al chat intenta escribir, modificar o eliminar mensajes en él, entonces el sistema no se lo permite. |

## Especificación textual (planilla de la profe y numeración de su ejercicio de clase: 1.-, «Flujo alterno al paso N», N.1)

**Caso de uso:** Crear chat
**Actor:** Miembro de la comunidad UCAB

| | |
|---|---|
| **Descripción:** El sistema debe permitir que un miembro de la comunidad UCAB cree un chat con el vendedor de un producto y le envíe mensajes. | |
| **Precondición:** El miembro inició sesión y está en el detalle de un producto publicado por otro miembro. | |
| **FLUJO BÁSICO** | |
| **ACTOR** | **SISTEMA** |
| 1.- Este CU se inicia por un extend de Consultar producto: presiona «Contactar vendedor». | 2.- Muestra la interfaz «¿Deseas crear un chat con el vendedor?». |
| 3.- Presiona «Crear chat». | 4.- Crea el chat. |
| | 5.- Muestra el mensaje «Chat creado». |
| 6.- Presiona OK. | 7.- Muestra el chat sin datos personales (correo, teléfono). |
| 8.- Escribe el mensaje. | |
| 9.- Presiona «Enviar». | 10.- Muestra el mensaje actualizado y regresa al paso 7. |
| **FLUJOS ALTERNOS** | |
| *Flujo alterno al paso 4* | |
| | 4.1) No se pudo crear el chat. |
| | 4.2) Muestra la interfaz «No se pudo crear el chat, inténtalo de nuevo». |
| 4.3) Confirma la lectura del mensaje. | 4.4) Regresa al paso 2. |
| *Flujo alterno al paso 11 (salir, desde los pasos 3, 6 y 9)* | |
| 11.1) Presiona el botón «Salir» (en vez de «Crear chat», OK o «Enviar»). | 11.2) Cancela el proceso. |
| | 11.3) Regresa al CU Consultar producto. |
| **Poscondición(es):** Si el caso termina en el paso 10, el chat queda creado entre el miembro y el vendedor, se muestra sin datos personales y los mensajes enviados aparecen en el chat. Si el miembro sale en el paso 3, no se crea el chat. | |
| **Requerimiento(s) especial(es):** Solo los dos miembros del chat pueden escribir en él y nadie más puede modificar ni eliminar sus mensajes (ISO/IEC 25010: Seguridad → Integridad). El chat no muestra el correo ni el teléfono de ninguno de los dos. Solo en español y en web de escritorio. | |
| **Punto(s) de extensión:** Ninguno. Este CU es un extendido de Consultar producto. | |

## Diagrama de actividades (para pasarlo a draw.io / Lucidchart)

Sigue el estilo del diagrama del grupo 87.2 (Inscripción) y se ajusta al Brief v1.6.

> Cambio del 29/10: se quitó el flujo de «perfil dado de baja» (verificación, rombo y alterno 2.1–2.4), porque el Brief v1.6 no lo menciona en Crear chat. Se renumeraron los pasos.
>
> Ajuste del 30/10 (dibujo de la pizarra y versión a mano de José): después de «7. Muestra el chat», el actor escribe y presiona «Enviar» o «Salir». Con «Enviar», el sistema muestra el mensaje actualizado (nodo objeto «Mensaje») y el conector ② regresa a la barra que está antes de «7. Muestra el chat», para seguir escribiendo. Con «Salir», va a la barra de salir, igual que los «no» de los pasos 3 y 6.

- **Calles ACTOR | SISTEMA**; cada paso va en la calle de quien lo hace, con su número.
- **Inicio:** nodo inicial con la nota «CU extendido de Consultar producto».
- **Nodos objeto** (rectángulos unidos con flecha punteada a la acción que los usa): «datos del producto» → paso 4; «Mensaje» → paso 10.
- **Acciones «Presiona» sin el nombre del botón** (corrección del 31/10): las cajas dicen solo «3. Presiona», «6. Presiona» y «9. Presiona»; el botón que se presionó va como guarda en la salida del rombo.
- **Rombos vacíos.** Son 4: el del paso 4 en la calle SISTEMA y los que siguen a «3. Presiona», a «6. Presiona» y a «9. Presiona», en la calle ACTOR:
  - después de «3. Presiona»: **Crear chat** → «4. Crea el chat», no (presionó «Salir») → barra de salir;
  - después de «4. Crea el chat»: no → alterno 4, sí → «5. Muestra mensaje «Chat creado»»;
  - después de «6. Presiona»: **OK** → barra antes de «7. Muestra el chat», **no** (presionó «Salir») → barra de salir;
  - después de «9. Presiona»: **Enviar** → «10. Muestra mensaje actualizado» → conector ②; **Salir** → barra de salir.
- **Alterno 4:** empieza con la caja de condición «4.1 No se creó», sigue con «4.2 Muestra interfaz «No se pudo crear»» y el actor «4.3 Confirma lectura», que termina en el conector ①.
- **Barras de unión:** la de arriba (antes de «2. Muestra interfaz») recibe el paso 1 y el ①; la del medio (antes de «7. Muestra el chat») recibe el OK y el ②; la de salir (en ACTOR) junta los tres «salir» → «11.2 Cancela el proceso» (sistema) → final con la nota «Regresa a Consultar». No lleva una caja «Presiona «Salir»», porque el actor ya presionó «Salir» en el rombo (sería redundante); el paso 11.1 de la especificación es esa salida del rombo.
- **Conectores:** ① = regresa al paso 2; ② = regresa al paso 7.
- **Cuenta para comprobarlo:** 1 inicio, 4 rombos (1 en Sistema y 3 en Actor), 3 barras, 2 conectores, 2 nodos objeto y 1 final.
