# Módulo: Bitácora Académica / Trabajo por Objetivos

Módulo interno del **HUB Docentes Musicala**. Un solo módulo reutilizable para
todas las docentes (no se crea una app por docente). **Toda la información se
guarda en Firebase/Firestore** (ya no usa Google Sheets ni localStorage).

## Cómo lo abre el HUB
El HUB tiene el botón **"Bitácora Académica"** (sección *Gestión docente*),
visible para cualquier usuario con acceso al HUB. Lo abre en un overlay con
`iframe`, pasando el contexto por la URL:

```
modules/bitacora-academica/index.html?email=<correo>&name=<nombre>&role=<docente|admin>&embedded=1
```

Como el `iframe` es del **mismo origen** que el HUB, el módulo **reutiliza la
sesión de Firebase Auth** ya iniciada (no pide volver a iniciar sesión).

- `script.js` es un **módulo ES** que inicializa Firebase y espera el usuario
  autenticado (`onAuthStateChanged`).
- El botón **"Volver al HUB"** envía `postMessage({type:'closeAcademicModule'})`
  a la ventana padre; el HUB cierra el overlay.

## Persistencia (Firestore)
| Colección              | Contenido                          |
|------------------------|------------------------------------|
| `academicObjectives`   | tareas / objetivos (incluye estimación, categoría, estado) |
| `academicTaskBudgets`  | bolsas de horas por periodo/responsable |
| `academicTaskHourLogs` | registros de horas (avances)       |

Cada documento lleva `teacherEmail` y `teacherName`. **Las reglas de Firestore**
(`firestore.rules`) garantizan que cada docente solo lee/escribe lo suyo
(`teacherEmail == token.email`) y que la coordinación (admin) ve y gestiona todo.

> ⚠️ **Las reglas se despliegan aparte** del sitio (Firebase Console → Firestore
> → Rules → Publicar). Sin ese paso, las lecturas/escrituras fallan.

## Roles
- **Docente** (`role=docente`): ve y gestiona solo su información. Los filtros de
  responsable quedan fijados a su nombre.
- **Coordinación** (`role=admin`): ve a todas las docentes y puede filtrar.

## Archivos
- `index.html` — UI (resumen, tareas, bolsa de horas, modales).
- `styles.css` — estilos en identidad Musicala (claro, azul/violeta).
- `script.js` — módulo ES: Firebase + lógica de datos y render.

## Pendiente / mejoras futuras
- **Admin asigna a una docente concreta**: hoy el admin escribe con su propio
  `teacherEmail`. Para crear bolsas/tareas *a nombre de* otra docente, agregar
  un selector de docente y permitir en reglas que el admin fije `teacherEmail`.
- **Reportes centralizados** (Fase 7): acumulados por docente, % ejecución,
  historial de ajustes — se pueden construir leyendo estas colecciones.
- **Sincronización en vivo**: hoy carga al abrir y tras cada cambio; se puede
  pasar a `onSnapshot` para tiempo real.
