/* Musicala · Bitácora Académica / Trabajo por Objetivos — módulo del HUB
   ============================================================================
   PERSISTENCIA: 100% Firebase/Firestore (ya no usa Google Sheets ni localStorage).
   - El módulo corre dentro del HUB (iframe, mismo origen) y reutiliza la sesión
     de Firebase Auth ya iniciada. No requiere volver a iniciar sesión.
   - Cada docente lee/escribe SOLO su información (reglas de Firestore por correo).
     La coordinación (admin) puede ver todo.

   Colecciones Firestore:
     academicObjectives    → tareas / objetivos
     academicTaskBudgets   → bolsas de horas
     academicTaskHourLogs  → registros de horas (avances)

   El "Volver al HUB" avisa a la ventana padre (postMessage) para cerrar.
============================================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* Mismo proyecto que el HUB (config pública del cliente). */
const firebaseConfig = {
  apiKey: "AIzaSyC06dLl2Lig3-kD4OVmh4C9LpFW9AeTyOc",
  authDomain: "musicala-docentes-hub.firebaseapp.com",
  projectId: "musicala-docentes-hub",
  storageBucket: "musicala-docentes-hub.firebasestorage.app",
  messagingSenderId: "936379833270",
  appId: "1:936379833270:web:512519cf318c919e3abf17"
};

const COL = {
  objectives: "academicObjectives",
  budgets: "academicTaskBudgets",
  hourLogs: "academicTaskHourLogs"
};

/* ------------------------------ Utilidades ------------------------------ */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
const norm = value => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const toNumber = value => {
  const n = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const round2 = n => Math.round((Number(n) || 0) * 100) / 100;
const fmtHours = n => `${round2(n).toLocaleString('es-CO', { maximumFractionDigits: 2 })} h`;
const todayMonth = () => new Date().toISOString().slice(0, 7);
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
const debounce = (fn, delay = 250) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* Contexto inyectado por el HUB (?email=&name=&role=&embedded=1). */
const ACADEMIC_CTX = { email: '', name: '', role: 'Docente', embedded: false };

let DB = null;
let AUTH = null;
let ME = '';        // correo autenticado (fuente de verdad para escribir)
let currentTask = null;
let activeView = 'resumen';
let dataReady = false;

const store = {
  objectives: [],
  budgets: [],
  hourLogs: []
};

function isAdminContext() {
  return ACADEMIC_CTX.role === 'Admin';
}

function readContextFromUrl() {
  const p = new URL(location.href).searchParams;
  ACADEMIC_CTX.email = String(p.get('email') || '').toLowerCase().trim();
  ACADEMIC_CTX.name = String(p.get('name') || '').trim();
  ACADEMIC_CTX.role = String(p.get('role') || '').trim().toLowerCase() === 'admin' ? 'Admin' : 'Docente';
  ACADEMIC_CTX.embedded = p.get('embedded') === '1' || window.parent !== window;
}

function setStatus(message, isError = false) {
  const el = $('#status');
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'status status--error' : 'status';
}

function inferPerson() {
  return ACADEMIC_CTX.name || ME || '';
}

function applyBranding() {
  document.title = `Bitácora Académica · ${ACADEMIC_CTX.name || 'Musicala'}`;
  const ctx = $('#site-context');
  if (ctx) {
    ctx.textContent = `${ACADEMIC_CTX.name || ME}${(ACADEMIC_CTX.name || ME) ? ' · ' : ''}${isAdminContext() ? 'Vista coordinación (todas las docentes)' : 'Docente'} · Datos en Firebase`;
    ctx.hidden = false;
  }
}

/* ============================ Carga de datos ============================ */
async function loadCollection(name) {
  // Docente: solo lo suyo. Admin: todo.
  let snap;
  if (isAdminContext()) {
    snap = await getDocs(collection(DB, name));
  } else {
    snap = await getDocs(query(collection(DB, name), where("teacherEmail", "==", ME)));
  }
  return snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
}

async function loadAll() {
  setStatus('Cargando desde Firebase…');
  const [objectives, budgets, hourLogs] = await Promise.all([
    loadCollection(COL.objectives),
    loadCollection(COL.budgets),
    loadCollection(COL.hourLogs)
  ]);
  store.objectives = objectives;
  store.budgets = budgets;
  store.hourLogs = hourLogs;
  dataReady = true;
  const n = store.objectives.length;
  setStatus(`${n} tarea${n === 1 ? '' : 's'} cargada${n === 1 ? '' : 's'} desde Firebase.`);
}

/* ----------------------------- Escrituras ------------------------------ */
function ownerFields() {
  return {
    teacherEmail: ME,
    teacherName: ACADEMIC_CTX.name || ME,
    updatedAt: serverTimestamp(),
    createdBy: ME
  };
}

async function dbSaveObjective(obj) {
  const ref = doc(DB, COL.objectives, obj.id);
  await setDoc(ref, { ...obj, ...ownerFields() }, { merge: true });
}

async function dbDeleteObjective(id) {
  await deleteDoc(doc(DB, COL.objectives, id));
}

async function dbSaveBudget(budget) {
  const ref = doc(DB, COL.budgets, budget.id);
  await setDoc(ref, { ...budget, ...ownerFields() }, { merge: true });
}

async function dbSaveHourLog(log) {
  const ref = doc(DB, COL.hourLogs, log.id);
  await setDoc(ref, { ...log, ...ownerFields() }, { merge: true });
}

/* ============================ Modelo de tareas ========================== */
function normalizeState(value) {
  const s = norm(value);
  if (!s) return 'Pendiente';
  if (s.startsWith('cumpl') || s.includes('termin') || s.includes('hecha') || s.includes('finaliz') || s.includes('aprob')) return 'Cumplido';
  if (s.includes('curso') || s.includes('progreso') || s.includes('desarrollo')) return 'En curso';
  return 'Pendiente';
}

function stateClass(value) {
  const state = normalizeState(value);
  if (state === 'Cumplido') return 'pill pill--ok';
  if (state === 'En curso') return 'pill pill--warn';
  return 'pill pill--neutral';
}

function urgencyClass(value) {
  const s = norm(value);
  if (s.includes('alta') || s.includes('urgente')) return 'pill pill--danger';
  if (s.includes('media')) return 'pill pill--warn';
  if (s.includes('baja')) return 'pill pill--ok';
  return 'pill pill--neutral';
}

function getAllTasks() {
  return store.objectives.map(task => ({
    source: 'firestore',
    id: task.id,
    title: task.title || 'Tarea sin título',
    person: task.person || task.teacherName || inferPerson(),
    state: task.state || 'Pendiente',
    urgency: task.urgency || '',
    dueDate: task.dueDate || '',
    estimatedHours: toNumber(task.estimatedHours),
    period: task.period || todayMonth(),
    category: task.category || '',
    criteria: task.criteria || task.description || '',
    description: task.description || '',
    createdAt: task.createdAt || ''
  }));
}

function getTaskById(id) {
  return getAllTasks().find(task => String(task.id) === String(id));
}

function durationHours(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b <= a) return 0;
  return round2((b - a) / 36e5);
}

