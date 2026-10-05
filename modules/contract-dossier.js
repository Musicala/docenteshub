/* ============================================================================
   EXPEDIENTE DIGITAL DE CONTRATACIÓN · LÓGICA PURA
   ----------------------------------------------------------------------------
   Catálogo de requisitos documentales y todo el cálculo de estados, progreso
   y alertas. Sin Firebase y sin DOM a propósito: así se puede probar con node
   y la misma regla sirve para la vista de la docente y para la del panel.

   El catálogo vive aquí como punto de partida y se puede sobrescribir desde
   Firestore (colección contractRequirements) sin volver a publicar la app,
   igual que hace la plantilla del contrato.
============================================================================ */

export const DOSSIER_CATEGORIES = [
  { id: "identity", label: "Identificación y datos generales", icon: "🪪" },
  { id: "social_security", label: "Seguridad social y SST", icon: "🩺" },
  { id: "minors", label: "Trabajo con menores", icon: "🛡️" },
  { id: "contracting", label: "Contratación", icon: "✍️" },
  { id: "execution", label: "Durante la ejecución", icon: "🔁" }
];

// Momento del proceso al que pertenece cada requisito. Solo los de preContract
// deciden si una persona queda lista para contratar.
export const DOSSIER_STAGES = ["preContract", "contract", "postContract", "recurring"];

export const DOSSIER_STATUSES = [
  "pendiente", "cargado", "en_revision", "aprobado",
  "requiere_correccion", "vencido", "proximo_vencer", "no_aplica"
];

export const DOSSIER_STATUS_META = {
  pendiente: { label: "Pendiente", tone: "danger", icon: "🔴" },
  cargado: { label: "Cargado", tone: "info", icon: "🔵" },
  en_revision: { label: "En revisión", tone: "warn", icon: "🟡" },
  aprobado: { label: "Aprobado", tone: "ok", icon: "✅" },
  requiere_correccion: { label: "Requiere corrección", tone: "danger", icon: "✏️" },
  vencido: { label: "Vencido", tone: "danger", icon: "🔴" },
  proximo_vencer: { label: "Próximo a vencer", tone: "warn", icon: "🟡" },
  no_aplica: { label: "No aplica", tone: "muted", icon: "➖" }
};

export const DOSSIER_EXPIRY_WARNING_DAYS = 30;
export const DOSSIER_MAX_FILE_MB = 10;
export const DOSSIER_ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

