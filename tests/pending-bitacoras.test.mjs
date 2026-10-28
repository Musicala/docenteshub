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
const loaderSource = source.slice(source.indexOf("let pendingBitacorasRequest ="), source.indexOf("async function connectPendingBitacorasData("));
function loaderContext({ admin = false, read } = {}) {
  const updates = [];
  const state = {
    activeUser: { email: "ana@example.com" },
    studentsAuth: { currentUser: { email: "ana@example.com" }, authStateReady: async () => {} },
    studentsDb: {}, hubData: {},
  };
  const ctx = vm.createContext({
    APP_STATE: state, emailKey: (user) => user?.email || "", ensureStudentsServices() {},
    setHubData: (_, value) => { state.hubData.pendingBitacoras = value; updates.push(value); },
    setTimeout, clearTimeout, console: { warn() {}, info() {} },
    collection: (_, name) => name, where: (...args) => args, query: (...args) => args,
    getDocsFromServer: read || (async () => ({ docs: [{ id: "1", data: () => ({ reconciliationStatus: "faltante" }) }] })),
    summarizePendingLogRows: (rows) => ({ expected: rows.length, count: rows.length }),
    rankPendingTeachers: () => ({ rank: 1, totalTeachers: 1 }), isAdminUser: () => admin,
    PENDING_CLASS_LOGS_COLLECTION: "expected_class_logs", PENDING_CLASS_LOGS_URL: "https://example.com/pending",
  });
  vm.runInContext(loaderSource, ctx);
  return { ctx, state, updates };
}

test("el docente consulta solo lo propio y muestra indicadores sin consultar el ranking", async () => {
  const queries = [];
  const { ctx, updates } = loaderContext({ read: async (q) => {
    queries.push(q);
    return { docs: [{ id: "1", data: () => ({ reconciliationStatus: "faltante" }) }] };
  } });
  await ctx.loadPendingBitacorasForActiveUser();
  assert.equal(queries.length, 1);
  assert.equal(queries[0][1][0], "profesorEmail");
  assert.equal(queries[0][1][2], "ana@example.com");
  assert.equal(updates.at(-1).count, 1);
});

test("publica indicadores antes de esperar el ranking y conserva datos si este falla", async () => {
  let calls = 0, rejectRanking;
  const { ctx, updates } = loaderContext({ admin: true, read: async () => {
    if (++calls === 1) return { docs: [{ id: "1", data: () => ({}) }] };
    return new Promise((_, reject) => { rejectRanking = reject; });
  } });
  const task = ctx.loadPendingBitacorasForActiveUser();
  while (!rejectRanking) await new Promise((resolve) => setImmediate(resolve));
  assert.equal(updates.at(-1).count, 1);
  rejectRanking(new Error("permission-denied"));
  await task;
  assert.equal(updates.at(-1).error, undefined);
});

test("una respuesta de otra cuenta no reemplaza sus indicadores", async () => {
  let resolveRead;
  const { ctx, state, updates } = loaderContext({ read: () => new Promise((resolve) => { resolveRead = resolve; }) });
  const task = ctx.loadPendingBitacorasForActiveUser();
  while (!resolveRead) await new Promise((resolve) => setImmediate(resolve));
  state.activeUser = { email: "otra@example.com" };
  resolveRead({ docs: [] });
  await task;
  assert.equal(updates.length, 1);
  assert.equal(updates[0], null);
});

test("una consulta que no responde termina con un error acotado", async () => {
  const { ctx } = loaderContext();
  await assert.rejects(ctx.pendingDataWithTimeout(new Promise(() => {}), 5), { code: "pending/timeout" });
});

test("el banner abre las opciones en todos los estados, incluso sin conexión", () => {
  for (const state of [null, { authRequired: true }, { error: true }, { expected: 0 }, { expected: 1, count: 1 }]) {
    context.APP_STATE.hubData.pendingBitacoras = state;
    const html = context.renderPendingBannerHTML();
    assert.match(html, /<button[^>]*data-open-pending-bitacoras/);
    assert.doesNotMatch(html, /data-connect-pending|data-retry-pending/);
  }
});