function usedHoursForTask(taskId) {
  return store.hourLogs
    .filter(log => String(log.taskId) === String(taskId))
    .reduce((sum, log) => sum + toNumber(log.recognizedHours || log.durationHours), 0);
}

function getSelectedObjectiveTasks() {
  const period = $('#fBolsaPeriodo')?.value || '';
  const person = $('#fBolsaPersona')?.value || '';
  const queryStr = norm($('#qBolsa')?.value || '');
  return getAllTasks().filter(task => {
    if (period && task.period !== period) return false;
    if (person && task.person !== person) return false;
    if (queryStr && !norm(`${task.id} ${task.title} ${task.person} ${task.category} ${task.description}`).includes(queryStr)) return false;
    return true;
  });
}

/* ============================== Render ================================= */
function emptyRow(colspan = 8, text = 'No hay información para mostrar todavía.') {
  return `<tr><td colspan="${colspan}" class="empty-state">${esc(text)}</td></tr>`;
}

function renderTabs() {
  $$('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === activeView));
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${activeView}`));
}

function switchView(viewName) {
  activeView = viewName;
  renderTabs();
  renderAll();
}

function uniqueSorted(values) {
  return Array.from(new Set(values.map(value => String(value || '').trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

function fillSelect(select, options, placeholder) {
  if (!select) return;
  const prev = select.value;
  select.innerHTML = `<option value="">${esc(placeholder)}</option>` + options.map(option => `<option value="${esc(option)}">${esc(option)}</option>`).join('');
  if (prev && options.includes(prev)) select.value = prev;
  select.style.display = options.length ? '' : 'none';
}

function fillFilters() {
  const tasks = getAllTasks();
  fillSelect($('#fPersona'), uniqueSorted(tasks.map(t => t.person)), 'Responsable: todos');
  fillSelect($('#fEstado'), uniqueSorted(tasks.map(t => normalizeState(t.state))), 'Estado: todos');
  fillSelect($('#fUrgencia'), uniqueSorted(tasks.map(t => t.urgency)), 'Urgencia: todas');
  fillSelect($('#fBolsaPeriodo'), uniqueSorted(tasks.map(t => t.period).concat(store.budgets.map(b => b.period))), 'Periodo: todos');
  fillSelect($('#fBolsaPersona'), uniqueSorted(tasks.map(t => t.person).concat(store.budgets.map(b => b.person))), 'Responsable: todos');
}

function filteredTaskRows() {
  const tasks = getAllTasks();
  const selPerson = $('#fPersona')?.value || '';
  const selState = $('#fEstado')?.value || '';
  const selUrgency = $('#fUrgencia')?.value || '';
  const queryStr = norm($('#q')?.value || '');
  return tasks.filter(task => {
    if (selPerson && task.person !== selPerson) return false;
    if (selState && normalizeState(task.state) !== selState) return false;
    if (selUrgency && task.urgency !== selUrgency) return false;
    if (queryStr && !norm(`${task.id} ${task.title} ${task.person} ${task.state} ${task.urgency} ${task.dueDate} ${task.description}`).includes(queryStr)) return false;
    return true;
  });
}

function renderMainTable() {
  const thead = $('#tbl thead');
  const tbody = $('#tbl tbody');
  if (!thead || !tbody) return;

  thead.innerHTML = '<tr><th>ID</th><th>Tarea</th><th>Responsable</th><th>Periodo</th><th>Estado</th><th>Horas</th><th>Acciones</th></tr>';
  const rows = filteredTaskRows();

  if (!rows.length) {
    tbody.innerHTML = emptyRow(7, dataReady
      ? 'No hay tareas con esos filtros. Crea una con “＋ Nueva tarea objetivo”.'
      : 'Cargando…');
    return;
  }

  tbody.innerHTML = rows.map(task => {
    const used = usedHoursForTask(task.id);
    return `
      <tr data-id="${esc(task.id)}">
        <td data-th="ID"><span class="mono">${esc(task.id)}</span></td>
        <td data-th="Tarea" class="wrap"><strong>${esc(task.title)}</strong><small>${esc(task.description || task.criteria || '')}</small></td>
        <td data-th="Responsable">${esc(task.person || '—')}</td>
        <td data-th="Periodo">${esc(task.period || '—')}</td>
        <td data-th="Estado"><span class="${stateClass(task.state)}">${esc(normalizeState(task.state))}</span></td>
        <td data-th="Horas"><div class="hours-cell"><strong>${fmtHours(used)}</strong><small>de ${fmtHours(task.estimatedHours)}</small></div></td>
        <td data-th="Acciones"><button class="btn btn-dark btn-detail" data-id="${esc(task.id)}" type="button">📝 Abrir</button></td>
      </tr>
    `;
  }).join('');
}

function countStates(tasks) {
  return tasks.reduce((acc, task) => {
    acc[normalizeState(task.state)] = (acc[normalizeState(task.state)] || 0) + 1;
    return acc;
  }, { Pendiente: 0, 'En curso': 0, Cumplido: 0 });
}

function renderMetrics() {
  const tasks = getAllTasks();
  const states = countStates(tasks);
  const estimated = tasks.reduce((sum, task) => sum + toNumber(task.estimatedHours), 0);
  const used = store.hourLogs.reduce((sum, log) => sum + toNumber(log.recognizedHours || log.durationHours), 0);

  $('#mPend').textContent = states.Pendiente || 0;
  $('#mCurso').textContent = states['En curso'] || 0;
  $('#mComp').textContent = states.Cumplido || 0;
  $('#mEstimadas').textContent = fmtHours(estimated);
  $('#mUsadas').textContent = fmtHours(used);
}

function renderInsights() {
  const box = $('#insights');
  if (!box) return;
  const tasks = getAllTasks();
  const withoutEstimate = tasks.filter(task => toNumber(task.estimatedHours) <= 0);
  const overBudgetTasks = tasks.filter(task => toNumber(task.estimatedHours) > 0 && usedHoursForTask(task.id) > toNumber(task.estimatedHours));
  const pending = tasks.filter(task => normalizeState(task.state) !== 'Cumplido');
  const used = store.hourLogs.reduce((sum, log) => sum + toNumber(log.recognizedHours || log.durationHours), 0);
  const estimated = tasks.reduce((sum, task) => sum + toNumber(task.estimatedHours), 0);

  const items = [
    { title: 'Tareas activas', value: pending.length, text: pending.length ? 'Hay trabajo pendiente o en curso. Revisa que cada una tenga entregable claro.' : 'No hay tareas activas registradas.' },
    { title: 'Sin estimación', value: withoutEstimate.length, text: withoutEstimate.length ? 'Candidatas a acordar: “¿cuánto tiempo reconocemos por esto?”' : 'Todas las tareas tienen una estimación.' },
    { title: 'Horas usadas vs. estimadas', value: `${fmtHours(used)} / ${fmtHours(estimated)}`, text: used > estimated && estimated > 0 ? 'El uso superó lo estimado. Conviene ajustar.' : 'El uso está dentro de lo planeado o falta estimar más tareas.' },
    { title: 'Tareas pasadas de horas', value: overBudgetTasks.length, text: overBudgetTasks.length ? 'Revisar si hubo retrabajo o mala estimación.' : 'Ninguna tarea por encima de su estimado.' }
  ];

  box.innerHTML = items.map(item => `
    <div class="insight-card">
      <span>${esc(item.title)}</span>
      <strong>${esc(item.value)}</strong>
      <p>${esc(item.text)}</p>
    </div>
  `).join('');
}

function renderNeedsEstimate() {
  const table = $('#tblNeedsEstimate');
  if (!table) return;
  const tasks = getAllTasks().filter(task => toNumber(task.estimatedHours) <= 0).slice(0, 10);
  table.querySelector('thead').innerHTML = '<tr><th>ID</th><th>Tarea</th><th>Responsable</th><th>Estado</th><th>Acción</th></tr>';
  table.querySelector('tbody').innerHTML = tasks.length ? tasks.map(task => `
    <tr>
      <td data-th="ID">${esc(task.id)}</td>
      <td data-th="Tarea" class="wrap"><strong>${esc(task.title)}</strong></td>
      <td data-th="Responsable">${esc(task.person || '—')}</td>
      <td data-th="Estado"><span class="${stateClass(task.state)}">${esc(normalizeState(task.state))}</span></td>
      <td data-th="Acción"><button class="btn btn-soft btn-detail" data-id="${esc(task.id)}" type="button">Estimar</button></td>
    </tr>
  `).join('') : emptyRow(5, 'Todas las tareas visibles tienen estimación.');
}

function budgetTotals() {
  const selectedPeriod = $('#fBolsaPeriodo')?.value || '';
  const selectedPerson = $('#fBolsaPersona')?.value || '';
  const tasks = getSelectedObjectiveTasks();
  const budgets = store.budgets.filter(budget => {
    if (selectedPeriod && budget.period !== selectedPeriod) return false;
    if (selectedPerson && budget.person !== selectedPerson) return false;
    return true;
  });
  const budgetHours = budgets.reduce((sum, budget) => sum + toNumber(budget.hours), 0);
  const estimated = tasks.reduce((sum, task) => sum + toNumber(task.estimatedHours), 0);
  const taskIds = new Set(tasks.map(task => String(task.id)));
  const used = store.hourLogs
    .filter(log => taskIds.has(String(log.taskId)))
    .reduce((sum, log) => sum + toNumber(log.recognizedHours || log.durationHours), 0);
  return { budgetHours, estimated, used, remaining: budgetHours - used, tasks, budgets };
}

function progressBar(value, max) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const label = `${round2(percent)}%`;
  return `<div class="progress" aria-label="${esc(label)}"><span style="width:${percent}%"></span></div>`;
}

function renderBudgetSummary() {
  const summary = $('#budgetSummary');
  const balance = $('#hourBalance');
  if (!summary || !balance) return;
  const totals = budgetTotals();
  const hasBudget = totals.budgetHours > 0;
  const over = hasBudget && totals.used > totals.budgetHours;

  summary.innerHTML = `
    <div class="budget-kpis">
      <div><span>Bolsa asignada</span><strong>${fmtHours(totals.budgetHours)}</strong></div>
      <div><span>Planeado</span><strong>${fmtHours(totals.estimated)}</strong></div>
      <div><span>Usado</span><strong>${fmtHours(totals.used)}</strong></div>
      <div><span>Saldo</span><strong class="${over ? 'danger-text' : ''}">${fmtHours(totals.remaining)}</strong></div>
    </div>
    ${progressBar(totals.used, totals.budgetHours || totals.estimated || 1)}
    <p class="helper-text">${hasBudget ? (over ? 'La bolsa está sobrepasada. Toca revisar si se aprueba más tiempo o se recortan objetivos.' : 'La bolsa aún tiene margen frente al uso registrado.') : 'Aún no hay una bolsa asignada para los filtros actuales.'}</p>
  `;

  balance.innerHTML = totals.budgets.length ? totals.budgets.map(budget => `
    <div class="balance-row">
      <div><strong>${esc(budget.person)}</strong><small>${esc(budget.period)} · ${esc(budget.note || 'Sin nota')}</small></div>
      <span>${fmtHours(budget.hours)}</span>
    </div>
  `).join('') : '<p class="helper-text">Crea una bolsa de horas para empezar a comparar acuerdo vs. uso real.</p>';
}

function renderObjectivesTable() {
  const table = $('#tblObjectives');
  if (!table) return;
  const tasks = getSelectedObjectiveTasks();
  table.querySelector('thead').innerHTML = '<tr><th>ID</th><th>Tarea / objetivo</th><th>Responsable</th><th>Periodo</th><th>Categoría</th><th>Estimado</th><th>Usado</th><th>Estado</th><th>Acción</th></tr>';

  if (!tasks.length) {
    table.querySelector('tbody').innerHTML = emptyRow(9, 'No hay tareas en esta bolsa todavía.');
    return;
  }

  table.querySelector('tbody').innerHTML = tasks.map(task => {
    const used = usedHoursForTask(task.id);
    const over = toNumber(task.estimatedHours) > 0 && used > toNumber(task.estimatedHours);
    return `
      <tr>
        <td data-th="ID"><span class="mono">${esc(task.id)}</span></td>
        <td data-th="Tarea" class="wrap"><strong>${esc(task.title)}</strong><small>${esc(task.description || task.criteria || '')}</small></td>
        <td data-th="Responsable">${esc(task.person || '—')}</td>
        <td data-th="Periodo">${esc(task.period || '—')}</td>
        <td data-th="Categoría">${esc(task.category || '—')}</td>
        <td data-th="Estimado">${fmtHours(task.estimatedHours)}</td>
        <td data-th="Usado"><span class="${over ? 'danger-text' : ''}">${fmtHours(used)}</span></td>
        <td data-th="Estado"><span class="${stateClass(task.state)}">${esc(normalizeState(task.state))}</span></td>
        <td data-th="Acción"><button class="btn btn-dark btn-detail" data-id="${esc(task.id)}" type="button">Abrir</button></td>
      </tr>
    `;
  }).join('');
}

function renderHourLogs() {
  const table = $('#tblHourLogs');
  if (!table) return;
  table.querySelector('thead').innerHTML = '<tr><th>Fecha</th><th>Tarea</th><th>Responsable</th><th>Tipo</th><th>Duración</th><th>Reconocidas</th><th>Avance</th></tr>';
  const logs = [...store.hourLogs].sort((a, b) => String(b.start).localeCompare(String(a.start)));
  if (!logs.length) {
    table.querySelector('tbody').innerHTML = emptyRow(7, 'Todavía no hay horas registradas.');
    return;
  }
  table.querySelector('tbody').innerHTML = logs.map(log => `
    <tr>
      <td data-th="Fecha"><span class="mono">${esc(formatDateTime(log.start))}</span></td>
      <td data-th="Tarea" class="wrap"><strong>${esc(log.taskTitle || log.taskId)}</strong><small>${esc(log.taskId)}</small></td>
      <td data-th="Responsable">${esc(log.person || '—')}</td>
      <td data-th="Tipo">${esc(log.workType || '—')}</td>
      <td data-th="Duración">${fmtHours(log.durationHours)}</td>
      <td data-th="Reconocidas"><strong>${fmtHours(log.recognizedHours || log.durationHours)}</strong></td>
      <td data-th="Avance" class="wrap">${esc(log.advanced || '')}</td>
    </tr>
  `).join('');
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

function renderAll() {
  fillFilters();
  renderMetrics();
  renderInsights();
  renderNeedsEstimate();
  renderBudgetSummary();
  renderMainTable();
  renderObjectivesTable();
  renderHourLogs();
}

/* ============================== Modales ================================ */
function showModal(id) {
  const modal = $(id);
  if (!modal) return;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal(id) {
  const modal = id ? $(id) : $('.modal.show');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  if ($('#logStatus')) $('#logStatus').textContent = '';
}

function openDetailById(id) {
  const task = getTaskById(id);
  if (!task) return;
  currentTask = task;

  $('#logTaskId').value = task.id;
  $('#logTaskSource').value = task.source;
  $('#logTaskIdTxt').textContent = task.id;
  $('#logTaskName').textContent = task.title || '—';
  $('#logTaskPerson').textContent = task.person || '—';
  $('#logTaskState').textContent = normalizeState(task.state);
  $('#estimateTaskId').value = task.id;
  $('#estimatePeriod').value = task.period || todayMonth();
  $('#estimateHours').value = task.estimatedHours ? round2(task.estimatedHours) : '';
  $('#estimateCategory').value = task.category || '';
  $('#estimateCriteria').value = task.criteria || task.description || '';
  $('#logEstado').value = normalizeState(task.state);

  setDefaultLogTimes();
  updateDurationPreview();
  loadLogs(task.id);
  showModal('#modalLog');
}

function setDefaultLogTimes() {
  const now = new Date();
  const end = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const startDate = new Date(now.getTime() - 60 * 60000);
  const start = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  if (!$('#logInicio').value) $('#logInicio').value = start;
  if (!$('#logFin').value) $('#logFin').value = end;
}

function loadLogs(id) {
  const table = $('#tblLogs');
  const logs = store.hourLogs
    .filter(log => String(log.taskId) === String(id))
    .sort((a, b) => String(b.start).localeCompare(String(a.start)));

  table.querySelector('thead').innerHTML = '<tr><th>Inicio</th><th>Fin</th><th>Horas</th><th>Avance</th><th>Estado</th></tr>';
  table.querySelector('tbody').innerHTML = logs.length ? logs.map(log => `
    <tr>
      <td data-th="Inicio">${esc(formatDateTime(log.start))}</td>
      <td data-th="Fin">${esc(formatDateTime(log.end))}</td>
      <td data-th="Horas">${fmtHours(log.recognizedHours || log.durationHours)}</td>
      <td data-th="Avance" class="wrap">${esc(log.advanced || '')}</td>
      <td data-th="Estado">${esc(log.state || '')}</td>
    </tr>
  `).join('') : emptyRow(5, 'No hay registros para esta tarea todavía.');
  $('#logStatus').textContent = `${logs.length} registro${logs.length === 1 ? '' : 's'}`;
}

function updateDurationPreview() {
  const hours = durationHours($('#logInicio')?.value, $('#logFin')?.value);
  const preview = $('#durationPreview');
  if (preview) preview.textContent = hours ? `Duración calculada: ${fmtHours(hours)}` : 'Duración: revisa inicio y fin';
}

async function submitLog(event) {
  event.preventDefault();
  const form = $('#logForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const id = $('#logTaskId').value.trim();
  const task = getTaskById(id) || currentTask;
  const start = $('#logInicio').value;
  const end = $('#logFin').value;
  const calculated = durationHours(start, end);
  const recognized = $('#logHorasReconocidas').value ? toNumber($('#logHorasReconocidas').value) : calculated;
  const state = $('#logEstado').value;
  const advanced = $('#logAvanzo').value.trim();
  const missing = $('#logFalta').value.trim();
  const improve = $('#logMejorar').value.trim();
  const workType = $('#logTipoTrabajo').value;

  if (!id) return showFormMessage('Falta el ID de la tarea.', true);
  if (calculated <= 0) return showFormMessage('La fecha de fin debe ser posterior al inicio.', true);
  if (!advanced) return showFormMessage('Describe qué se avanzó.', true);

  const submitButton = $('#logForm button[type="submit"]');
  submitButton.disabled = true;
  showFormMessage('Guardando en Firebase…');

  const log = {
    id: uid('LOG'),
    taskId: id,
    taskTitle: task?.title || $('#logTaskName').textContent.trim(),
    person: task?.person || $('#logTaskPerson').textContent.trim(),
    period: task?.period || todayMonth(),
    start, end,
    durationHours: calculated,
    recognizedHours: recognized,
    workType, state,
    advanced, missing, improve,
    createdAt: new Date().toISOString()
  };

  try {
    await dbSaveHourLog(log);
    store.hourLogs.push(log);
    // Actualiza el estado de la tarea según el último cierre.
    await dbSaveObjective({ id, state });
    const localTask = store.objectives.find(item => String(item.id) === String(id));
    if (localTask) localTask.state = state;

    clearLogFormKeepTask();
    loadLogs(id);
    renderAll();
    showFormMessage('Guardado en Firebase ✔');
  } catch (err) {
    console.error(err);
    showFormMessage(`No se pudo guardar: ${err.message}`, true);
  } finally {
    submitButton.disabled = false;
  }
}

function showFormMessage(message, isError = false) {
  const el = $('#logStatus');
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'status status--error' : 'status';
}

function clearLogFormKeepTask() {
  ['#logInicio', '#logFin', '#logHorasReconocidas', '#logAvanzo', '#logFalta', '#logMejorar'].forEach(sel => {
    if ($(sel)) $(sel).value = '';
  });
  setDefaultLogTimes();
  updateDurationPreview();
}

async function saveEstimate(event) {
  event.preventDefault();
  const id = $('#estimateTaskId').value.trim();
  if (!id) return;

  const patch = {
    id,
    period: $('#estimatePeriod').value || todayMonth(),
    estimatedHours: $('#estimateHours').value ? toNumber($('#estimateHours').value) : 0,
    category: $('#estimateCategory').value || '',
    criteria: $('#estimateCriteria').value.trim()
  };

  try {
    await dbSaveObjective(patch);
    const localTask = store.objectives.find(item => String(item.id) === String(id));
    if (localTask) Object.assign(localTask, patch);
    currentTask = getTaskById(id);
    renderAll();
    showFormMessage('Estimación guardada en Firebase ✔');
  } catch (err) {
    console.error(err);
    showFormMessage(`No se pudo guardar: ${err.message}`, true);
  }
}

async function createObjective(event) {
  event.preventDefault();
  const form = $('#objectiveForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const task = {
    id: uid('OBJ'),
    title: $('#objTitle').value.trim(),
    person: $('#objPerson').value.trim() || inferPerson(),
    period: $('#objPeriod').value || todayMonth(),
    estimatedHours: toNumber($('#objHours').value),
    category: $('#objCategory').value,
    state: $('#objState').value,
    description: $('#objDescription').value.trim(),
    urgency: '',
    dueDate: '',
    createdAt: new Date().toISOString()
  };

  try {
    await dbSaveObjective(task);
    store.objectives.push(task);
    form.reset();
    $('#objPeriod').value = todayMonth();
    $('#objPerson').value = inferPerson();
    hideModal('#modalObjective');
    switchView('bolsa');
    openDetailById(task.id);
  } catch (err) {
    console.error(err);
    alert(`No se pudo crear la tarea en Firebase: ${err.message}`);
  }
}

async function saveBudget(event) {
  event.preventDefault();
  const form = $('#budgetForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const period = $('#budgetPeriod').value;
  const person = $('#budgetPerson').value.trim();
  const hours = toNumber($('#budgetHours').value);
  const note = $('#budgetNote').value.trim();
  const existing = store.budgets.find(budget => budget.period === period && norm(budget.person) === norm(person));

  const budget = existing
    ? { ...existing, hours, note }
    : { id: uid('BOLSA'), period, person, hours, note, createdAt: new Date().toISOString() };

  try {
    await dbSaveBudget(budget);
    if (existing) Object.assign(existing, budget);
    else store.budgets.push(budget);
    renderAll();
    form.reset();
    $('#budgetPeriod').value = period;
    $('#budgetPerson').value = person;
  } catch (err) {
    console.error(err);
    alert(`No se pudo guardar la bolsa en Firebase: ${err.message}`);
  }
}

/* --------------------------- Export / utilidades ----------------------- */
function downloadText(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(headers, rows) {
  return [headers, ...rows].map(row => row.map(csvEscape).join(';')).join('\n');
}

function exportHoursCsv() {
  const headers = ['ID registro', 'ID tarea', 'Tarea', 'Responsable', 'Periodo', 'Inicio', 'Fin', 'Duración horas', 'Horas reconocidas', 'Tipo de trabajo', 'Estado', 'Avance', 'Falta', 'Mejora'];
  const rows = store.hourLogs.map(log => [
    log.id, log.taskId, log.taskTitle, log.person, log.period, log.start, log.end,
    round2(log.durationHours), round2(log.recognizedHours || log.durationHours),
    log.workType, log.state, log.advanced, log.missing, log.improve
  ]);
  downloadText(`bolsa-horas-musicala-${new Date().toISOString().slice(0, 10)}.csv`, rowsToCsv(headers, rows), 'text/csv;charset=utf-8');
}

function exportJson() {
  const payload = { exportedAt: new Date().toISOString(), app: 'Bitácora Musicala · Firebase', teacher: ME, data: store };
  downloadText(`respaldo-bitacora-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}

/* ============================== Eventos =============================== */
function goBackToHub() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'closeAcademicModule' }, '*');
      return;
    }
  } catch (_) { /* cross-origin */ }
  if (history.length > 1) history.back();
}

