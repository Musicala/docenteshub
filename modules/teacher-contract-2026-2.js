export const TEACHER_CONTRACT_DRAFT_VERSION = "2026.2";

const clause = (number, text) => `${number}. ${text}`;

function replaceClause(body, number, replacement) {
  const lines = String(body || "").split(/\r?\n/);
  const index = lines.findIndex((line) => line.trimStart().startsWith(`${number}. `));
  if (index >= 0) lines[index] = replacement;
  else {
    const [section, subsection] = String(number).split(".").map(Number);
    const nextClause = lines.findIndex((line) => {
      const match = line.trimStart().match(/^(\d+)\.(\d+)\.\s/);
      return match && Number(match[1]) === section && Number(match[2]) > subsection;
    });
    if (nextClause >= 0) lines.splice(nextClause, 0, replacement);
    else {
      const nextSection = lines.findIndex((line) => /^\s*## /.test(line) && Number((line.match(/^\s*##\s*(\d+)\./) || [])[1]) > section);
      if (nextSection >= 0) lines.splice(nextSection, 0, replacement);
      else lines.push(replacement);
    }
  }
  return lines.join("\n");
}

function replaceAnnexClause(annexes, annexId, heading, replacement) {
  return annexes.map((annex) => annex.id === annexId
    ? { ...annex, body: String(annex.body || "").replace(heading, replacement) }
    : annex);
}

/**
 * Prepares a review draft from the stored 2026.1 template without saving it.
 * Existing signed documents remain in their immutable signature snapshots.
 */
export function prepareTeacherContract2026_2(source) {
  if (!source || typeof source !== "object") throw new TypeError("Falta la plantilla contractual vigente.");
  const body = String(source.body || "");
  const annexes = Array.isArray(source.annexes) ? source.annexes.map((item) => ({ ...item })) : [];
  let nextBody = body;

  nextBody = replaceClause(nextBody, "1.1", clause("1.1", "Comparecen EL CONTRATANTE, identificado en esta versión institucional, y EL CONTRATISTA, identificado en el Anexo A, para acordar los servicios descritos en este documento. La denominación contractual no define por sí sola la naturaleza jurídica de la relación; esta se determina conforme a la ley y a los hechos de su ejecución. Ninguna estipulación implica renuncia a derechos ni limita el acceso a la autoridad competente."));
  nextBody = replaceClause(nextBody, "2.1", clause("2.1", "Objeto. EL CONTRATISTA presta servicios de formación artística y pedagógica en el área de {{AREAS}}, mediante sesiones propuestas por EL CONTRATANTE y aceptadas individualmente por EL CONTRATISTA, con estudiantes o grupos, en la modalidad y condiciones que queden acordadas para cada sesión."));
  nextBody = replaceClause(nextBody, "2.4", clause("2.4", "Acuerdo previo. Toda actividad adicional se ofrece en una propuesta independiente con su alcance y condiciones. Solo obliga si EL CONTRATISTA la acepta expresamente; rechazarla no constituye incumplimiento."));
  nextBody = replaceClause(nextBody, "2.2", clause("2.2", "Entregables incluidos en la tarifa aceptada: prestación de la sesión, evidencia razonable de su ejecución y registro pedagógico necesario para la continuidad institucional. El tiempo y alcance de otros informes, reuniones, muestras, ensayos, eventos o capacitaciones se acuerdan por separado cuando excedan estos entregables."));
  nextBody = replaceClause(nextBody, "2.3", clause("2.3", "Las actividades fuera del servicio aceptado no están incluidas ni son obligatorias. Su realización requiere una propuesta separada y aceptación expresa."));
  nextBody = replaceClause(nextBody, "2.5", clause("2.5", "Autonomía pedagógica. Musicala puede definir los resultados, experiencias y competencias esperados para el servicio aceptado. EL CONTRATISTA conserva autonomía para determinar metodología, ejercicios, secuencia, recursos y adaptaciones, y registra avances para asegurar continuidad institucional."));
  nextBody = replaceClause(nextBody, "3.2", clause("3.2", "No existe exclusividad. EL CONTRATISTA puede prestar servicios para otras personas naturales o jurídicas, incluso del mismo sector artístico, educativo o cultural, sin autorización de EL CONTRATANTE, respetando confidencialidad, propiedad intelectual, datos personales y compromisos que haya aceptado."));
  nextBody = replaceClause(nextBody, "3.3", clause("3.3", "Las partes pactan honorarios por los servicios efectivamente aceptados y prestados y las demás sumas expresamente convenidas. La calificación y los derechos aplicables se rigen por la ley y por la realidad de la ejecución; ninguna declaración de este documento puede excluir derechos irrenunciables."));
  nextBody = replaceClause(nextBody, "3.1", clause("3.1", "La coordinación entre las partes comprende únicamente las condiciones de los servicios propuestos y aceptados, los resultados pactados y los protocolos objetivos de seguridad. EL CONTRATISTA organiza y ejecuta su actividad profesional con autonomía, dentro del alcance aceptado y las obligaciones legales aplicables. La naturaleza de la relación se determina por la ley y los hechos de ejecución."));
  nextBody = replaceClause(nextBody, "3.1", clause("3.1", "La coordinación entre las partes comprende únicamente las condiciones de los servicios propuestos y aceptados, los resultados pactados y los protocolos objetivos de seguridad. EL CONTRATISTA organiza y ejecuta su actividad profesional con autonomía, dentro del alcance aceptado y las obligaciones legales aplicables. La naturaleza de la relación se determina por la ley y los hechos de ejecución."));
  nextBody = replaceClause(nextBody, "3.4", clause("3.4", "Las partes reconocen que la realidad de la ejecución prevalece sobre la denominación del contrato. El seguimiento se limita a verificar servicios y resultados aceptados, sin poder disciplinario, multas, control de disponibilidad general ni imposición de actividades no acordadas."));
  nextBody = replaceClause(nextBody, "3.5", clause("3.5", "EL CONTRATISTA conserva autonomía para organizar su actividad profesional, aceptar los servicios ofrecidos dentro de su disponibilidad, prestar servicios a terceros y definir la metodología, secuencia, ejercicios y recursos con que desarrolla las sesiones aceptadas, respetando los resultados pedagógicos pactados y los protocolos objetivos de seguridad, protección de menores y manejo de información."));
  nextBody = replaceClause(nextBody, "3.6", clause("3.6", "La coordinación necesaria respecto del lugar y la hora de una sesión aceptada corresponde al servicio previamente concertado. No implica disponibilidad general, jornada laboral ni facultad de EL CONTRATANTE para disponer unilateralmente del tiempo restante de EL CONTRATISTA."));
  nextBody = replaceClause(nextBody, "4.5", clause("4.5", "Plazo. Del {{FECHA_INICIO}} al {{FECHA_FIN}}. La fecha de inicio no podrá anteceder la fecha y hora real de aceptación de este contrato ni el inicio efectivo de la cobertura de riesgos laborales cuando la afiliación sea obligatoria. Una relación que ya haya comenzado requiere revisión y tratamiento administrativo independiente; este sistema no generará documentos con fecha de firma retroactiva."));
  nextBody = replaceClause(nextBody, "4.6", clause("4.6", "Programación. Cada nueva sesión se presenta como propuesta de EL CONTRATANTE con estudiante o grupo, fecha, hora, duración, modalidad, lugar y tarifa aplicable. Solo pasa a sesión acordada cuando EL CONTRATISTA la acepta expresamente. El sistema conserva quién propuso, cuándo y la decisión de cada parte."));
  nextBody = replaceClause(nextBody, "4.7", clause("4.7", "Cambios. Todo cambio material de fecha, hora, disponibilidad comprometida, duración, modalidad, lugar, número de sesiones o remuneración se propone y requiere aceptación expresa de EL CONTRATISTA. Este puede aceptarlo, rechazarlo o proponer una alternativa. Rechazar una propuesta nueva o de cambio no constituye incumplimiento; solo una sesión previamente aceptada genera el compromiso acordado."));
  nextBody = replaceClause(nextBody, "4.9", clause("4.9", "Las propuestas pueden quedar pendientes, aceptarse, rechazarse, recibir una alternativa, cancelarse por acuerdo o registrarse como ejecutadas. Rechazar una propuesta no genera falta, sanción, reducción de puntaje, alerta disciplinaria, ausencia ni incumplimiento."));
  nextBody = replaceClause(nextBody, "4.10", clause("4.10", "Los ajustes de plataforma, enlace o información de contacto que no alteren la fecha, hora, disponibilidad, modalidad, lugar, duración, sesiones o remuneración se informan por el canal oficial. Cualquier cambio de esos elementos requiere aceptación expresa."));
  nextBody = replaceClause(nextBody, "5.6", clause("5.6", "Seguridad social y riesgos laborales. EL CONTRATISTA realizará los aportes a salud y pensión que le correspondan como independiente, de acuerdo con las normas vigentes y la base legal aplicable a sus ingresos. Cuando este contrato esté sujeto a afiliación obligatoria al Sistema General de Riesgos Laborales, EL CONTRATANTE tramitará la afiliación por su intermedio antes del inicio de la ejecución y verificará que la cobertura esté activa para la primera sesión. EL CONTRATISTA informará oportunamente la ARL en que se encuentre, su clase de riesgo y toda novedad necesaria para tramitar correctamente la afiliación. La cotización de riesgos I, II y III estará a cargo de EL CONTRATISTA; la de riesgos IV y V, de EL CONTRATANTE, conforme al régimen vigente. EL CONTRATANTE podrá solicitar soportes legalmente pertinentes para verificar aportes y cobertura; esa verificación se limita al cumplimiento normativo y no constituye dirección de la actividad profesional. Cada parte asumirá las obligaciones tributarias a su cargo."));
  nextBody = replaceClause(nextBody, "5.10", clause("5.10", "Cualquier pago adicional distinto de los honorarios pactados se documenta previamente o de forma simultánea con su actividad, valor y condiciones. Ningún reconocimiento ocasional altera por sí solo los honorarios futuros, la programación aceptada o las demás condiciones contractuales."));
  nextBody = replaceClause(nextBody, "5.11", clause("5.11", "Primacía de la realidad. La ejecución efectiva prevalece sobre el nombre o las declaraciones del contrato y se rige por las normas imperativas aplicables. Las partes no renuncian a derechos indisponibles ni limitan la posibilidad de discutir la naturaleza jurídica de la relación ante la autoridad competente."));
  nextBody = replaceClause(nextBody, "6.1", clause("6.1", "Prestar las sesiones que haya aceptado, en las condiciones acordadas. El registro de inicio y cierre se limita a verificar la prestación, calcular honorarios, proteger al estudiante y conservar trazabilidad contractual. No constituye control de jornada, disponibilidad general ni permanencia por fuera de un servicio previamente aceptado."));
  nextBody = replaceClause(nextBody, "6.7", clause("6.7", "Mantener los requisitos de afiliación y seguridad social que legalmente le correspondan e informar a EL CONTRATANTE la ARL y las novedades necesarias para la afiliación obligatoria y cobertura del servicio. EL CONTRATANTE podrá verificar los soportes pertinentes conforme a la ley."));
  nextBody = replaceClause(nextBody, "6.6", clause("6.6", "Durante la prestación presencial de una sesión aceptada, cumplir los controles objetivos de acceso e identificación necesarios para la seguridad de estudiantes e instalaciones."));
  nextBody = replaceClause(nextBody, "6.10", clause("6.10", "EL CONTRATISTA puede proponer una persona reemplazante. Musicala verifica criterios objetivos de identidad, antecedentes e inhabilidades, formación e idoneidad mínima aplicables, protección de menores y seguridad social. Toda negativa se sustenta en uno de esos criterios. No se ejecuta un reemplazo sin verificar y autorizar su idoneidad por razones de seguridad."));
  nextBody = replaceClause(nextBody, "7.2", clause("7.2", "Proponer servicios con sus condiciones completas y comunicar por el aplicativo los cambios propuestos. Una propuesta no se considera aceptada por silencio, por aparecer en un calendario ni por una asignación unilateral."));
  nextBody = replaceClause(nextBody, "8.5", clause("8.5", "El registro de ejecución contractual describe hechos y entregables con su evidencia y es accesible para EL CONTRATISTA. No es una evaluación laboral ni produce sanciones disciplinarias."));
  nextBody = replaceClause(nextBody, "9.3", clause("9.3", "Si EL CONTRATISTA no puede ejecutar una sesión que aceptó, informa la novedad tan pronto como sea razonable y se aplica el procedimiento contractual de cancelación, reemplazo o reprogramación. La inasistencia a una propuesta no aceptada no es ausencia ni incumplimiento."));
  nextBody = replaceClause(nextBody, "9.4", clause("9.4", "Si el inicio de una sesión aceptada se afecta, las partes registran la circunstancia real y su contexto para verificar la ejecución y los honorarios aplicables. No se generan multas ni descuentos automáticos."));
  nextBody = replaceClause(nextBody, "9.6", clause("9.6", "Ante la inasistencia del estudiante, EL CONTRATISTA registra la evidencia del intento de prestar el servicio y se aplica la regla económica del Anexo B. No se exige disponibilidad adicional ni permanencia por fuera de la duración previamente aceptada."));
  nextBody = replaceClause(nextBody, "9.5", clause("9.5", "EL CONTRATISTA puede proponer un reemplazo conforme a la cláusula 6.10. La verificación se limita a criterios objetivos de idoneidad y protección de menores, y cualquier rechazo se motiva por escrito."));
  nextBody = replaceClause(nextBody, "11.3", clause("11.3", "Los datos personales, en especial los de niños, niñas y adolescentes, se tratan únicamente para ejecutar el objeto, conforme a la autorización, finalidad y política de tratamiento aplicables. Se utilizan las herramientas oficiales y no se crean copias o archivos personales salvo captura estrictamente necesaria y autorizada para cargarla de inmediato en el sistema institucional; luego se elimina la copia local de forma segura."));
  nextBody = replaceClause(nextBody, "11.4", clause("11.4", "Las imágenes de estudiantes no se publican ni comparten desde medios personales. La captura procede solo si es necesaria, tiene autorización previa y finalidad definida; se carga al sistema institucional y se elimina del dispositivo local después de confirmar la carga. Se conserva la evidencia de autorización conforme a la política de datos."));
  nextBody = replaceClause(nextBody, "11.5", clause("11.5", "No captación. Se prohíbe usar bases de datos o información confidencial de EL CONTRATANTE para abordar activamente a estudiantes o familias y desviar el servicio originado exclusivamente por Musicala. Esta obligación no impide a EL CONTRATISTA prestar servicios a terceros, incluso del mismo sector, promocionarse públicamente ni atender clientes que lleguen por medios independientes. La restricción posterior al contrato se limita a la captación activa y directa de esas relaciones durante {{PLAZO_NO_CAPTACION}}, sin prohibir el ejercicio profesional ni la competencia."));
  nextBody = replaceClause(nextBody, "11.6", clause("11.6", "Canales oficiales. Se utilizan para comunicaciones contractuales y operativas. EL CONTRATISTA no debe permanecer conectado, disponible ni responder inmediatamente fuera de sesiones y compromisos aceptados. Las comunicaciones ordinarias se atienden en un plazo razonable según su naturaleza. Las situaciones de seguridad de un estudiante siguen el protocolo especial. El horario de atención de EL CONTRATANTE no constituye jornada ni disponibilidad de EL CONTRATISTA."));
  nextBody = replaceClause(nextBody, "12.2", clause("12.2", "Los materiales preexistentes conservan la titularidad de su respectivo titular. Respecto de materiales nuevos creados específicamente como entregable pagado, EL CONTRATISTA otorga a EL CONTRATANTE una licencia no exclusiva para reproducir, comunicar, adaptar y distribuir esos materiales en cualquier soporte, en Colombia y en el exterior, durante el término de protección legal, únicamente para fines educativos, institucionales y de difusión de Musicala. Se reconocerá la autoría cuando sea razonablemente posible y se respetarán los derechos morales, que son inalienables. Ideas, métodos o aportes verbales no constituyen por sí solos una cesión."));
  nextBody = replaceClause(nextBody, "13.1", clause("13.1", "Incumplimientos contractuales subsanables: incumplimientos de entregables o compromisos aceptados que admitan corrección sin afectar gravemente el objeto. Se tramitan con evidencia, comunicación y oportunidad razonable de aclaración o subsanación conforme a la cláusula 8.4. Este procedimiento no es disciplinario."));
  nextBody = replaceClause(nextBody, "14.3", clause("14.3", "Las partes procurarán resolver directamente cualquier diferencia derivada de la ejecución, interpretación o terminación del contrato. Podrán acudir a mecanismos de conciliación legalmente autorizados. Si no existe acuerdo, cualquiera de ellas podrá acudir ante la jurisdicción y autoridad que resulte competente conforme a la naturaleza de la controversia y las normas vigentes, sin que este contrato implique renuncia, modificación o prórroga de competencias legalmente inderogables."));
  nextBody = replaceClause(nextBody, "15.3", clause("15.3", "Manual de Lineamientos. Esta versión identifica el documento operativo informado: versión {{MANUAL_VERSION}}, fecha {{MANUAL_FECHA}}, cambios {{MANUAL_CAMBIOS}}. La notificación y la constancia de acceso se conservan en la evidencia de aceptación. Las actualizaciones unilaterales solo podrán desarrollar procedimientos administrativos, tecnológicos, de seguridad, protección de menores, tratamiento de datos o coordinación que no modifiquen elementos esenciales. El Manual no podrá cambiar honorarios, disponibilidad, sesiones, objeto, modalidad, lugar, metodología, actividades adicionales, carga, régimen económico, tiempos adicionales ni causales de terminación. Cualquier cambio sustancial requiere otrosí aceptado por ambas partes. La notificación o consulta del Manual no implica aceptación automática."));
  nextBody = replaceClause(nextBody, "15.5", clause("15.5", "Firma electrónica. La aceptación identifica a la persona autenticada, la versión, el texto íntegro y sus anexos, junto con una huella SHA-256, fecha y hora real registradas por el servidor y las manifestaciones aceptadas. Una vez registrada, la evidencia no se modifica. Las modificaciones posteriores se documentan en un otrosí o nueva versión enlazada con la anterior, sin alterar documentos ya firmados."));

  let nextAnnexes = annexes;
  nextAnnexes = replaceAnnexClause(nextAnnexes, "B", "Lo origina EL CONTRATANTE. Aviso: {{AVISO_CAMBIO}}. Evidencia: evento en el aplicativo. Sin efecto económico si se acepta.", "Cada nueva sesión o cambio se propone por EL CONTRATANTE y requiere aceptación expresa de EL CONTRATISTA. Rechazar una propuesta no genera falta ni incumplimiento. Evidencia: actor, fecha y hora, condiciones del servicio y decisión.");
  nextAnnexes = replaceAnnexClause(nextAnnexes, "B", "En sede y virtual, EL CONTRATISTA permanece disponible durante la franja.", "EL CONTRATISTA registra el intento dentro de la duración aceptada; no se exige disponibilidad adicional ni permanencia fuera de ese servicio.");
  nextAnnexes = replaceAnnexClause(nextAnnexes, "B", "Nunca reducción automática a la mitad.", "La liquidación se limita al servicio y al tiempo efectivamente prestados, según el acuerdo previo.");
  nextAnnexes = replaceAnnexClause(nextAnnexes, "C", "Registro de inicio y cierre de sesión: cada sesión, al iniciar y al cerrar, en el aplicativo.", "Evidencia de inicio y cierre: asociada exclusivamente a cada sesión aceptada; sirve para verificar el servicio, calcular honorarios, proteger al estudiante y conservar trazabilidad, no para controlar jornada o disponibilidad general.");
  nextAnnexes = replaceAnnexClause(nextAnnexes, "C", "Continuidad del proceso, cumplimiento de los registros, calidad pedagógica observada y retroalimentación de familias y coordinación. Se valoran con varias fuentes. Ningún indicador aislado produce por sí solo la terminación del contrato.", "Resultados pedagógicos pactados, calidad del servicio, seguridad, entregables y retroalimentación. EL CONTRATISTA conserva autonomía para elegir metodología, secuencia, ejercicios y recursos. Los indicadores se valoran con varias fuentes y ninguno produce por sí solo la terminación.");
  nextAnnexes = nextAnnexes.map((annex) => {
    if (annex.id === "F") return { ...annex, body: String(annex.body || "")
      .replace("Se tratan únicamente para ejecutar el objeto del contrato y solo en las herramientas oficiales. No se copian a dispositivos, cuentas o servicios personales, ni se comparten con terceros ajenos a Musicala.", "Se tratan únicamente para ejecutar el objeto y en herramientas oficiales. Una captura local solo se permite si es necesaria y autorizada, se carga inmediatamente al sistema institucional y se elimina localmente tras confirmar la carga.")
      .replace("EL CONTRATISTA elimina la información de Musicala que conserve por fuera de las herramientas oficiales.", "EL CONTRATISTA elimina de forma segura cualquier copia local temporal una vez confirmada su carga institucional.")
      .replace("Ventanas de respuesta razonable: {{VENTANA_RESPUESTA}}.", "Las comunicaciones ordinarias se atienden en plazo razonable, sin horario ni disponibilidad general.") };
    if (annex.id === "G") return { ...annex, body: String(annex.body || "")
      .replace("Materiales creados durante la ejecución: {{REGLA_PI}}.", "Materiales nuevos creados específicamente como entregable pagado se licencian de forma no exclusiva, para fines educativos, institucionales y de difusión de Musicala, en cualquier soporte, en Colombia y en el exterior, durante el término legal de protección. Se reconoce la autoría cuando sea razonablemente posible y se respetan los derechos morales. Ideas o aportes verbales no son cesión.") };
    return annex;
  });
  nextAnnexes = nextAnnexes.map((annex) => ({ ...annex, body: String(annex.body || "").replace(/por tratarse de una causa no atribuible a EL CONTRATISTA(?:, por tratarse de una causa no atribuible a EL CONTRATISTA)?/g, "por tratarse de una causa no atribuible a EL CONTRATISTA") }));

  return {
    ...source,
    version: TEACHER_CONTRACT_DRAFT_VERSION,
    title: source.title || "Contrato de prestación de servicios independientes de formación artística y pedagógica",
    intro: "Este documento contiene las condiciones de los servicios artísticos y pedagógicos acordados entre EL CONTRATANTE y EL CONTRATISTA. Revisa el contrato y sus anexos completos antes de aceptar. La naturaleza jurídica de la relación se determina conforme a la ley y a los hechos de ejecución.",
    body: nextBody,
    annexes: nextAnnexes,
    defaults: {
      ...(source.defaults || {}),
      REGLA_PI: "Materiales preexistentes del contratista siguen siendo suyos. Los materiales nuevos específicamente creados como entregable pagado se licencian de forma no exclusiva, para fines educativos, institucionales y de difusión de Musicala, en cualquier soporte, en Colombia y en el exterior, durante el término legal de protección; se reconoce la autoría cuando sea razonablemente posible y se respetan los derechos morales. Las ideas o aportes verbales no son una cesión.",
      MANUAL_VERSION: source.defaults?.MANUAL_VERSION || "{{PENDIENTE_DEFINIR}}",
      MANUAL_FECHA: source.defaults?.MANUAL_FECHA || "{{PENDIENTE_DEFINIR}}",
      MANUAL_CAMBIOS: source.defaults?.MANUAL_CAMBIOS || "{{PENDIENTE_DEFINIR}}"
    },
    draftOnly: true
  };
}

function addOneCalendarMonth(isoDate) {
  const [year, month, day] = String(isoDate || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  const targetMonth = date.getUTCMonth() + 1;
  date.setUTCDate(1);
  date.setUTCMonth(targetMonth);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export function teacherContractNeedsArl({ startDate, endDate, riskClass } = {}) {
  const risk = Number(riskClass);
  if (Number.isFinite(risk) && risk >= 4) return true;
  const oneMonthLater = addOneCalendarMonth(startDate);
  return Boolean(startDate && endDate && oneMonthLater && endDate > oneMonthLater);
}

export function validateTeacherContractFormalization({ terms = {}, representativeDocument = "", today = "", signatureDate = today } = {}) {
  const errors = [];
  const start = String(terms.fechaInicio || "").trim();
  const end = String(terms.fechaFin || "").trim();
  if (!start) errors.push("Falta la fecha de inicio.");
  if (!end) errors.push("Falta la fecha de finalización.");
  if (start && end && end < start) errors.push("La fecha de finalización no puede ser anterior al inicio.");
  if (start && signatureDate && start < signatureDate) errors.push("La fecha de inicio no puede ser anterior a la fecha real de firma.");
  if (start && today && start < today) errors.push("La relación ya habría iniciado. Requiere tratamiento administrativo independiente; no generes un contrato retroactivo.");
  const arlRequired = teacherContractNeedsArl({ startDate: start, endDate: end, riskClass: terms.arlRiskClass });
  if (arlRequired && !String(terms.arlName || terms.arlNombre || "").trim()) errors.push("Registra la ARL informada por el contratista.");
  if (arlRequired && !String(terms.arlAffiliationDate || "").trim()) errors.push("Registra la fecha de afiliación o novedad ARL.");
  if (arlRequired && !String(terms.arlCoverageStartDate || "").trim()) errors.push("Confirma la fecha de inicio de cobertura ARL.");
  if (arlRequired && start && terms.arlCoverageStartDate && String(terms.arlCoverageStartDate) > start) errors.push("La cobertura ARL no estará activa para el primer día de ejecución.");
  if (arlRequired && start && terms.arlAffiliationDate && String(terms.arlAffiliationDate) >= start) errors.push("La afiliación ARL debe tramitarse con anticipación suficiente para que la cobertura inicie antes de la ejecución.");
  if (arlRequired && terms.arlAffiliationDate && terms.arlCoverageStartDate) {
    const expectedCoverage = new Date(`${terms.arlAffiliationDate}T00:00:00Z`);
    if (!Number.isNaN(expectedCoverage.getTime())) {
      expectedCoverage.setUTCDate(expectedCoverage.getUTCDate() + 1);
      if (expectedCoverage.toISOString().slice(0, 10) !== String(terms.arlCoverageStartDate)) {
        errors.push("Verifica la fecha de cobertura ARL: debe coincidir con el día siguiente a la afiliación o novedad registrada.");
      }
    }
  }

  const repDoc = String(representativeDocument || "").replace(/\D/g, "");
  const contractorDoc = String(terms.contratistaDocumento || "").replace(/\D/g, "");
  const sameIdentity = Boolean(repDoc && contractorDoc && repDoc === contractorDoc);
  if (sameIdentity && (!terms.identityExceptionConfirmed || !String(terms.identityExceptionReason || "").trim())) {
    errors.push("EL CONTRATANTE y EL CONTRATISTA tienen el mismo documento. Verifica la configuración y registra la confirmación administrativa reforzada y su motivo antes de continuar.");
  }

  // La cuenta de pago debe ser de EL CONTRATISTA, sin excepción: así lo dice
  // la cláusula 5.4 del contrato. No hay confirmación administrativa que lo
  // habilite, porque pagar a un tercero desdibuja quién prestó el servicio.
  const accountHolderDocument = String(terms.accountHolderDocument || "").replace(/\D/g, "");
  if (accountHolderDocument && contractorDoc && accountHolderDocument !== contractorDoc) {
    errors.push("La cuenta de pago está a nombre de otra persona. Debe ser una cuenta de EL CONTRATISTA: corrígela antes de continuar.");
  }
  return { valid: errors.length === 0, errors, arlRequired, sameIdentity };
}
