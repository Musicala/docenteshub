import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Ejecutamos las funciones reales del HUB con lecturas controladas de Firestore.
// No se inicia Auth ni se crean perfiles, aceptaciones o firmas de prueba.
const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
function section(name, next) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  const end = source.indexOf(`function ${next}(`, start + 1);
  assert.ok(start >= 0 && end > start, `Función disponible: ${name}`);
  return source.slice(start, end).replace(/async\s*$/, "");
}
function harness() {
  const listeners = [];
  const context = vm.createContext({
    APP_STATE: {
      activeUser: { email: "test@example.com" }, hubUserDoc: null, db: {},
      activeLinks: {}, activeProfile: {},
      accessSync: { unsubscribe: null, profileError: false, refreshing: false },
      contract: { access: { allowedEmails: [] }, accessLoaded: false, accessError: false }
    },
    HUB: { USERS: {}, BUTTONS: [] }, TEACHER_CONTRACT_ACCESS_DOC_ID: "contratoDocenteAcceso",
    console: { warn() {} },
    doc: (_db, collection, id) => `${collection}/${id}`,
    onSnapshot: (path, options, success, error) => {
      assert.equal(options.includeMetadataChanges, true, "la confirmación del servidor también debe emitir un evento sin cambio de datos");
      const entry = { path, success, error, stopped: false }; listeners.push(entry);
      return () => { entry.stopped = true; };
    },
    renderButtons() {}, repaintSessionContractAccess() {},
    isAdminUser: () => false, canUseCoordinationMessages: () => true,
    isAccessExpired: (expiry) => typeof expiry === "number" && expiry > 0 && expiry < Date.now(),
    getAuth: () => ({}), handleUnauthorizedUser() {},
    getDocFromServer: async () => snapshot(null),
    escapeHtml: (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;"),
    setDoc: async () => {}, serverTimestamp: () => "server-time"
  });
  const functions = [
    ["emailKey", "prettyName"], ["getVisibleButtonsForUserDoc", "assertConfig"],
    ["getAssignableButtons", "getVisibleButtonsForUserDoc"],
    ["getResolvedButtonState", "renderButtons"],
    ["loadTeacherContractAccess", "teacherContractVisibility"],
    ["teacherContractVisibility", "canSeeTeacherContract"],
    ["canSeeTeacherContract", "renderTeacherContractAccessHome"],
    ["renderTeacherContractAccessHome", "repaintSessionContractAccess"],
    ["stopSessionContractAccessSync", "startSessionContractAccessSync"],
    ["startSessionContractAccessSync", "refreshSessionContractAccess"],
    ["saveHubUser", "deleteHubUser"]
  ];
  vm.runInContext(functions.map(([name, next]) => section(name, next)).join("\n"), context);
  return { context, state: context.APP_STATE, listeners };
}
function snapshot(data, fromCache = false) {
  return { exists: () => data !== null, data: () => data, metadata: { fromCache } };
}
const supportButton = { id: "supportContract", supportOnly: true };
const contractButton = { id: "contratoDocente", contractAllowlist: true };

test("apoyo ve ambos accesos aunque la lista adicional y sus botones asignados estén vacíos", () => {
  const { context, state } = harness();
  state.hubUserDoc = { employmentType: "support_contractor", visibleButtons: [] };
  assert.equal(context.getResolvedButtonState(supportButton).visible, true);
  assert.equal(context.getResolvedButtonState(contractButton).visible, true);
  assert.match(context.renderTeacherContractAccessHome(), /data-id="supportContract"/);
  assert.match(context.renderTeacherContractAccessHome(), /data-id="contratoDocente"/);
});

test("planta solo ve contrato si está autorizada; no hereda el rol de otra cuenta", () => {
  const { context, state } = harness();
  state.contract.access.allowedEmails = [" TEST@EXAMPLE.COM "];
  assert.equal(context.getResolvedButtonState(supportButton).visible, false);
  assert.equal(context.getResolvedButtonState(contractButton).visible, true);
  state.hubUserDoc = { employmentType: "support_contractor" };
  assert.equal(context.canSeeTeacherContract("other@example.com"), false);
  state.hubUserDoc = null;
  state.contract.access.allowedEmails = [];
  assert.equal(context.renderTeacherContractAccessHome(), "");
});

test("una lectura fallida es visible, descarta la lista anterior y admite un nuevo intento", async () => {
  const { context, state } = harness();
  state.contract.access.allowedEmails = ["test@example.com"];
  context.getDocFromServer = async () => { throw new Error("permission-denied"); };
  await context.loadTeacherContractAccess(true);
  assert.equal(state.contract.accessLoaded, false);
  assert.equal(state.contract.accessError, true);
  assert.equal(context.canSeeTeacherContract(), false);
  assert.match(context.renderTeacherContractAccessHome(), /No pudimos verificar/);
  context.getDocFromServer = async () => snapshot({ allowedEmails: ["test@example.com"] });
  await context.loadTeacherContractAccess();
  assert.equal(state.contract.accessError, false);
  assert.equal(context.canSeeTeacherContract(), true);
});

test("una respuesta tardía de la cuenta anterior no concede acceso a la siguiente", async () => {
  const { context, state } = harness();
  let finish;
  context.getDocFromServer = () => new Promise((resolve) => { finish = resolve; });
  const reading = context.loadTeacherContractAccess(true);
  state.activeUser = { email: "other@example.com" };
  finish(snapshot({ allowedEmails: ["other@example.com"] }));
  await reading;
  assert.equal(context.canSeeTeacherContract(), false);
  assert.equal(state.contract.accessLoaded, false);
});

test("los cambios de vinculación y lista adicional se reflejan en una sesión abierta", () => {
  const { context, state, listeners } = harness();
  context.startSessionContractAccessSync();
  listeners[0].success(snapshot({ enabled: true, employmentType: "support_contractor" }));
  assert.equal(context.getResolvedButtonState(supportButton).visible, true);
  assert.equal(context.canSeeTeacherContract(), true);
  listeners[0].success(snapshot({ enabled: true, employmentType: "staff" }));
  assert.equal(context.canSeeTeacherContract(), false);
  listeners[1].success(snapshot({ allowedEmails: ["test@example.com"] }));
  assert.equal(context.canSeeTeacherContract(), true);
  listeners[1].success(snapshot({ allowedEmails: [] }));
  assert.equal(context.canSeeTeacherContract(), false);
  listeners[1].error(new Error("permission-denied"));
  assert.equal(state.contract.accessError, true);
});

test("caché no reemplaza el perfil verificado y la inhabilitación del servidor bloquea la sesión", () => {
  const { context, state, listeners } = harness();
  state.hubUserDoc = { enabled: true, employmentType: "support_contractor" };
  let blocked = 0;
  context.handleUnauthorizedUser = () => { blocked++; };
  context.startSessionContractAccessSync();
  listeners[0].success(snapshot({ enabled: false }, true));
  assert.equal(context.canSeeTeacherContract(), true);
  assert.equal(blocked, 0);
  listeners[0].success(snapshot({ enabled: false }));
  assert.equal(blocked, 1);
});

test("cerrar o reiniciar la suscripción impide aplicar eventos antiguos", () => {
  const { context, state, listeners } = harness();
  context.startSessionContractAccessSync();
  context.stopSessionContractAccessSync();
  assert.ok(listeners.every((entry) => entry.stopped));
  listeners[0].success(snapshot({ employmentType: "support_contractor" }));
  assert.equal(state.hubUserDoc, null);
  context.startSessionContractAccessSync();
  state.activeUser = { email: "other@example.com" };
  listeners[2].success(snapshot({ employmentType: "support_contractor" }));
  assert.equal(state.hubUserDoc, null);
});

test("el editor verifica en servidor que el tipo de vinculación realmente quedó guardado", async () => {
  const { context } = harness();
  const writes = [];
  context.setDoc = async (path) => { writes.push(path); };
  context.getDocFromServer = async () => snapshot({ employmentType: "staff" });
  await assert.rejects(context.saveHubUser("test@example.com", { employmentType: "support_contractor" }), /no coinciden/);
  assert.deepEqual(writes, ["hubUsers/test@example.com"]);
  context.getDocFromServer = async () => snapshot({ employmentType: "support_contractor", enabled: true });
  const saved = await context.saveHubUser("test@example.com", { employmentType: "support_contractor" });
  assert.equal(saved.employmentType, "support_contractor");
  assert.equal(writes.at(-1), "teacherDirectory/test@example.com");
});

test("los accesos automáticos no se ofrecen como botones manuales contradictorios", () => {
  const { context } = harness();
  context.HUB.BUTTONS = [supportButton, contractButton, { id: "library" }];
  assert.deepEqual(Array.from(context.getAssignableButtons(), (button) => button.id), ["library"]);
});
