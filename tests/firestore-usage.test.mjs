import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
function extract(start, end) {
  return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
}

test("la consulta académica filtra en el servidor solo cuando se elige docente", async () => {
  const calls = [];
  const ctx = vm.createContext({
    APP_STATE: { db: {} }, ADMIN_STATE: { filters: { email: "ana@example.com" } },
    collection: (_db, name) => ({ name }), where: (...args) => args,
    query: (base, condition) => ({ ...base, condition }),
    getDocs: async (q) => { calls.push(q); return { docs: [] }; }
  });
  vm.runInContext(extract("async function fetchAdminAcademic()", "function academicNum("), ctx);
  await ctx.fetchAdminAcademic();
  assert.equal(calls.length, 3);
  for (const call of calls) assert.deepEqual(Array.from(call.condition), ["teacherEmail", "==", "ana@example.com"]);
  calls.length = 0;
  ctx.ADMIN_STATE.filters.email = "";
  await ctx.fetchAdminAcademic();
  assert.ok(calls.every((call) => !call.condition));
});

test("el directorio evita escrituras repetidas y sincroniza cambios y vencimientos", async () => {
  const writes = [];
  let expired = false;
  const ctx = vm.createContext({
    APP_STATE: { db: {}, activeUser: {} }, HUB: { USERS: { "ana@example.com": { label: "Ana" } } },
    ADMIN_EMAILS: [], isAdminUser: () => true, isAccessExpired: () => expired,
    doc: (_db, collection, email) => `${collection}/${email}`,
    serverTimestamp: () => "timestamp", setDoc: async (path, value) => { writes.push({ path, value }); }
  });
  vm.runInContext(extract("let teacherDirectorySyncFingerprint", "// Acceso temporal:"), ctx);
  await ctx.syncTeacherDirectory({});
  await ctx.syncTeacherDirectory({});
  assert.equal(writes.length, 1);
  expired = true;
  await ctx.syncTeacherDirectory({});
  assert.equal(writes.length, 2);
  assert.equal(writes[1].value.enabled, false);
  expired = false;
  await ctx.syncTeacherDirectory({ "ana@example.com": { label: "Ana María" } });
  assert.equal(writes[2].value.name, "Ana María");
});
