import test from "node:test";
import assert from "node:assert/strict";
import { prepareTeacherContract2026_2, prepareTeacherContract2026_3, teacherContractNeedsArl, validateTeacherContractFormalization } from "../modules/teacher-contract-2026-2.js";

const v2026_1 = {
  version: "2026.1",
  title: "Contrato de prueba",
  body: [
    "## 3. Naturaleza", "3.4. Texto anterior.",
    "## 4. Programación", "4.5. Plazo anterior.", "4.6. Programación anterior.", "4.7. Cambios anteriores.",
    "## 5. Pagos", "5.6. Seguridad social anterior.",
    "## 6. Obligaciones", "6.1. Registro anterior.", "6.7. Aportes anteriores.",
    "## 7. Contratante", "7.2. Programación anterior.",
    "## 8. Seguimiento", "8.5. Desempeño.",
    "## 9. Novedades", "9.3. Ausencia.", "9.4. Tardanza.", "9.6. Disponibilidad.",
    "## 11. Datos", "11.3. Datos.", "11.4. Imágenes.", "11.5. No captación.", "11.6. Comunicación.",
    "## 12. Propiedad intelectual", "12.2. Licencia.",
    "## 13. Terminación", "13.1. Incumplimiento.",
    "## 14. Disputas", "14.3. Jurisdicción civil.",
    "## 15. Varios", "15.3. Manual.", "15.5. Firma."
  ].join("\n"),
  annexes: [
    { id: "B", title: "Anexo B", body: "Lo origina EL CONTRATANTE. Aviso: {{AVISO_CAMBIO}}. Evidencia: evento en el aplicativo. Sin efecto económico si se acepta.\nEL CONTRATISTA permanece disponible durante la franja.\nNunca reducción automática a la mitad.\npor tratarse de una causa no atribuible a EL CONTRATISTA, por tratarse de una causa no atribuible a EL CONTRATISTA" },
    { id: "C", title: "Anexo C", body: "Registro de inicio y cierre de sesión: cada sesión, al iniciar y al cerrar, en el aplicativo.\nContinuidad del proceso, cumplimiento de los registros, calidad pedagógica observada y retroalimentación de familias y coordinación. Se valoran con varias fuentes. Ningún indicador aislado produce por sí solo la terminación del contrato." }
  ]
};

test("2026.3 conserva la firma real y permite ARL pendiente sin afirmar cobertura", () => {
  const previous = prepareTeacherContract2026_2(v2026_1);
  const draft = prepareTeacherContract2026_3(previous);
  assert.equal(draft.version, "2026.3");
  assert.match(draft.body, /firma se registra en su fecha real/);
  assert.match(draft.body, /no acredita afiliación, pago ni cobertura/);
  assert.match(draft.body, /IV y V de EL CONTRATANTE/);
  assert.match(previous.body, /fecha y hora real de aceptación/);
  const result = validateTeacherContractFormalization({ today: "2026-11-09", signatureDate: "2026-11-09", allowPriorStartAndPendingArl: true, terms: { fechaInicio: "2026-09-01", fechaFin: "2026-12-31", contratistaDocumento: "123" } });
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some((item) => item.includes("cobertura ARL pendiente")));
  assert.ok(result.warnings.some((item) => item.includes("anterior")));
});

test("prepara una nueva versión 2026.2 sin modificar la plantilla 2026.1", () => {
  const draft = prepareTeacherContract2026_2(v2026_1);
  assert.equal(draft.version, "2026.2");
  assert.match(draft.body, /3\.5\. EL CONTRATISTA conserva autonomía/);
  assert.match(draft.body, /fecha y hora real de aceptación/);
  assert.match(draft.body, /EL CONTRATANTE tramitará la afiliación/);
  assert.match(draft.body, /jurisdicción y autoridad que resulte competente/);
  assert.doesNotMatch(draft.body, /jurisdicción ordinaria civil/);
  assert.equal(v2026_1.version, "2026.1");
  assert.match(v2026_1.body, /14\.3\. Jurisdicción civil\./);
});