/* ---------------------------------------------------------------------------
   Catálogo por defecto.
   responsibleParty: teacher | admin | both | system
   allowTeacherUpload decide si a la docente le aparece el botón de cargar. La
   consulta de inhabilidades la hace Musicala, así que ahí va en false aunque
   el requisito sí sea parte de su expediente.
--------------------------------------------------------------------------- */
export const CONTRACT_REQUIREMENTS_DEFAULT = [
  {
    id: "identity_document", name: "Documento de identidad", category: "identity", stage: "preContract",
    description: "Cédula de ciudadanía o documento equivalente, por ambas caras y legible.",
    why: "Nos permite verificar tu identidad y redactar correctamente tu contrato.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 10, active: true
  },
  {
    id: "rut", name: "RUT actualizado", category: "identity", stage: "preContract",
    description: "Registro Único Tributario expedido por la DIAN, con fecha reciente.",
    why: "Define cómo debemos facturarte y qué retenciones aplican a tus honorarios.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 20, active: true
  },
  {
    id: "cv", name: "Hoja de vida", category: "identity", stage: "preContract",
    description: "Hoja de vida con tu formación y experiencia artística y pedagógica.",
    why: "Respalda tu idoneidad para el área que vas a acompañar.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 30, active: true
  },
  {
    id: "bank_certification", name: "Certificación bancaria", category: "identity", stage: "preContract",
    description: "Certificación del banco con tu nombre, tipo y número de cuenta.",
    why: "Es la única forma de consignarte. La cuenta debe estar a tu nombre.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 6, sortOrder: 40, active: true
  },
  {
    id: "eps", name: "Afiliación a EPS", category: "social_security", stage: "preContract",
    description: "Certificado de afiliación vigente a tu EPS.",
    why: "La ley exige que estés afiliada al sistema de salud para prestar el servicio.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 12, sortOrder: 50, active: true
  },
  {
    id: "pension", name: "Afiliación a fondo de pensiones", category: "social_security", stage: "preContract",
    description: "Certificado de afiliación a tu fondo de pensiones.",
    why: "Como independiente debes cotizar a pensión; necesitamos el soporte.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 12, sortOrder: 60, active: true
  },
  {
    id: "occupational_exam", name: "Examen médico ocupacional", category: "social_security", stage: "preContract",
    description: "Certificado de aptitud ocupacional expedido por un médico laboral.",
    why: "Certifica que puedes desempeñar la actividad con seguridad.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 36, sortOrder: 70, active: true
  },
  {
    id: "arl", name: "Afiliación ARL del contrato", category: "social_security", stage: "contract",
    description: "Soporte de afiliación a riesgos laborales asociada a este contrato.",
    why: "Cuando el contrato exige afiliación obligatoria, Musicala la tramita por tu intermedio antes de la primera sesión.",
    required: true, responsibleParty: "admin", allowTeacherUpload: false, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 12, sortOrder: 80, active: true
  },
  {
    id: "minors_authorization", name: "Autorización de consulta de inhabilidades", category: "minors", stage: "preContract",
    description: "Autorización firmada por ti para consultar el Registro de Inhabilidades por Delitos Sexuales contra menores.",
    why: "La ley exige tu autorización expresa y escrita antes de que Musicala pueda hacer la consulta.",
    required: true, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 90, active: true
  },
  {
    id: "minors_check", name: "Consulta de inhabilidades", category: "minors", stage: "preContract",
    description: "Soporte administrativo del resultado de la consulta en el registro.",
    why: "Esta consulta la hace Musicala, no tú. Aquí queda el soporte de que se realizó.",
    required: true, responsibleParty: "admin", allowTeacherUpload: false, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 12, sortOrder: 100, active: true
  },
  {
    id: "service_contract", name: "Contrato de prestación de servicios", category: "contracting", stage: "contract",
    description: "Contrato individual firmado electrónicamente en el HUB.",
    why: "Es el documento que formaliza tu vinculación. Se genera y se firma aquí mismo.",
    required: true, responsibleParty: "system", allowTeacherUpload: false, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 110, active: true
  },
  {
    id: "confidentiality", name: "Acuerdo de confidencialidad", category: "contracting", stage: "contract",
    description: "Acuerdo independiente de confidencialidad, cuando el proceso lo requiera.",
    why: "Solo aplica en algunos procesos. Si no aplica, administración lo marca así.",
    required: false, responsibleParty: "both", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 120, active: true
  },
  {
    id: "contract_annexes", name: "Otros anexos del contrato", category: "contracting", stage: "contract",
    description: "Otrosíes, anexos o soportes adicionales del contrato.",
    why: "Aquí queda cualquier documento que modifique o complemente tu contrato.",
    required: false, responsibleParty: "admin", allowTeacherUpload: false, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 0, sortOrder: 130, active: true
  },
  {
    id: "pila", name: "Planilla PILA del mes", category: "execution", stage: "recurring",
    description: "Planilla de aportes a seguridad social del periodo cobrado.",
    why: "Acompaña tu cuenta de cobro y acredita que estás al día con tus aportes.",
    required: false, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: true, renewalMonths: 1, sortOrder: 140, active: true
  },
  {
    id: "invoice", name: "Cuenta de cobro o factura", category: "execution", stage: "recurring",
    description: "Documento de cobro del periodo, según tu situación tributaria.",
    why: "Es el soporte con el que se tramita tu pago cada mes.",
    required: false, responsibleParty: "teacher", allowTeacherUpload: true, allowAdminUpload: true,
    hasExpiration: false, renewalMonths: 1, sortOrder: 150, active: true
  }
];

