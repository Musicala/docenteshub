// Versioned changes only. Historical snapshots and hashes keep their old format.
export const CONTRACT_V4 = "2026.4";
export const COVERAGE_PENDING = "Pendiente de verificación";
export const SESSION_SCOPE = "Planeación ordinaria, ejecución de la sesión aceptada, registro de asistencia y bitácora e informe periódico expresamente pactado en el Anexo C. Muestras, reuniones, ensayos, capacitaciones y demás actividades fuera de ese alcance requieren propuesta, remuneración y aceptación expresa separadas.";
export const V4_DEFAULTS = {
  NIT_DV: "{{PENDIENTE_DEFINIR}}", REPRESENTANTE_CALIDAD: "{{PENDIENTE_DEFINIR}}", REPRESENTANTE_EMAIL: "{{PENDIENTE_DEFINIR}}",
  CANCELACION_OPORTUNA: "{{PENDIENTE_DEFINIR}}", REPROGRAMACION_CANCELACION: "{{PENDIENTE_DEFINIR}}"
};

function replaceClause(body, id, text) {
  const pattern = new RegExp(`^${id.replaceAll(".", "\\.")}\\. .*$`, "m");
  if (!pattern.test(body)) throw new Error(`Falta la cláusula ${id}; revisa la plantilla de origen.`);
  return body.replace(pattern, `${id}. ${text}`);
}