test("la preparación de la versión 2026.2 es repetible sin duplicar cláusulas", () => {
  const once = prepareTeacherContract2026_2(v2026_1);
  const twice = prepareTeacherContract2026_2(once);
  assert.equal(twice.body.split("3.5. EL CONTRATISTA conserva autonomía").length - 1, 1);
  assert.equal(twice.annexes.find((item) => item.id === "B").body.split("La liquidación se limita al servicio y al tiempo efectivamente prestados, según el acuerdo previo.").length - 1, 1);
});

test("ARL es obligatoria por contrato superior a un mes o riesgo IV/V", () => {
  assert.equal(teacherContractNeedsArl({ startDate: "2026-01-01", endDate: "2026-02-01", riskClass: "2" }), false);
  assert.equal(teacherContractNeedsArl({ startDate: "2026-01-01", endDate: "2026-02-02", riskClass: "2" }), true);
  assert.equal(teacherContractNeedsArl({ startDate: "2026-01-01", endDate: "2026-01-15", riskClass: "4" }), true);
});

test("rechaza una fecha de cobertura ARL incoherente con la afiliación", () => {
  const result = validateTeacherContractFormalization({ today: "2026-10-04", signatureDate: "2026-10-04", terms: { fechaInicio: "2026-10-10", fechaFin: "2026-12-01", arlRiskClass: "2", arlName: "ARL X", arlAffiliationDate: "2026-10-04", arlCoverageStartDate: "2026-10-06", contratistaDocumento: "456" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.includes("día siguiente")));
});
test("bloquea inicio retroactivo y cobertura ARL posterior al primer servicio", () => {
  const result = validateTeacherContractFormalization({
    today: "2026-10-04", signatureDate: "2026-10-04", representativeDocument: "123",
    terms: { fechaInicio: "2026-10-03", fechaFin: "2026-12-01", arlRiskClass: "2", arlName: "ARL X", arlAffiliationDate: "2026-10-04", arlCoverageStartDate: "2026-10-05", contratistaDocumento: "456" }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.includes("retroactivo")));
  assert.ok(result.errors.some((item) => item.includes("fecha real de firma")));
  assert.ok(result.errors.some((item) => item.includes("no estará activa")));
});

test("bloquea si el documento del contratista es el del representante legal", () => {
  const base = { fechaInicio: "2026-10-10", fechaFin: "2026-11-10", arlRiskClass: "1", contratistaDocumento: "123", accountHolderDocument: "123" };
  const blocked = validateTeacherContractFormalization({ today: "2026-10-04", representativeDocument: "123", terms: base });
  assert.equal(blocked.valid, false);
  assert.ok(blocked.errors.some((item) => item.includes("representante legal")));
  const other = validateTeacherContractFormalization({ today: "2026-10-04", representativeDocument: "999", terms: base });
  assert.equal(other.valid, true);
});

test("la cuenta de pago debe ser del contratista, sin excepción posible", () => {
  const base = { fechaInicio: "2026-10-10", fechaFin: "2026-11-10", arlRiskClass: "1", contratistaDocumento: "123", accountHolderDocument: "999" };
  const ajena = validateTeacherContractFormalization({ today: "2026-10-04", representativeDocument: "456", terms: base });
  assert.equal(ajena.valid, false);
  assert.ok(ajena.errors.some((item) => item.includes("a nombre de otra persona")));

  // Ya no existe confirmación administrativa que habilite una cuenta ajena.
  const conExcepcionVieja = validateTeacherContractFormalization({
    today: "2026-10-04", representativeDocument: "456",
    terms: { ...base, accountExceptionConfirmed: "Sí", accountExceptionReason: "Soporte legal revisado" }
  });
  assert.equal(conExcepcionVieja.valid, false);

  const propia = validateTeacherContractFormalization({ today: "2026-10-04", representativeDocument: "456", terms: { ...base, accountHolderDocument: "123" } });
  assert.equal(propia.valid, true);
});
