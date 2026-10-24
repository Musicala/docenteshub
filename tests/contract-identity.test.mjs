import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const fieldsStart = source.indexOf("const TEACHER_CONTRACT_TERM_FIELDS = [");
const helperStart = source.indexOf("function contractIdentityFields(");
const context = vm.createContext({});
vm.runInContext(source.slice(fieldsStart, source.indexOf("];", fieldsStart) + 2)
  + "\n" + source.slice(helperStart, source.indexOf("function buildTeacherContractVariables(", helperStart)), context);

test("separa el tipo existente del número sin alterar el registro recibido", () => {
  const original = { contratistaDocumento: "Cédula de ciudadanía: 0012345" };
  const result = context.contractIdentityFields(original);
  assert.equal(result.contratistaTipoDocumento, "Cédula de ciudadanía");
  assert.equal(result.contratistaDocumento, "0012345");
  assert.equal(original.contratistaDocumento, "Cédula de ciudadanía: 0012345");
});

test("conserva tipos separados y números de pasaporte alfanuméricos", () => {
  const result = context.contractIdentityFields({ contratistaTipoDocumento: "Pasaporte", contratistaDocumento: "AB00123" });
  assert.equal(result.contratistaTipoDocumento, "Pasaporte");
  assert.equal(result.contratistaDocumento, "AB00123");
});

test("no inventa el tipo de los documentos que solo contienen un número", () => {
  assert.equal(context.contractIdentityFields({ contratistaDocumento: "0012345" }).contratistaTipoDocumento, "");
  assert.equal(context.contractIdentityFields(null).contratistaDocumento, "");
  assert.equal(context.contractIdentityFields({ contratistaDocumento: "Referencia: AB001" }).contratistaDocumento, "Referencia: AB001");
});
