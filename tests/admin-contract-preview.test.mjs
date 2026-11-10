import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const code = source.slice(source.indexOf("async function openAdminTeacherContractPreview("), source.indexOf("function renderAdminContrato(body)"));

function harness({ signature = null, fail = false } = {}) {
  const panel = { innerHTML: "" };
  const overlay = {};
  let renderedDocument;
  const context = vm.createContext({
    APP_STATE: { db: {} }, isAdminUser: () => true, document: { body: { contains: () => true } },
    openContractOverlay: () => overlay, $: (selector) => selector === ".contractCardBody" ? panel : null,
    doc: (_db, collection, id) => `${collection}/${id}`,
    TEACHER_CONTRACT_DOC_ID: "contract", TEACHER_CONTRACT_TERMS_COLLECTION: "terms", TEACHER_CONTRACT_SIGNATURES_COLLECTION: "signatures",
    teacherContractSignatureId: (email, version) => `${email}__${version}`,
    getDocFromServer: async (path) => {
      if (fail) throw new Error("sin conexión");
      const data = path.startsWith("app_config/") ? { version: "2026.3" } : path.startsWith("terms/") ? { approvedForSignature: true, approvedVersion: "2026.3", contratistaNombre: "Catalina" } : signature;
      return { exists: () => !!data, data: () => data };
    },
    normalizeTeacherContract: (data) => data,
    buildTeacherContractDocument: (_contract, terms) => ({ version: "2026.3", title: terms.contratistaNombre, intro: "", sections: [] }),
    renderTeacherContractSections: (doc) => { renderedDocument = doc; return ""; },
    escapeHtml: (value) => String(value), console: { error() {} }, computeTeacherContractHash: async () => "hash",
    teacherContractSnapshotText: () => "snapshot", printTeacherContract() {}
  });
  vm.runInContext(code, context);
  return { context, panel, rendered: () => renderedDocument };
}

test("muestra la vista previa con las condiciones guardadas", async () => {
  const h = harness();
  await h.context.openAdminTeacherContractPreview("cata@example.com");
  assert.equal(h.rendered().title, "Catalina");
  assert.match(h.panel.innerHTML, /pendiente de firmar/);
});

test("presenta el snapshot firmado y valida su huella", async () => {
  const h = harness({ signature: { version: "2026.3", contentHash: "hash", snapshot: { title: "Copia firmada", intro: "", sections: [{ title: "Contrato", body: "Firmado" }] } } });
  await h.context.openAdminTeacherContractPreview("cata@example.com");
  assert.equal(h.rendered().title, "Copia firmada");
  assert.match(h.panel.innerHTML, /copia conservada con la firma/);
});

test("si falla la consulta muestra un error y no presenta datos anteriores", async () => {
  const h = harness({ fail: true });
  await h.context.openAdminTeacherContractPreview("cata@example.com");
  assert.match(h.panel.innerHTML, /No se pudo consultar/);
  assert.equal(h.rendered(), undefined);
});
