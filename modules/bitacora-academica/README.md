# Módulo: Bitácora Académica / Trabajo por Objetivos

Módulo interno del **HUB Docentes Musicala**. Un solo módulo reutilizable para
todas las docentes (no se crea una app por docente).

## Cómo lo abre el HUB
El HUB tiene el botón **"Bitácora Académica"** (sección *Gestión docente*). Al
tocarlo abre este módulo en un overlay con `iframe`, pasando el contexto del
usuario autenticado por la URL:

```
modules/bitacora-academica/index.html?email=<correo>&name=<nombre>&role=<docente|admin>&embedded=1
```

- `script.js` lee ese contexto (`readContextFromUrl`).
- Resuelve la configuración de la docente en `teachers.js`
  (`window.resolveAcademicTeacher`).
- El botón **"Volver al HUB"** envía `postMessage({type:'closeAcademicModule'})`
  a la ventana padre; el HUB cierra el overlay.

## Archivos
- `index.html` — UI (resumen, tareas, bolsa de horas, modales).
- `styles.css` — estilos en identidad Musicala (claro, azul/violeta).
- `script.js` — lógica (tareas, estimaciones, bolsa, horas, historial).
- `teachers.js` — **mapa de docentes → fuente de datos** (Apps Script). Aquí se
  agregan nuevas docentes sin duplicar la app.

## Agregar una docente nueva
1. En el HUB (`app.js` → `HUB.USERS`): añadir `academica: true` a su usuario.
2. En `teachers.js`: añadir su correo con `name` y, si tiene hoja propia, su
   `api.baseUrl` + `dataset`. Si no tiene hoja, funciona en **modo local**.

## Persistencia actual
- **Tareas de hoja**: solo lectura vía Google Apps Script (`config.api`).
- **Capa local** (estimaciones, objetivos, bolsas, registros de horas):
  `localStorage`, **namespaceada por correo**
  (`musicala_bitacora_horas_v2::<correo>`), así varias docentes en el mismo
  navegador no mezclan datos.

### ⚠️ Limitación
Los datos locales viven en el navegador del dispositivo. No se comparten entre
dispositivos ni los ve la coordinación de forma centralizada todavía.

## Migración a Firestore (pendiente — Fases 4–7)
El HUB ya usa Firebase/Firestore. Para centralizar, migrar la capa local a estas
colecciones (admin escribe/lee; docente solo lo suyo):

| Colección              | Reemplaza a        | Doc id sugerido            |
|------------------------|--------------------|----------------------------|
| `academicObjectives`   | `store.objectives` | auto                       |
| `academicTaskEstimates`| `store.estimates`  | `<email>__<taskId>`        |
| `academicTaskBudgets`  | `store.budgets`    | `<email>__<period>`        |
| `academicTaskHourLogs` | `store.hourLogs`   | auto                       |
| `academicTaskHistory`  | (auditoría/ajustes)| auto                       |

Campos sugeridos por documento: `teacherEmail`, `teacherName`, `period`,
`taskId`, `taskTitle`, `taskDescription`, `estimatedHours`, `recognizedHours`,
`usedHours`, `status`, `evidence`, `notes`, `createdAt`, `updatedAt`,
`createdBy`.

Pasos:
1. Crear un `firestore-academica.js` con lectura/escritura (reusar el `db` del
   HUB; el módulo necesitaría cargarse como módulo ES o recibir un puente).
2. Sustituir `readStore`/`saveStore` por funciones que sincronicen con Firestore
   y dejen `localStorage` como caché/offline.
3. Reglas en `firestore.rules`: docente escribe lo suyo (`teacherEmail ==
   token.email`), admin (coordinación) lee/escribe todo.
4. Roles: el módulo ya recibe `role`; con Firestore, el admin podrá ver y
   aprobar/ajustar horas de todas las docentes.

> Mientras tanto, el módulo **funciona** con la capa local + hoja. Migrar no es
> bloqueante para la Fase 1.