export function prepareTeacherContract2026_4(source) {
  if (!["2026.3", CONTRACT_V4].includes(source?.version)) throw new Error("Prepara 2026.4 desde la plantilla 2026.3 revisada.");
  if (source.annexes?.map(a => a.id).join("") !== "BCDEFG") throw new Error("Se requieren los anexos B–G completos; A se genera por persona.");
  const changes = {
    "1.1": "Comparecen {{RAZON_SOCIAL}}, NIT {{NIT}}-{{NIT_DV}}, representada por {{REPRESENTANTE_LEGAL}}, identificado(a) con {{REPRESENTANTE_DOCUMENTO}}, en calidad de {{REPRESENTANTE_CALIDAD}}, como EL CONTRATANTE, y {{CONTRATISTA_NOMBRE}}, identificado(a) con {{CONTRATISTA_TIPO_DOCUMENTO}} {{CONTRATISTA_DOCUMENTO}}, como EL CONTRATISTA. La naturaleza jurídica se determina por la ley y la realidad de la ejecución; ninguna estipulación excluye derechos irrenunciables ni encubre subordinación.",
    "1.3": "EL CONTRATISTA declara que la información y los documentos efectivamente entregados son veraces y se obliga a informar sus cambios. Los datos pendientes se identifican expresamente; esta declaración no acredita por sí sola afiliación, cotización, cobertura ni verificaciones administrativas pendientes.",
    "1.4": "La consulta de antecedentes e inhabilidades exigida para trabajar con menores requiere autorización previa y expresa y verificación vigente de Musicala antes de la prestación. La firma no sustituye ni presume realizada esa verificación; su evidencia se conserva en el expediente.",
    "2.2": `Entregables incluidos en la tarifa aceptada: ${SESSION_SCOPE}`,
    "5.4": "Pago. Dentro de los {{PLAZO_PAGO}} siguientes a la presentación conforme del soporte, mediante transferencia a la cuenta de titularidad de EL CONTRATISTA identificada en el Anexo A. No se realizan pagos a cuentas de terceros.",
    "5.6": "Seguridad social y riesgos laborales. Cada parte cumplirá las obligaciones legales que le correspondan según las condiciones reales de vinculación, ingresos y mecanismos aplicables. Cuando corresponda, EL CONTRATANTE gestionará la afiliación del vínculo de Musicala al Sistema General de Riesgos Laborales ante la ARL legalmente aplicable, respetando la elección de EL CONTRATISTA y las reglas sobre vínculos simultáneos y contratación de corta duración. Ordinariamente, la cotización en riesgos I, II y III corresponde al contratista y en IV y V al contratante. En actividades artísticas y culturales por periodos inferiores a un mes se aplicarán las reglas especiales vigentes, incluida la selección, afiliación y totalidad del pago por el contratante cuando corresponda. No basta una planilla, una declaración ni la firma para acreditar la afiliación de este vínculo. Musicala verificará la cobertura efectiva antes de iniciar o continuar actividades que la requieran y gestionará las novedades correspondientes. Una afiliación posterior no genera cobertura retroactiva. Las obligaciones de aportes a salud, pensión y riesgos se determinarán conforme a la legislación vigente y la situación real, incluidos ingresos de otras fuentes y mecanismos especiales aplicables; no se exige indiscriminadamente una planilla ordinaria completa ni se presume exención por recibir de Musicala menos de un salario mínimo. El tipo de cotizante, base y periodicidad requieren verificación individual. Se aplicarán el Decreto 1072 de 2015, las disposiciones pertinentes de la Ley 2466 de 2025, del Decreto 658 de 2026 y de la Resolución 1529 de 2026, y las normas que los modifiquen o sustituyan. Las confirmaciones posteriores se registran en el expediente administrativo sin alterar este contrato aceptado.",
    "6.7": "Entregar información veraz y actualizada sobre su afiliación a seguridad social; informar la ARL que corresponda según sus vínculos vigentes y las novedades relevantes para la cobertura; aportar los soportes que legalmente le sean exigibles en su situación individual y en los periodos aplicables. Informar únicamente las condiciones necesarias para verificar el régimen de aportes, respetando privacidad y minimización de datos. No se exige la misma planilla mensual a toda persona ni se transfieren al contratista obligaciones legales de Musicala.",
    "10.4": "Ante un riesgo grave para un menor se adoptan de inmediato medidas preventivas de protección y se activa la ruta del Anexo D, sin esperar el registro documental. La terminación inmediata procede por los hechos graves de la cláusula 13.3 y con la comunicación de la cláusula 13.4. Los demás incumplimientos subsanables se tramitan conforme a 8.4 y 13.1, sin reducir las protecciones de los anexos D y E.",
    "11.1": "La información de estudiantes, familias y de EL CONTRATANTE a la que se acceda por el contrato es confidencial y solo puede usarse para ejecutar el objeto. La confidencialidad contractual subsiste {{DURACION_CONFIDENCIALIDAD}} después de terminado el contrato; ese plazo no limita los deberes legales de protección de datos, reserva, seguridad ni reporte que sigan siendo exigibles.",
    "13.2": "Vencimiento y terminación anticipada. El contrato termina naturalmente al cumplirse la fecha final del Anexo A, sin exigir el preaviso previsto para la terminación anticipada. Antes de ese vencimiento, cualquiera de las partes puede terminarlo sin necesidad de causa y sin indemnización contractual, mediante aviso escrito con {{PREAVISO}} de anticipación, sin perjuicio de derechos imperativos y de los honorarios y sumas causados.",
    "15.2": "Integridad y acuerdos anteriores. Este documento y sus anexos recogen las condiciones aceptadas en la fecha real de aceptación. En concordancia con 4.5, no prueban que nuevas estipulaciones rigieran desde el inicio efectivo anterior de los servicios, ni extinguen derechos u obligaciones ya causados. La modificación de condiciones requiere acuerdo expreso; se conserva el vínculo con los documentos anteriores.",
    "15.5": "Aceptación electrónica. El registro identifica la cuenta autenticada y la manifestación expresa de cada parte, la versión y anexos aceptados, la fecha y hora del servidor, el identificador y las huellas SHA-256 del texto estructurado y del paquete de aceptación. Una imagen de firma no sustituye esas evidencias. El PDF es una representación de ese registro; su huella no se presenta como hash del propio archivo PDF. La evidencia aceptada permanece inmutable. Los otrosíes o nuevas versiones requieren aceptación y vínculo con el registro previo; las novedades administrativas posteriores no alteran el documento original."
  };
  let body = source.body;
  for (const [id, text] of Object.entries(changes)) body = replaceClause(body, id, text);
  body = body.replace("La notificación y la constancia de acceso se conservan en la evidencia de aceptación.", "La puesta a disposición y la lectura del documento operativo se acreditan separadamente en el expediente; la referencia en este contrato no presume una lectura que no conste.");
  const annexes = source.annexes.map(a => ({ ...a }));
  const b = annexes.find(a => a.id === "B");
  b.body = b.body.replace("## Cancelación atribuible a EL CONTRATANTE o a la familia\nAviso: {{AVISO_CANCELA}}. Efecto: {{PAGO_CANCELACION}}, sin condicionarlo a ninguna actividad sustituta.", "## Cancelación oportuna atribuible a EL CONTRATANTE o a la familia\nAviso con al menos {{AVISO_CANCELA}} de anticipación. Efecto económico acordado: {{CANCELACION_OPORTUNA}}.\n## Cancelación tardía atribuible a EL CONTRATANTE o a la familia\nAviso inferior a {{AVISO_CANCELA}}. Efecto: {{PAGO_CANCELACION}}, sin actividad sustituta obligatoria.\n## Reprogramación\n{{REPROGRAMACION_CANCELACION}}. Requiere acuerdo expreso; no se presume por el aviso de cancelación.");
  b.body = b.body.replace(", por tratarse de una causa no atribuible a EL CONTRATISTA.", ".");
  if (!b.body.includes("{{CANCELACION_OPORTUNA}}")) throw new Error("La matriz de cancelaciones cambió; requiere revisión antes de preparar el borrador.");
  if (!b.body.includes("## Fuerza mayor")) b.body += "\n## Fuerza mayor\nSe aplica la cláusula 9.8; no se presume toda cancelación como fuerza mayor. Se documentan el hecho, su efecto y el acuerdo aplicable, sin sanciones automáticas ni reprogramación impuesta.";
  const c = annexes.find(a => a.id === "C");
  c.body = c.body.replace("Acompañamiento a muestras: según la programación acordada.", "Muestras y actividades adicionales: solo mediante propuesta con remuneración y aceptación separadas.")
    .replace("Todos estos entregables están comprendidos en el valor por sesión, conforme a la cláusula 2.2.", SESSION_SCOPE)
    .replace("Reporte de incidente: cuando ocurra, de forma inmediata.", "Incidentes: proteger y avisar de inmediato ante riesgo urgente; registrar lo ocurrido tan pronto sea seguro, el mismo día. El registro no retrasa la atención.");
  const d = annexes.find(a => a.id === "D");
  d.body = d.body.replace("2. Reportar el mismo día al responsable contractual.", "2. Avisar de inmediato al responsable contractual ante riesgo urgente; completar el registro documental el mismo día, tan pronto sea seguro.");
  return { ...source, version: CONTRACT_V4, body, annexes, defaults: { ...V4_DEFAULTS, ...source.defaults }, draftOnly: true };
}