function applyRoleScope() {
  const back = $('#btnBackHub');
  if (back) back.hidden = !ACADEMIC_CTX.embedded;
  if (isAdminContext()) return; // admin ve y filtra todo

  const me = inferPerson();
  if (!me) return;
  ['#fPersona', '#fBolsaPersona'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.value = me;
    el.dataset.locked = '1';
    el.title = 'Filtrado a tu información';
  });
}

function attachEvents() {
  $$('.tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));

  $('#btnReload')?.addEventListener('click', async () => {
    try { await loadAll(); renderAll(); applyRoleScope(); }
    catch (err) { console.error(err); setStatus(`Error: ${err.message}`, true); }
  });

  $('#btnNewObjective')?.addEventListener('click', () => {
    $('#objectiveForm')?.reset();
    $('#objPeriod').value = todayMonth();
    $('#objPerson').value = inferPerson();
    showModal('#modalObjective');
  });

  $('#fPersona')?.addEventListener('change', renderAll);
  $('#fEstado')?.addEventListener('change', renderAll);
  $('#fUrgencia')?.addEventListener('change', renderAll);
  $('#q')?.addEventListener('input', debounce(renderAll, 180));
  $('#fBolsaPeriodo')?.addEventListener('change', renderAll);
  $('#fBolsaPersona')?.addEventListener('change', renderAll);
  $('#qBolsa')?.addEventListener('input', debounce(renderAll, 180));

  document.addEventListener('click', event => {
    const detail = event.target.closest('.btn-detail');
    if (detail?.dataset?.id) openDetailById(detail.dataset.id);
    if (event.target.dataset.close) hideModal(event.target.closest('.modal') ? `#${event.target.closest('.modal').id}` : null);
  });

  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideModal(); });

  $('#logForm')?.addEventListener('submit', submitLog);
  $('#estimateForm')?.addEventListener('submit', saveEstimate);
  $('#objectiveForm')?.addEventListener('submit', createObjective);
  $('#budgetForm')?.addEventListener('submit', saveBudget);
  $('#btnExportHours')?.addEventListener('click', exportHoursCsv);
  $('#btnExportJson')?.addEventListener('click', exportJson);
  $('#logInicio')?.addEventListener('change', updateDurationPreview);
  $('#logFin')?.addEventListener('change', updateDurationPreview);
  $('#btnBackHub')?.addEventListener('click', goBackToHub);

  // Estos botones eran de la era localStorage; ya no aplican (todo va a Firebase).
  $('#btnClearLocal')?.setAttribute('hidden', '');
  $('#importJson')?.closest('.file-btn')?.setAttribute('hidden', '');
}

async function init() {
  readContextFromUrl();
  attachEvents();
  $('#budgetPeriod').value = todayMonth();
  $('#objPeriod').value = todayMonth();

  // Firebase: reutiliza la sesión del HUB (mismo origen).
  const app = initializeApp(firebaseConfig);
  AUTH = getAuth(app);
  DB = getFirestore(app);

  setStatus('Verificando sesión…');
  onAuthStateChanged(AUTH, async (user) => {
    if (!user) {
      setStatus('No hay sesión activa. Vuelve al HUB e inicia sesión.', true);
      return;
    }
    ME = String(user.email || '').toLowerCase();
    if (!ACADEMIC_CTX.name) ACADEMIC_CTX.name = user.displayName || ME;
    if (!ACADEMIC_CTX.email) ACADEMIC_CTX.email = ME;

    applyBranding();
    $('#budgetPerson').value = inferPerson();
    $('#objPerson').value = inferPerson();

    try {
      await loadAll();
    } catch (err) {
      console.error(err);
      setStatus(`No se pudieron cargar los datos: ${err.message}`, true);
    } finally {
      renderTabs();
      renderAll();
      applyRoleScope();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
