# Trello UcabMarket · Estructura corregida (según la pizarra y tu nota del 8/10/26)

Esto corresponde a la sección 5 del **Brief** (Plan de Trabajo de la Primera Iteración).

La profesora pidió que el tablero siga las **fases del proyecto** y no estados de tarjeta (Por hacer, En progreso, Hecho). Dentro de Ejecución, el trabajo se organiza **por sprints** y cada historia de usuario (H.U.) lleva **12 tareas**.

## 1. Las listas

| Lista | Qué lleva |
|-------|-----------|
| **Inicio** | Tarjeta **Brief** (y las tarjetas de información del proyecto: reglas ISO 25010, restricciones, equipo y roles) |
| **Planificación** | **Plan (cronograma)**, más las tarjetas **Herramientas**, **Maqueta general** y **Arquitectura base** del dibujo de la pizarra |
| **Ejecución** | Las historias, repartidas por sprint: **S1, S2** (y S3, S4 solo si hicieran falta) |
| **Seguimiento** | Control del avance. **Va en paralelo con Ejecución** (la profesora lo marcó así) |
| **Cierre** | Integración final, entrega y retrospectiva |

En el dibujo de la nota, S1 tiene H1–H4 y S2 tiene H5–H8, con S3 y S4 vacíos. Es el ejemplo de la profesora: el equipo tiene **20 historias en 2 sprints**, así que sus S1 y S2 llevan 10 historias cada uno.

## 2. Cómo se ve en Trello

Trello no permite listas dentro de listas. La forma más simple de representar «Ejecución → S1, S2» es:

1. Inicio
2. Planificación
3. **Ejecución · Sprint 1** (10 historias)
4. **Ejecución · Sprint 2** (10 historias)
5. Seguimiento
6. Cierre

Seguimiento y Ejecución no son una secuencia, sino trabajo paralelo: Seguimiento recibe tarjetas mientras corren los sprints.

## 3. Las 12 tareas de cada historia (checklist)

Esto es lo que escribió la profesora en «Ejecución». Va como checklist dentro de **cada** tarjeta de historia.

| # | Etapa | Tarea |
|---|-------|-------|
| 1 | Especificación | Funcional |
| 2 | Especificación | No funcional |
| 3 | Diseño | Interfaz (HM) |
| 4 | Diseño | Estudio de datos |
| 5 | Diseño | Lógica |
| 6 | Diseño | Arquitectura |
| 7 | | Implementación |
| 8 | | Prueba |
| 9 | | Integración |
| 10 | | Probar |
| 11 | | Corregir |
| 12 | | Pruebas |
| (no cuenta) | | Despliegue |

Su comentario: «Sin desplegar son 12, es decir 12 [tareas] para cada H.U., eso debe ir en el Trello». Por eso el despliegue **no** es una de las 12 tareas. Mi propuesta: una tarjeta «Despliegue Sprint 1» y otra «Despliegue Sprint 2» al final de cada lista de sprint.

## 4. Cómo convertir el tablero que ya tienen

| Lista actual | Qué hacer |
|--------------|-----------|
| Info del proyecto | Renombrarla **Inicio**. Añadir ahí las 3 tarjetas «[Brief] …». |
| Tarjetas técnicas (Git y entorno, Maquetas) | Crear **Planificación** y repartirlas en Herramientas y Maqueta general. Añadir **Plan (cronograma)** y **Arquitectura base**. |
| Sprint 1 - Por hacer, En progreso, En revisión / pruebas, Hecho | Reemplazarlas por **Ejecución · Sprint 1** con las 10 historias del Sprint 1. |
| Backlog (Sprint 2) | Renombrarla **Ejecución · Sprint 2** con las 10 historias del Sprint 2. |
| (no existían) | Crear **Seguimiento** y **Cierre**. |

En cada una de las 20 tarjetas, la checklist de 8 tareas se reemplaza por la de 12. El texto listo para pegar de cada tarjeta está en «Trello UcabMarket - tarjetas completas.md».

## 5. Texto corregido para la sección 5 del Brief

Reemplaza el texto actual de «5. Plan de Trabajo de la Primera Iteración» por este:

> Se establece que la herramienta de planificación utilizada para el seguimiento del proyecto será Trello (enlace público: pegar aquí el enlace del tablero). El tablero se organiza según las fases del proyecto: **Inicio** (Brief), **Planificación** (Plan o cronograma, Herramientas, Maqueta general y Arquitectura base), **Ejecución** (historias de usuario organizadas por sprint: Sprint 1 y Sprint 2), **Seguimiento** (en paralelo con la ejecución) y **Cierre**. Cada historia de usuario es una tarjeta con responsable, fecha límite, criterio de aceptación y una lista de 12 tareas: especificación funcional y no funcional; diseño de interfaz, estudio de datos, lógica y arquitectura; implementación, prueba, integración, probar, corregir y pruebas finales.

## 6. Pendiente de confirmar con la profesora

- ¿Las 20 historias del equipo se reparten en 2 sprints (como dice el Brief) o quiere más sprints?
- ¿«Despliega» va como tarjeta propia por sprint o una sola vez al cierre?
- ¿Las tareas 8 a 12 («Prueba, Integra, Probar, Corrige, Pruebas») se nombran tal cual o con otros nombres?
