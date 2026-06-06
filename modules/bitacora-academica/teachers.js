/* ============================================================================
   Bitácora Académica · Configuración de docentes (módulo reutilizable)
   ----------------------------------------------------------------------------
   Un SOLO módulo para todas las docentes. Aquí mapeamos cada correo a su
   fuente de datos (Google Apps Script) y su nombre. NO se crea una app por
   docente: el HUB abre este módulo y le pasa ?email=... y el módulo resuelve
   aquí su configuración.

   - Si un docente tiene `api`, el módulo carga sus tareas desde la hoja
     (Apps Script). Si no tiene `api`, el módulo funciona en modo LOCAL
     (objetivos, bolsa de horas e historial en este navegador), igual de útil.
   - `moduleEnabled` controla si el módulo aparece habilitado para esa docente.

   Para agregar una docente nueva: copia un bloque, cambia correo, nombre y,
   si tiene hoja propia, su `api.baseUrl` y `dataset`. Nada más.
============================================================================ */
window.ACADEMIC_TEACHERS = {
  "emilybg0102@gmail.com": {
    name: "Emily Bejarano",
    role: "Docente",
    moduleEnabled: true,
    defaultView: "resumen",
    api: {
      baseUrl: "https://script.google.com/macros/s/AKfycbxCldPRtTtmmwyUe9CqWLgWhmlwkDrYUfsMfHMvWx-gLbxmhDQIRg-ohPGGJcnGp6I/exec",
      paramName: "consulta"
    },
    dataset: "tareas"
  }

  // Ejemplo de docente sin hoja propia (funciona en modo local):
  // ,"otrocorreo@ejemplo.com": {
  //   name: "Otra Docente",
  //   role: "Docente",
  //   moduleEnabled: true,
  //   defaultView: "resumen"
  // }
};

/* Resuelve la configuración para un correo. Si no está en el mapa, devuelve
   una config mínima en modo local con el nombre recibido (para no bloquear). */
window.resolveAcademicTeacher = function resolveAcademicTeacher(email, fallbackName) {
  const key = String(email || "").toLowerCase().trim();
  const found = window.ACADEMIC_TEACHERS[key];
  if (found) return { email: key, ...found };
  return {
    email: key,
    name: fallbackName || key || "Docente",
    role: "Docente",
    moduleEnabled: true,
    defaultView: "resumen",
    api: null,
    dataset: null
  };
};