export function fullContractDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return COVERAGE_PENDING;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return COVERAGE_PENDING;
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

// Only an explicit administrative verification with supporting reference confirms coverage.
export function coverageAtAcceptance(terms = {}) {
  const confirmed = terms.arlVerificationStatus === "Confirmada" && Boolean(terms.arlSupportReference?.trim())
    && Boolean(terms.arlNombre?.trim()) && /^[1-5]$/.test(terms.arlRiskClass || "")
    && [terms.arlAffiliationDate, terms.arlCoverageStartDate].every(d => fullContractDate(d) !== COVERAGE_PENDING)
    && terms.arlCoverageStartDate >= terms.arlAffiliationDate;
  return {
    declaredArl: terms.arlNombre?.trim() || COVERAGE_PENDING,
    status: confirmed ? "Confirmada por Musicala con soporte; ver vigencia en el expediente" : COVERAGE_PENDING,
    risk: confirmed ? terms.arlRiskClass : COVERAGE_PENDING,
    affiliation: confirmed ? fullContractDate(terms.arlAffiliationDate) : COVERAGE_PENDING,
    start: confirmed ? fullContractDate(terms.arlCoverageStartDate) : COVERAGE_PENDING,
    reference: confirmed ? terms.arlSupportReference : COVERAGE_PENDING,
    confirmed
  };
}

export function canonicalContractDocument(document) {
  return JSON.stringify({ schema: "musicala.contract-document.v1", version: document.version,
    title: document.title, intro: document.intro,
    sections: document.sections.map(s => ({ id: s.id, version: s.version || document.version, title: s.title, body: s.body, declaration: s.declaration || "" })) });
}

export function canonicalAcceptancePackage(document, evidence) {
  return JSON.stringify({ schema: "musicala.contract-acceptance.v1", document: JSON.parse(canonicalContractDocument(document)),
    contractId: evidence.contractId, parentContractId: evidence.parentContractId || null,
    actor: { uid: evidence.uid, email: evidence.email, fullName: evidence.fullName, documentId: evidence.documentId },
    offerId: evidence.offerId, offerHash: evidence.offerHash,
    acceptedStatements: evidence.acceptedStatements.map(s => ({ statementId: s.statementId, exactText: s.exactText })),
    mechanism: "Firebase Auth + lectura y casillas expresas + confirmar aceptación" });
}

export function validateContractV4(contract, terms = {}) {
  const errors = [];
  if (!/^\d[\d.]*$/.test(contract.defaults?.NIT || "") || !/^\d$/.test(contract.defaults?.NIT_DV || "")) errors.push("Completa NIT y dígito de verificación con el soporte institucional.");
  for (const key of ["REPRESENTANTE_CALIDAD", "REPRESENTANTE_EMAIL", "CANCELACION_OPORTUNA", "REPROGRAMACION_CANCELACION"]) {
    if (!contract.defaults?.[key] || contract.defaults[key].includes("PENDIENTE")) errors.push(`Falta revisar y definir ${key}.`);
  }
  for (const key of ["fechaInicio", "fechaFin"]) if (fullContractDate(terms[key]) === COVERAGE_PENDING) errors.push(`Fecha inválida: ${key}.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contract.defaults?.REPRESENTANTE_EMAIL || "")) errors.push("Completa el correo de la cuenta del representante autorizado.");
  if (terms.arlVerificationStatus === "Confirmada" && !coverageAtAcceptance(terms).confirmed) errors.push("Para confirmar ARL registra entidad, clase de riesgo, fechas válidas y referencia del soporte.");
  return errors;
}
