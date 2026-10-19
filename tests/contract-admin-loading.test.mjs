import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { mergeRequirements, requirementPolicy } from "../modules/contract-dossier.js";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
function section(name, next) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  const end = source.indexOf(`function ${next}(`, start + 1);
  assert.ok(start >= 0 && end > start, name);
  return source.slice(start, end).replace(/async\s*$/, "");
}
function harness() {
  const body = { innerHTML: "" };
  const button = { addEventListener() {} };
  const context = vm.createContext({
    APP_STATE: { db: {}, dossier: { requirements: [], requirementsLoaded: false }, contract: {} },
    ADMIN_STATE: { tab: "contrato", loadRequestId: 0, hubUsers: { teacher: {} }, contract: { ready: false }, dossier: {} },
    adminPanelModal: { hidden: false, querySelectorAll: () => [] },
    DOSSIER_REQUIREMENTS_COLLECTION: "contractRequirements",
    TEACHER_CONTRACT_DOC_ID: "contratoDocenteMusicala", TEACHER_CONTRACT_ACCESS_DOC_ID: "contratoDocenteAcceso",
    TEACHER_CONTRACT_TERMS_COLLECTION: "teacherContractTerms", TEACHER_CONTRACT_DATA_COLLECTION: "teacherContractData",
    TEACHER_CONTRACT_SIGNATURES_COLLECTION: "teacherContractSignatures", TEACHER_CONTRACT_DEFAULT: { version: "default" },
    mergeRequirements, normalizeTeacherContract: (raw) => raw,
    console: { warn() {}, error() {} },
    $: (selector) => selector === "#adminBody" ? body : selector === "#contractLoadRetry" ? button : null,
    collection: (_db, name) => name, doc: (_db, name, id) => `${name}/${id}`,
    getDocsFromServer: async () => ({ docs: [] }),
    getDocFromServer: async (path) => ({ exists: () => true, data: () => path.endsWith("contratoDocenteAcceso") ? { allowedEmails: ["allowed@example.com"] } : { version: "saved" } }),
    isAdminUser: () => true, refreshAdminTeacherFilterOptions() {}, renderAdminBody() {},
    stopAdminContractLiveSync() {}, startAdminContractLiveSync() {}, loadAllDossiers: async () => {},
    fetchAdminRecords: async () => [], fetchAdminSchedules: async () => [], fetchAdminOverrides: async () => [],
    escapeHtml: (value) => String(value)
  });
  const functions = [
    ["getDossierRequirements", "loadDossierRequirements"],
    ["loadDossierRequirements", "loadDossierFor"],
    ["setAdminTab", "loadAdminData"], ["loadAdminData", "fetchAdminRecords"],
    ["loadContractAdminData", "renderContractAccessAudit"],
    ["renderAdminContrato", "renderAdminContratoTerms"]
  ];
  vm.runInContext(functions.map(([name, next]) => section(name, next)).join("\n"), context);
  return { context, body };
}

test("cambiar a Contrato inicia una lectura y no muestra casillas vacías", () => {
  const { context, body } = harness();
  let loads = 0;
  context.loadAdminData = () => { loads++; };
  context.setAdminTab("contrato");
  context.renderAdminContrato(body);
  assert.equal(loads, 1);
  assert.match(body.innerHTML, /verificando tus accesos y requisitos/);
  assert.doesNotMatch(body.innerHTML, /data-contract-allow|data-dossier-policy|Guardar quién/);
});

test("la lectura real conserva la lista adicional y las políticas guardadas", async () => {
  const { context } = harness();
  context.getDocsFromServer = async (path) => ({ docs: path === "contractRequirements" ? [
    { id: "minors_check", data: () => ({ active: false, required: false }) },
    { id: "eps", data: () => ({ active: true, required: false }) }
  ] : [] });
  await context.loadAdminData();
  assert.equal(context.ADMIN_STATE.contract.ready, true);
  assert.deepEqual(Array.from(context.ADMIN_STATE.contract.allowedEmails), ["allowed@example.com"]);
  assert.equal(requirementPolicy(context.getDossierRequirements().find((req) => req.id === "minors_check")), "no_se_pide");
  assert.equal(requirementPolicy(context.getDossierRequirements().find((req) => req.id === "eps")), "despues");
  assert.equal(context.ADMIN_STATE.contract.doc.version, "saved");
});

test("si falla Firestore no se reemplaza la configuración anterior por valores predeterminados", async () => {
  const { context, body } = harness();
  const previous = mergeRequirements([{ id: "minors_check", active: false, required: false }]);
  context.APP_STATE.dossier.requirements = previous;
  context.getDocsFromServer = async () => { throw new Error("permission-denied"); };
  context.renderAdminBody = () => context.renderAdminContrato(body);
  await context.loadAdminData();
  assert.equal(context.ADMIN_STATE.contract.ready, false);
  assert.equal(context.APP_STATE.dossier.requirementsLoaded, false);
  assert.equal(context.APP_STATE.dossier.requirements, previous);
  assert.match(body.innerHTML, /No pudimos verificar la configuración guardada/);
  assert.doesNotMatch(body.innerHTML, /data-contract-allow|data-dossier-policy/);
});

test("una carga anterior no termina ni repinta encima de la pestaña actual", async () => {
  const { context } = harness();
  let finishOld;
  let finishNew;
  let paints = 0;
  context.renderAdminBody = () => { paints++; };
  context.fetchAdminRecords = () => new Promise((resolve) => { finishOld = resolve; });
  context.loadContractAdminData = () => new Promise((resolve) => { finishNew = resolve; });
  context.ADMIN_STATE.tab = "marcaciones";
  const old = context.loadAdminData();
  context.ADMIN_STATE.tab = "contrato";
  const current = context.loadAdminData();
  finishOld([]);
  await old;
  assert.equal(context.ADMIN_STATE.loading, true);
  assert.equal(paints, 0);
  finishNew();
  await current;
  assert.equal(context.ADMIN_STATE.loading, false);
  assert.equal(paints, 1);
});

test("las respuestas de contrato descartadas no sobrescriben una lista verificada más reciente", async () => {
  const { context } = harness();
  context.ADMIN_STATE.loadRequestId = 2;
  context.ADMIN_STATE.contract.allowedEmails = ["latest@example.com"];
  await context.loadContractAdminData(1);
  assert.deepEqual(Array.from(context.ADMIN_STATE.contract.allowedEmails), ["latest@example.com"]);
});
