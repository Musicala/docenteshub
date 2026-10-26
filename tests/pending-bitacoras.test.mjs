import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const context = vm.createContext({
  normalizeText: (value) => String(value).trim().toLowerCase(),
  escapeHtml: (value) => String(value),
  slotValue: (value) => value ?? "—",
  OFFICIAL_CLASS_LOG_URL: "https://bitacoras-de-clase.web.app/#search",
  APP_STATE: { hubData: {} },
});
vm.runInContext(source.slice(source.indexOf("function pendingLogStatus("), source.indexOf("async function loadPendingBitacorasForActiveUser(")), context);
vm.runInContext(source.slice(source.indexOf("function renderPendingBannerHTML("), source.indexOf("function renderKpiRowHTML(")), context);

test("sin registros o solo inasistencias no inventa cumplimiento total", () => {
  for (const rows of [[], [{ reconciliationStatus: "inasistencia" }]]) {
    const summary = context.summarizePendingLogRows(rows);
    assert.equal(summary.compliance, null);
    context.APP_STATE.hubData.pendingBitacoras = summary;
    const html = context.renderPendingBannerHTML();
    assert.match(html, /Cumplimiento por verificar/);
    assert.doesNotMatch(html, /100%|están al día|is-complete/);
  }
});

test("calcula por docente y agrupa pendientes de una misma sesión", () => {
  const rows = [
    { profesorEmail: "ana@example.com", fecha: "2026-10-20", reconciliationStatus: "faltante" },
    { profesorEmail: "ana@example.com", fecha: "2026-10-20", reconciliationStatus: "parcial_grupal" },
    { profesorEmail: "ana@example.com", fecha: "2026-10-21", reconciliationStatus: "ok" },
    { profesorEmail: "luz@example.com", fecha: "2026-10-20", reconciliationStatus: "ok" },
  ];
  const summary = context.summarizePendingLogRows(rows.filter((row) => row.profesorEmail === "ana@example.com"));
  assert.equal(summary.count, 1);
  assert.equal(summary.compliance, 33.3);
  assert.equal(context.rankPendingTeachers(rows, "ana@example.com").rank, 2);
  context.APP_STATE.hubData.pendingBitacoras = summary;
  assert.match(context.renderPendingBannerHTML(), /33.3%/);
});

test("solo muestra al día con registros y sin faltantes; normaliza estados desconocidos", () => {
  const summary = context.summarizePendingLogRows([{ reconciliationStatus: "ok" }]);
  assert.equal(summary.compliance, 100);
  context.APP_STATE.hubData.pendingBitacoras = summary;
  assert.match(context.renderPendingBannerHTML(), /están al día/);
  assert.equal(context.summarizePendingLogRows([{ reconciliationStatus: "desconocido" }]).compliance, 0);
});