/* ---- Normalización ---- */
export function normalizeRequirement(raw = {}) {
  const id = String(raw.id || "").trim();
  if (!id) return null;
  const stage = DOSSIER_STAGES.includes(raw.stage) ? raw.stage : "preContract";
  return {
    id,
    name: String(raw.name || id).trim(),
    description: String(raw.description || ""),
    why: String(raw.why || ""),
    category: String(raw.category || "identity"),
    stage,
    required: raw.required !== false,
    responsibleParty: ["teacher", "admin", "both", "system"].includes(raw.responsibleParty) ? raw.responsibleParty : "teacher",
    allowTeacherUpload: raw.allowTeacherUpload === true,
    allowAdminUpload: raw.allowAdminUpload !== false,
    hasExpiration: raw.hasExpiration === true,
    renewalMonths: Number(raw.renewalMonths) || 0,
    acceptedFileTypes: Array.isArray(raw.acceptedFileTypes) && raw.acceptedFileTypes.length ? raw.acceptedFileTypes : DOSSIER_ACCEPTED_TYPES,
    maxFileMb: Number(raw.maxFileMb) || DOSSIER_MAX_FILE_MB,
    sortOrder: Number(raw.sortOrder) || 999,
    active: raw.active !== false
  };
}

// El catálogo guardado solo reemplaza al del código requisito por requisito:
// así se puede ajustar uno sin perder los demás ni romper expedientes viejos.
export function mergeRequirements(saved = []) {
  const map = new Map();
  CONTRACT_REQUIREMENTS_DEFAULT.forEach((item) => {
    const clean = normalizeRequirement(item);
    if (clean) map.set(clean.id, clean);
  });
  (Array.isArray(saved) ? saved : []).forEach((item) => {
    const clean = normalizeRequirement(item);
    if (clean) map.set(clean.id, clean);
  });
  return [...map.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "es"));
}

