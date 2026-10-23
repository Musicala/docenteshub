import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
function section(name, next) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  const end = source.indexOf(`function ${next}(`, start + 1);
  assert.ok(start >= 0 && end > start, name);
  return source.slice(start, end).replace(/async\s*$/, "");
}
function harness() {
  const nodes = [];
  const keys = [];
  const background = { style: { zIndex: "9999" } };
  const document = {
    createElement: () => ({
      style: {}, innerHTML: "", body: { innerHTML: "" }, listeners: {},
      setAttribute() {}, addEventListener(name, fn) { this.listeners[name] = fn; },
      remove() { const index = nodes.indexOf(this); if (index >= 0) nodes.splice(index, 1); }
    }),
    querySelectorAll: (selector) => selector === ".contractOverlay" ? [...nodes] : [background, ...nodes],
    body: { appendChild: (node) => nodes.push(node), contains: (node) => nodes.includes(node) }
  };
  const context = vm.createContext({
    document, APP_STATE: { storage: {} }, setTimeout, clearTimeout,
    window: {
      addEventListener: (_name, fn) => keys.push(fn),
      removeEventListener: (_name, fn) => { const index = keys.indexOf(fn); if (index >= 0) keys.splice(index, 1); }
    },
    getComputedStyle: (node) => node.style,
    $: (selector, root) => selector === ".contractCardBody" ? root.body : nodes.find((node) => `#${node.id}` === selector) || null,
    storageRef: (_storage, path) => path,
    getDownloadURL: async () => "https://example.com/private-file",
    getBlob: () => { throw new Error("No debe iniciar una descarga CORS de blob"); },
    console: { warn() {} }, URL: { revokeObjectURL() {} },
    escapeHtml: (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;"),
    effectiveStatus: () => "cargado", dossierToday: () => "2026-10-23",
    DOSSIER_STATUS_META: { cargado: { tone: "info", icon: "", label: "Cargado" } },
    contractTimestampLabel: () => "Fecha de prueba"
  });
  const functions = [
    ["openContractOverlay", "openTeacherContract"],
    ["withDossierViewerTimeout", "resolveDossierFileUrl"],
    ["resolveDossierFileUrl", "dossierViewerErrorMessage"],
    ["dossierViewerErrorMessage", "openDossierViewer"],
    ["openDossierViewer", "renderDossierProgressCard"]
  ];
  vm.runInContext(functions.map(([name, next]) => section(name, next)).join("\n"), context);
  return { context, nodes, keys, background };
}
const version = { storagePath: "contract-files/test/identity/v1/file.pdf", mimeType: "application/pdf", fileName: "Documento.pdf" };
const requirement = { name: "Documento de identidad" };

test("el visor abre encima del expediente y del panel administrativo", () => {
  const { context, background } = harness();
  const dossier = context.openContractOverlay("Expediente", "", "dossier");
  const viewer = context.openContractOverlay("Documento", "", "viewer");
  assert.ok(Number(dossier.style.zIndex) > Number(background.style.zIndex));
  assert.ok(Number(viewer.style.zIndex) > Number(dossier.style.zIndex));
});

test("Escape cierra solo el visor superior y conserva el expediente", () => {
  const { context, nodes, keys } = harness();
  const dossier = context.openContractOverlay("Expediente", "", "dossier");
  const viewer = context.openContractOverlay("Documento", "", "viewer");
  let stopped = false;
  const event = { key: "Escape", stopImmediatePropagation: () => { stopped = true; } };
  for (const listener of [...keys]) { listener(event); if (stopped) break; }
  assert.ok(nodes.includes(dossier));
  assert.ok(!nodes.includes(viewer));
  assert.equal(keys.length, 1);
});

test("obtiene el enlace autenticado sin bloquear por una descarga de blob", async () => {
  const { context, nodes } = harness();
  let requests = 0;
  context.getDownloadURL = async () => { requests++; return "https://example.com/file.pdf"; };
  await context.openDossierViewer(version, requirement);
  assert.equal(requests, 1);
  assert.match(nodes[0].body.innerHTML, /<iframe/);
  assert.match(nodes[0].body.innerHTML, /Abrir archivo en otra pestaña/);
  assert.match(nodes[0].body.innerHTML, /Descargar/);
});

test("una consulta que no responde termina con un error acotado", async () => {
  const { context } = harness();
  await assert.rejects(context.withDossierViewerTimeout(new Promise(() => {}), 10), (error) => error.code === "dossier/timeout");
});

test("los errores de permiso se muestran con reintento y no se ocultan ni se eluden", async () => {
  const { context, nodes } = harness();
  context.getDownloadURL = async () => { const error = new Error("denied"); error.code = "storage/unauthorized"; throw error; };
  await context.openDossierViewer(version, requirement);
  assert.match(nodes[0].body.innerHTML, /no tiene permiso/);
  assert.match(nodes[0].body.innerHTML, /Reintentar/);
  assert.doesNotMatch(nodes[0].body.innerHTML, /Abriendo el documento|<iframe/);
});

test("cerrar mientras carga impide que una respuesta tardía vuelva a abrir el visor", async () => {
  const { context, nodes } = harness();
  let finish;
  context.getDownloadURL = () => new Promise((resolve) => { finish = resolve; });
  const pending = context.openDossierViewer(version, requirement);
  const overlay = nodes[0];
  overlay.remove();
  finish("https://example.com/file.pdf");
  await pending;
  assert.equal(nodes.length, 0);
  assert.equal(overlay.body.innerHTML, "");
});

test("un archivo sin referencia no dispara peticiones y explica el problema", async () => {
  const { context, nodes } = harness();
  context.getDownloadURL = () => { throw new Error("No debe consultar Storage"); };
  await context.openDossierViewer({}, requirement);
  assert.match(nodes[0].body.innerHTML, /No encontramos el archivo/);
});
