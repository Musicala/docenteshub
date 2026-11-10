import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function renderAdminContratoEditor(");
const end = source.indexOf("/* ============================================================================", start);

function setup({ failWrite = false, failRead = false } = {}) {
  const make = (value = "") => ({ value, disabled: false, dataset: {}, textContent: "", hidden: false, addEventListener(type, fn) { this[type] = fn; } });
  const fields = { contractVersion: make("2026.1"), contractTitle: make("Título"), contractIntro: make("Intro"), contractBody: make("Contenido"), contractAnnexes: make('[{"id":"a","title":"A","body":"Texto"}]'), contractEditFeedback: make(), contractEditSave: make(), contractEditCancel: make(), contractPrepare20262: make() };
  const input = make("Musicala"); input.dataset.contractDefault = "RAZON_SOCIAL";
  const controls = [...Object.values(fields), input];
  const body = { innerHTML: "", querySelectorAll: (selector) => selector === "[data-contract-default]" ? [input] : selector === "input, textarea" ? [input] : controls };
  let payload;
  const context = vm.createContext({
    APP_STATE: { db: {}, activeUser: {}, contract: {} }, ADMIN_STATE: { contract: {} },
    $: (selector) => fields[selector.slice(1)], escapeHtml: (x) => x,
    serverTimestamp: () => "timestamp", emailKey: () => "admin@example.com", doc: () => "ref",
    TEACHER_CONTRACT_DOC_ID: "contrato", setDoc: async (_ref, data) => { if (failWrite) throw Error("denied"); payload = data; },
    getDocFromServer: async () => { if (failRead) throw Error("offline"); return { exists: () => true, data: () => payload }; },
    normalizeTeacherContract: (data) => data, setTimeout, clearTimeout, console: { error() {} }, renderAdminBody() {}
  });
  vm.runInContext(source.slice(start, end), context);
  context.renderAdminContratoEditor(body, { title: "Título", version: "2026.1", intro: "Intro", body: "Contenido", annexes: [], defaults: { RAZON_SOCIAL: "Musicala" } });
  return { fields, context, input, save: () => fields.contractEditSave.click({ currentTarget: fields.contractEditSave }) };
}

test("confirma junto al botón solo después de leer el contrato guardado", async () => {
  const h = setup(); await h.save();
  assert.match(h.fields.contractEditFeedback.textContent, /guardado y verificado/);
  assert.equal(h.fields.contractEditFeedback.dataset.state, "success");
  assert.equal(h.context.ADMIN_STATE.contract.doc.title, "Título");
  h.input.input();
  assert.match(h.fields.contractEditFeedback.textContent, /cambios nuevos sin guardar/);
});

test("conserva el editor y distingue un error al guardar de uno al verificar", async () => {
  const failed = setup({ failWrite: true }); await failed.save();
  assert.match(failed.fields.contractEditFeedback.textContent, /No se pudo confirmar/);
  assert.equal(failed.fields.contractEditSave.disabled, false);
  const uncertain = setup({ failRead: true }); await uncertain.save();
  assert.match(uncertain.fields.contractEditFeedback.textContent, /no pudimos verificarlo/);
  assert.equal(uncertain.fields.contractTitle.value, "Título");
});

test("muestra errores de validación sin escribir", async () => {
  const h = setup(); h.fields.contractAnnexes.value = "{"; await h.save();
  assert.match(h.fields.contractEditFeedback.textContent, /JSON válido/);
  assert.equal(h.fields.contractEditFeedback.dataset.state, "error");
});