/* ---- Fechas ---- */
export function daysUntil(dateStr, today) {
  if (!dateStr || !today) return null;
  const a = Date.parse(`${dateStr}T00:00:00Z`);
  const b = Date.parse(`${today}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / 86400000);
}

export function addMonths(dateStr, months) {
  const [y, m, d] = String(dateStr || "").split("-").map(Number);
  if (!y || !m || !d || !months) return "";
  const date = new Date(Date.UTC(y, m - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + months);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(d, last));
  return date.toISOString().slice(0, 10);
}

/* ---- Estado efectivo de un requisito ----
   El vencimiento se calcula, no se guarda: así no hace falta un proceso que
   corra todas las noches para marcar documentos vencidos. */
export function effectiveStatus(requirement, state = {}, today = "") {
  if (state.applies === false) return "no_aplica";
  const stored = DOSSIER_STATUSES.includes(state.status) ? state.status : "pendiente";
  if (stored !== "aprobado") return stored;
  if (!requirement?.hasExpiration || !state.expirationDate) return "aprobado";
  const left = daysUntil(state.expirationDate, today);
  if (left === null) return "aprobado";
  if (left < 0) return "vencido";
  if (left <= DOSSIER_EXPIRY_WARNING_DAYS) return "proximo_vencer";
  return "aprobado";
}

export function isSatisfied(status) {
  return status === "aprobado" || status === "proximo_vencer" || status === "no_aplica";
}

/* ---- Progreso ----
   Cuenta solo requisitos activos, obligatorios y aplicables a la persona. Un
   requisito marcado "no aplica" sale del denominador en vez de contar como
   cumplido, para que el porcentaje no mienta. */
export function dossierProgress(requirements, states = {}, today = "", { stages = null } = {}) {
  const pendientes = [];
  let total = 0;
  let listos = 0;

  requirements.forEach((req) => {
    if (!req.active || !req.required) return;
    if (stages && !stages.includes(req.stage)) return;
    const state = states[req.id] || {};
    const status = effectiveStatus(req, state, today);
    if (status === "no_aplica") return;
    total++;
    if (status === "aprobado" || status === "proximo_vencer") listos++;
    else pendientes.push({ id: req.id, name: req.name, status });
  });

  return {
    total,
    listos,
    pendientes,
    percent: total ? Math.round((listos / total) * 100) : 100
  };
}

export function readyToContract(requirements, states = {}, today = "") {
  const { total, listos } = dossierProgress(requirements, states, today, { stages: ["preContract"] });
  return total > 0 && listos === total;
}

/* ---- Alertas de vigencia ---- */
export function expiryAlerts(requirements, states = {}, today = "") {
  const alerts = [];
  requirements.forEach((req) => {
    const state = states[req.id] || {};
    const status = effectiveStatus(req, state, today);
    if (status === "vencido" || status === "proximo_vencer") {
      alerts.push({ id: req.id, name: req.name, status, expirationDate: state.expirationDate || "", days: daysUntil(state.expirationDate, today) });
    }
  });
  return alerts.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
}

/* ---- Resumen para el panel administrativo ---- */
export function dossierSummary(requirements, states = {}, today = "", { hasSignedContract = false } = {}) {
  const progress = dossierProgress(requirements, states, today);
  const pre = dossierProgress(requirements, states, today, { stages: ["preContract"] });
  const alerts = expiryAlerts(requirements, states, today);

  let porRevisar = 0;
  let correcciones = 0;
  let cargadosAlguno = false;
  requirements.forEach((req) => {
    if (!req.active) return;
    const status = effectiveStatus(req, states[req.id] || {}, today);
    if (status === "en_revision" || status === "cargado") { porRevisar++; cargadosAlguno = true; }
    if (status === "requiere_correccion") correcciones++;
    if (status === "aprobado" || status === "proximo_vencer") cargadosAlguno = true;
  });

  const vencidos = alerts.filter((item) => item.status === "vencido").length;
  let estado;
  if (correcciones) estado = "requiere_correccion";
  else if (vencidos) estado = "requiere_actualizacion";
  else if (hasSignedContract) estado = "contrato_vigente";
  else if (pre.total > 0 && pre.listos === pre.total) estado = "listo_para_contratar";
  else if (porRevisar) estado = "en_revision";
  else if (!cargadosAlguno) estado = "sin_iniciar";
  else estado = "documentacion_pendiente";

  return {
    estado,
    progress,
    preContract: pre,
    porRevisar,
    correcciones,
    alerts,
    vencidos,
    readyToContract: pre.total > 0 && pre.listos === pre.total
  };
}

export const DOSSIER_SUMMARY_META = {
  sin_iniciar: { label: "Sin iniciar", tone: "muted" },
  documentacion_pendiente: { label: "Documentación pendiente", tone: "warn" },
  en_revision: { label: "En revisión", tone: "info" },
  requiere_correccion: { label: "Requiere corrección", tone: "danger" },
  requiere_actualizacion: { label: "Requiere actualización", tone: "danger" },
  listo_para_contratar: { label: "Listo para contratación", tone: "ok" },
  contrato_vigente: { label: "Contrato vigente", tone: "ok" }
};

/* ---- Validación de archivos ---- */
export function validateDossierFile(file, requirement) {
  if (!file) return "Selecciona un archivo.";
  const maxMb = requirement?.maxFileMb || DOSSIER_MAX_FILE_MB;
  const types = requirement?.acceptedFileTypes || DOSSIER_ACCEPTED_TYPES;
  if (!file.size) return "El archivo está vacío. Revisa que se haya guardado bien antes de subirlo.";
  if (file.size > maxMb * 1024 * 1024) return `El archivo pesa más de ${maxMb} MB. Comprímelo o toma la foto con menos resolución.`;
  const type = String(file.type || "").toLowerCase();
  if (!types.includes(type)) return "Solo aceptamos PDF, JPG o PNG.";
  return "";
}

export function safeDossierFileName(name) {
  return String(name || "documento")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-80) || "documento";
}

/* ---- Mensaje contextual para la docente ----
   El tono importa: la docente no debería sentir que está frente a un trámite
   jurídico, sino que la estamos acompañando. */
export function teacherMessage(requirement, status) {
  if (status === "no_aplica") return "Este requisito no aplica en tu caso.";
  if (!requirement.allowTeacherUpload) {
    if (status === "aprobado" || status === "proximo_vencer") return "Listo. Musicala ya registró este documento.";
    return "Este documento lo gestiona Musicala. No tienes que hacer nada.";
  }
  switch (status) {
    case "pendiente": return "Necesitamos que cargues este documento.";
    case "cargado": return "Documento recibido. Nuestro equipo lo revisará.";
    case "en_revision": return "Lo estamos revisando. Te avisamos apenas haya respuesta.";
    case "aprobado": return "Aprobado. No tienes que hacer nada más.";
    case "proximo_vencer": return "Está por vencerse. Cuando puedas, carga una versión actualizada.";
    case "vencido": return "Se venció. Necesitamos una versión actualizada.";
    case "requiere_correccion": return "Necesitamos una nueva versión. Abajo te explicamos por qué.";
    default: return "";
  }
}
