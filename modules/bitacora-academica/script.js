/* Musicala · Bitácora académica Pro (módulo del HUB Docentes)
   ----------------------------------------------------------------------------
   INTEGRACIÓN HUB:
   - Este módulo ya NO es una app por docente. El HUB lo abre (en un iframe)
     pasando ?email=...&name=...&role=... y aquí resolvemos la configuración
     de esa docente desde teachers.js (window.resolveAcademicTeacher).
   - Si la docente tiene `api` (Apps Script), se cargan sus tareas de la hoja;
     si no, funciona en modo LOCAL (objetivos/bolsa/horas en este navegador).
   - localStorage se NAMESPACEA por correo, así varias docentes pueden usar el
     mismo navegador sin mezclar datos.
   - Botón "Volver al HUB": avisa a la ventana padre (postMessage) para cerrar.

   PERSISTENCIA: la capa local sigue en localStorage, aislada por docente y
   lista para migrar a Firestore (ver README.md del módulo). Las tareas de la
   hoja siguen siendo de solo lectura vía Apps Script. */

const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
const norm = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
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

const DEFAULT_CONFIG_FILE = 'config.json';
const LOCAL_KEY_BASE = 'musicala_bitacora_horas_v2';

/* Contexto inyectado por el HUB (o leído de la URL si se abre directo). */
const ACADEMIC_CTX = {
  email: '',
  name: '',
  role: 'Docente',   // 'Docente' | 'Admin'
  embedded: false     // true cuando corre dentro del HUB (iframe)
};

/* localStorage por docente: evita que se mezclen datos de varias docentes. */
function localKey() {
  const suffix = ACADEMIC_CTX.email ? `::${ACADEMIC_CTX.email}` : '';
  return `${LOCAL_KEY_BASE}${suffix}`;
}

/* Lee el contexto desde la URL (?email=&name=&role=&embedded=). */
function readContextFromUrl() {
  const p = new URL(location.href).searchParams;
  ACADEMIC_CTX.email = String(p.get('email') || '').toLowerCase().trim();
  ACADEMIC_CTX.name = String(p.get('name') || '').trim();
  const role = String(p.get('role') || '').trim().toLowerCase();
  ACADEMIC_CTX.role = role === 'admin' ? 'Admin' : 'Docente';
  ACADEMIC_CTX.embedded = p.get('embedded') === '1' || window.parent !== window;
}

function isAdminContext() {
  return ACADEMIC_CTX.role === 'Admin';
}

let CONFIG = null;
let RAW_HEADERS = [];
let RAW_ROWS = [];
let IDX = {};
let currentTask = null;
let activeView = 'resumen';

const store = {
  estimates: {},
  objectives: [],
  budgets: [],
  hourLogs: []
};

function setStatus(message, isError = false) {
  const el = $('#status');
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'status status--error' : 'status';
}

function readStore() {
  try {
    const raw = localStorage.getItem(localKey());
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(store, {
      estimates: parsed.estimates || {},
      objectives: parsed.objectives || [],
      budgets: parsed.budgets || [],
      hourLogs: parsed.hourLogs || []
    });
  } catch (err) {
    console.warn('No se pudo leer localStorage:', err);
  }
}

function saveStore() {
  localStorage.setItem(localKey(), JSON.stringify(store));
}

function emptyRow(colspan = 8, text = 'No hay información para mostrar todavía.') {
  return `<tr><td colspan="${colspan}" class="empty-state">${esc(text)}</td></tr>`;
}

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
  const all = [headers, ...rows];
  return all.map(row => row.map(csvEscape).join(';')).join('\n');
}

function getIndex(...names) {
  for (const name of names) {
    const idx = IDX[norm(name)];
    if (idx != null) return idx;
  }
  return null;
}

function inferPersonFromConfig() {
  // Prioridad: nombre del docente que abrió el módulo (contexto del HUB).
  if (ACADEMIC_CTX.name) return ACADEMIC_CTX.name;
  const text = `${CONFIG?.branding?.title || ''} ${CONFIG?.branding?.subtitle || ''}`;
  const dash = text.split('—').pop()?.trim();
  if (dash && dash.length < 60 && !norm(dash).includes('bitacora')) return dash;
  return '';
}

function getCell(row, ...names) {
  const idx = getIndex(...names);
  return idx != null ? row[idx] : '';
}

function normalizeState(value) {
  const s = norm(value);
  if (!s) return 'Pendiente';
  if (s.startsWith('cumpl') || s.includes('termin') || s.includes('hecha') || s.includes('finaliz')) return 'Cumplido';
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

function getSheetTasks() {
  const iId = getIndex('id', 'ID', 'Código', 'Codigo');
  return RAW_ROWS.map((row, index) => {
    const id = String(iId != null ? row[iId] : `TAREA-${index + 1}`).trim() || `TAREA-${index + 1}`;
    const title = String(getCell(row, 'Tarea', 'Actividad', 'Objetivo', 'Nombre') || `Tarea ${index + 1}`).trim();
    const person = String(getCell(row, 'Persona encargada', 'Responsable', 'Docente', 'Encargado') || inferPersonFromConfig()).trim();
    const state = String(getCell(row, 'Estado', 'Estado tarea') || '').trim();
    const urgency = String(getCell(row, 'Urgencia', 'Prioridad') || '').trim();
    const dueDate = String(getCell(row, 'Fecha límite', 'Fecha limite', 'Fecha entrega', 'Entrega') || '').trim();
    const sheetEstimated = toNumber(getCell(row, 'Horas estimadas', 'Estimado horas', 'Estimación horas', 'Estimacion horas', 'Tiempo estimado'));
    const estimate = store.estimates[id] || {};
    return {
      source: 'sheet',
      id,
      title,
      person,
      state: state || 'Pendiente',
      urgency,
      dueDate,
      raw: row,
      estimatedHours: estimate.hours != null && estimate.hours !== '' ? toNumber(estimate.hours) : sheetEstimated,
      period: estimate.period || todayMonth(),
      category: estimate.category || '',
      criteria: estimate.criteria || '',
      createdAt: '',
      description: String(getCell(row, 'Descripción', 'Descripcion', 'Observaciones', 'Documento y Herramientas') || '').trim()
    };
  });
}

function getAllTasks() {
  const localTasks = store.objectives.map(task => ({
    source: 'local',
    id: task.id,
    title: task.title,
    person: task.person || inferPersonFromConfig(),
    state: task.state || 'Pendiente',
    urgency: task.urgency || '',
    dueDate: task.dueDate || '',
    raw: [],
    estimatedHours: toNumber(task.estimatedHours),
    period: task.period || todayMonth(),
    category: task.category || '',
    criteria: task.description || '',
    createdAt: task.createdAt || '',
    description: task.description || ''
  }));
  return [...getSheetTasks(), ...localTasks];
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
  const query = norm($('#qBolsa')?.value || '');
  return getAllTasks().filter(task => {
    if (period && task.period !== period) return false;
    if (person && task.person !== person) return false;
    if (query && !norm(`${task.id} ${task.title} ${task.person} ${task.category} ${task.description}`).includes(query)) return false;
    return true;
  });
}

async function loadConfig() {
  setStatus('Cargando configuración…');

  // 1) Camino normal: el HUB pasó ?email=. Resolvemos desde teachers.js.
  if (ACADEMIC_CTX.email && typeof window.resolveAcademicTeacher === 'function') {
    const teacher = window.resolveAcademicTeacher(ACADEMIC_CTX.email, ACADEMIC_CTX.name);
    if (!ACADEMIC_CTX.name) ACADEMIC_CTX.name = teacher.name || '';
    CONFIG = teacher.api
      ? { api: teacher.api, dataset: teacher.dataset, branding: { title: `Bitácora Académica · ${teacher.name}` } }
      : null; // sin hoja: modo local
    applyBranding(teacher);
    return;
  }

  // 2) Respaldo: abierto directo con config.json (modo standalone histórico).
  const url = new URL(location.href);
  const confFile = url.searchParams.get('config') || DEFAULT_CONFIG_FILE;
  try {
    const response = await fetch(confFile, { cache: 'no-store' });
    if (response.ok) {
      const json = await response.json();
      if (json?.api?.baseUrl && json?.dataset) {
        CONFIG = json;
        if (CONFIG?.branding?.title) {
          $('#site-title').textContent = CONFIG.branding.title.replace('—', '·');
          document.title = CONFIG.branding.title;
        }
        if (CONFIG?.branding?.subtitle) $('#site-subtitle').textContent = CONFIG.branding.subtitle;
        return;
      }
    }
  } catch (_) { /* sin config.json → modo local */ }

  // 3) Nada configurado: modo local puro.
  CONFIG = null;
}

/* Pinta encabezado/contexto con el docente activo. */
function applyBranding(teacher) {
  document.title = `Bitácora Académica · ${teacher.name || 'Musicala'}`;
  const ctx = $('#site-context');
  if (ctx) {
    const modeTxt = teacher.api ? 'Conectada a hoja de tareas' : 'Modo local (este navegador)';
    ctx.textContent = `${teacher.name || ''}${teacher.name ? ' · ' : ''}${isAdminContext() ? 'Vista coordinación' : 'Docente'} · ${modeTxt}`;
    ctx.hidden = false;
  }
}

async function fetchData() {
  // Modo local: no hay hoja conectada para esta docente.
  if (!CONFIG || !CONFIG.api?.baseUrl) {
    RAW_HEADERS = [];
    RAW_ROWS = [];
    IDX = {};
    setStatus('Modo local: usa “Nueva tarea objetivo” para empezar. (Sin hoja conectada.)');
    return;
  }
  setStatus('Cargando datos…');

  const base = CONFIG.api.baseUrl.replace(/\?+$/, '');
  const keyName = (CONFIG.api.paramName || 'consulta').trim();
  const dataset = encodeURIComponent(CONFIG.dataset);
  const extraQS = CONFIG.api.queryString ? `&${CONFIG.api.queryString.replace(/^\&/, '')}` : '';
  const url = `${base}?${encodeURIComponent(keyName)}=${dataset}${extraQS}`;

  const response = await fetch(url, { cache: 'no-store' });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (err) {
    throw new Error(`Respuesta no-JSON del Web App: ${text.slice(0, 180)}`);
  }
  if (payload.ok === false) throw new Error(payload.error || 'Error backend');

  RAW_HEADERS = payload.headers || [];
  RAW_ROWS = payload.rows || [];
  IDX = {};
  RAW_HEADERS.forEach((header, index) => { IDX[norm(header)] = index; });
  setStatus(`${RAW_ROWS.length} tarea${RAW_ROWS.length === 1 ? '' : 's'} cargada${RAW_ROWS.length === 1 ? '' : 's'}.`);
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
  select.innerHTML = `<option value="">${esc(placeholder)}</option>` + options.map(option => `<option value="${esc(option)}">${esc(option)}</option>`).join('');
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

function filteredSheetRows() {
  const tasks = getSheetTasks();
  const selPerson = $('#fPersona')?.value || '';
  const selState = $('#fEstado')?.value || '';
  const selUrgency = $('#fUrgencia')?.value || '';
  const query = norm($('#q')?.value || '');

  return tasks.filter(task => {
    if (selPerson && task.person !== selPerson) return false;
    if (selState && normalizeState(task.state) !== selState) return false;
    if (selUrgency && task.urgency !== selUrgency) return false;
    if (query && !norm(`${task.id} ${task.title} ${task.person} ${task.state} ${task.urgency} ${task.dueDate} ${task.description} ${task.raw.join(' ')}`).includes(query)) return false;
    return true;
  });
}

function renderMainTable() {
  const thead = $('#tbl thead');
  const tbody = $('#tbl tbody');
  if (!thead || !tbody) return;

  const headers = RAW_HEADERS.length ? RAW_HEADERS : ['ID', 'Tarea', 'Responsable', 'Estado'];
  const rows = filteredSheetRows();

  thead.innerHTML = '<tr>' + headers.map(header => `<th>${esc(header)}</th>`).join('') + '<th>Horas</th><th>Acciones</th></tr>';

  if (!rows.length) {
    tbody.innerHTML = emptyRow(headers.length + 2, 'No encontré tareas con esos filtros. El filtro hizo lo suyo, demasiado bien.');
    return;
  }

  tbody.innerHTML = rows.map(task => {
    const cells = headers.map((header, index) => {
      let value = task.raw[index] ?? '';
      const headerNorm = norm(header);
      if (headerNorm.includes('estado')) value = `<span class="${stateClass(value)}">${esc(normalizeState(value))}</span>`;
      else if (headerNorm.includes('urgencia') || headerNorm.includes('prioridad')) value = `<span class="${urgencyClass(value)}">${esc(value || 'Sin dato')}</span>`;
      else value = esc(value);
      return `<td class="wrap" data-th="${esc(header)}">${value}</td>`;
    }).join('');
    const used = usedHoursForTask(task.id);
    const hours = `<td data-th="Horas"><div class="hours-cell"><strong>${fmtHours(used)}</strong><small>de ${fmtHours(task.estimatedHours)}</small></div></td>`;
    const actions = `<td data-th="Acciones"><button class="btn btn-dark btn-detail" data-id="${esc(task.id)}" type="button">📝 Abrir</button></td>`;
    return `<tr data-id="${esc(task.id)}">${cells}${hours}${actions}</tr>`;
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
    {
      title: 'Tareas activas',
      value: pending.length,
      text: pending.length ? 'Hay trabajo pendiente o en curso. Sirve revisar si todo tiene entregable claro.' : 'No hay tareas activas registradas.'
    },
    {
      title: 'Sin estimación',
      value: withoutEstimate.length,
      text: withoutEstimate.length ? 'Estas son las candidatas a conversación: “¿cuánto tiempo reconocemos por esto?”' : 'Todas las tareas visibles tienen una estimación.'
    },
    {
      title: 'Horas usadas vs. estimadas',
      value: `${fmtHours(used)} / ${fmtHours(estimated)}`,
      text: used > estimated && estimated > 0 ? 'El uso superó lo estimado. No es tragedia griega, pero sí pide ajuste.' : 'El uso todavía está dentro de lo planeado o falta estimar más tareas.'
    },
    {
      title: 'Tareas pasadas de horas',
      value: overBudgetTasks.length,
      text: overBudgetTasks.length ? 'Conviene revisar si hubo retrabajo, mala estimación o una tarea mutante.' : 'No hay tareas por encima de su estimado local.'
    }
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
  `).join('') : emptyRow(5, 'Todas las tareas visibles tienen estimación. Raro, pero hermoso.');
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

  const budgetRows = totals.budgets.length ? totals.budgets.map(budget => `
    <div class="balance-row">
      <div><strong>${esc(budget.person)}</strong><small>${esc(budget.period)} · ${esc(budget.note || 'Sin nota')}</small></div>
      <span>${fmtHours(budget.hours)}</span>
    </div>
  `).join('') : '<p class="helper-text">Crea una bolsa de horas para empezar a comparar acuerdo vs. uso real.</p>';

  balance.innerHTML = budgetRows;
}

function renderObjectivesTable() {
  const table = $('#tblObjectives');
  if (!table) return;
  const tasks = getSelectedObjectiveTasks();
  table.querySelector('thead').innerHTML = '<tr><th>ID</th><th>Tarea / objetivo</th><th>Responsable</th><th>Periodo</th><th>Categoría</th><th>Estimado</th><th>Usado</th><th>Estado</th><th>Acción</th></tr>';

  if (!tasks.length) {
    table.querySelector('tbody').innerHTML = emptyRow(9, 'No hay tareas en esta bolsa. La bolsa existe, pero está filosofando sola.');
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
  table.querySelector('thead').innerHTML = '<tr><th>Fecha</th><th>Tarea</th><th>Responsable</th><th>Tipo</th><th>Duración</th><th>Reconocidas</th><th>Avance</th><th>Sync</th></tr>';
  const logs = [...store.hourLogs].sort((a, b) => String(b.start).localeCompare(String(a.start)));
  if (!logs.length) {
    table.querySelector('tbody').innerHTML = emptyRow(8, 'Todavía no hay horas registradas. La bolsa está intacta, casi inocente.');
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
      <td data-th="Sync"><span class="pill ${log.backendSynced ? 'pill--ok' : 'pill--neutral'}">${log.backendSynced ? 'Backend' : 'Local'}</span></td>
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
  $('#logStatus') && ($('#logStatus').textContent = '');
}

async function openDetailById(id) {
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
  await loadLogs(task.id, task.source);
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

async function loadLogs(id, source = 'sheet') {
  const table = $('#tblLogs');
  const localLogs = store.hourLogs.filter(log => String(log.taskId) === String(id));

  let backendHeaders = [];
  let backendRows = [];
  let backendError = '';

  if (source === 'sheet' && CONFIG?.api?.baseUrl) {
    try {
      const base = CONFIG.api.baseUrl.replace(/\?+$/, '');
      const keyName = (CONFIG.api.paramName || 'consulta').trim();
      const url = `${base}?${encodeURIComponent(keyName)}=logs_tarea&id=${encodeURIComponent(id)}`;
      const response = await fetch(url, { cache: 'no-store' });
      const text = await response.text();
      const payload = JSON.parse(text);
      if (payload.ok === false) throw new Error(payload.error || 'Error backend');
      backendHeaders = payload.headers || [];
      backendRows = payload.rows || [];
    } catch (err) {
      backendError = err.message;
    }
  }

  const headers = backendHeaders.length ? [...backendHeaders, 'Origen'] : ['Inicio', 'Fin', 'Horas', 'Avance', 'Estado', 'Origen'];
  table.querySelector('thead').innerHTML = '<tr>' + headers.map(header => `<th>${esc(header)}</th>`).join('') + '</tr>';

  const backendHtml = backendRows.map(row => `<tr>${backendHeaders.map((header, index) => `<td class="wrap" data-th="${esc(header)}">${esc(row[index])}</td>`).join('')}<td data-th="Origen"><span class="pill pill--ok">Backend</span></td></tr>`).join('');

  const localHtml = localLogs.map(log => `
    <tr>
      <td data-th="Inicio">${esc(formatDateTime(log.start))}</td>
      <td data-th="Fin">${esc(formatDateTime(log.end))}</td>
      <td data-th="Horas">${fmtHours(log.recognizedHours || log.durationHours)}</td>
      <td data-th="Avance" class="wrap">${esc(log.advanced || '')}</td>
      <td data-th="Estado">${esc(log.state || '')}</td>
      <td data-th="Origen"><span class="pill ${log.backendSynced ? 'pill--ok' : 'pill--neutral'}">${log.backendSynced ? 'Backend + local' : 'Local'}</span></td>
    </tr>
  `).join('');

  table.querySelector('tbody').innerHTML = backendHtml + localHtml || emptyRow(headers.length, 'No hay registros para esta tarea todavía. Hora de producir evidencia, ese ritual moderno.');
  $('#logStatus').textContent = backendError
    ? `Registros locales: ${localLogs.length}. Backend no disponible: ${backendError}`
    : `${backendRows.length + localLogs.length} registro${backendRows.length + localLogs.length === 1 ? '' : 's'}`;
}

function updateDurationPreview() {
  const start = $('#logInicio')?.value;
  const end = $('#logFin')?.value;
  const hours = durationHours(start, end);
  const preview = $('#durationPreview');
  if (preview) preview.textContent = hours ? `Duración calculada: ${fmtHours(hours)}` : 'Duración: revisa inicio y fin';
}

async function submitLog(event) {
  event.preventDefault();
  const form = $('#logForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const id = $('#logTaskId').value.trim();
  const source = $('#logTaskSource').value || 'sheet';
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
  if (!advanced) return showFormMessage('Describe qué se avanzó. El misterio está sobrevalorado.', true);

  const submitButton = $('#logForm button[type="submit"]');
  submitButton.disabled = true;
  showFormMessage('Guardando registro…');

  let backendSynced = false;
  let backendError = '';

  if (source === 'sheet' && CONFIG?.api?.baseUrl) {
    try {
      const body = new URLSearchParams({
        action: 'add_log',
        id,
        tarea: task?.title || $('#logTaskName').textContent.trim(),
        inicio: start,
        fin: end,
        avanzo: advanced,
        falta: missing,
        mejorar: improve,
        estado: state,
        horasReconocidas: String(recognized),
        tipoTrabajo: workType
      });
      const response = await fetch(CONFIG.api.baseUrl.replace(/\?+$/, ''), { method: 'POST', body });
      const text = await response.text();
      const payload = JSON.parse(text);
      if (payload.ok === false) throw new Error(payload.error || 'Error backend');
      backendSynced = true;
    } catch (err) {
      backendError = err.message;
    }
  }

  store.hourLogs.push({
    id: uid('LOG'),
    taskId: id,
    taskTitle: task?.title || $('#logTaskName').textContent.trim(),
    person: task?.person || $('#logTaskPerson').textContent.trim(),
    period: task?.period || todayMonth(),
    source,
    start,
    end,
    durationHours: calculated,
    recognizedHours: recognized,
    workType,
    state,
    advanced,
    missing,
    improve,
    backendSynced,
    backendError,
    createdAt: new Date().toISOString()
  });

  if (source === 'local') updateLocalTaskState(id, state);
  saveStore();
  clearLogFormKeepTask();
  await loadLogs(id, source);
  renderAll();
  showFormMessage(backendSynced ? 'Guardado y sincronizado ✔' : (backendError ? `Guardado localmente. Backend no sincronizó: ${backendError}` : 'Guardado localmente ✔'), Boolean(backendError));
  submitButton.disabled = false;
}

function showFormMessage(message, isError = false) {
  const el = $('#logStatus');
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'status status--error' : 'status';
}

function clearLogFormKeepTask() {
  $('#logInicio').value = '';
  $('#logFin').value = '';
  $('#logHorasReconocidas').value = '';
  $('#logAvanzo').value = '';
  $('#logFalta').value = '';
  $('#logMejorar').value = '';
  setDefaultLogTimes();
  updateDurationPreview();
}

function updateLocalTaskState(id, state) {
  const task = store.objectives.find(item => String(item.id) === String(id));
  if (task) task.state = state;
}

function saveEstimate(event) {
  event.preventDefault();
  const id = $('#estimateTaskId').value.trim();
  if (!id) return;

  const task = getTaskById(id);
  const data = {
    period: $('#estimatePeriod').value || todayMonth(),
    hours: $('#estimateHours').value ? toNumber($('#estimateHours').value) : 0,
    category: $('#estimateCategory').value || '',
    criteria: $('#estimateCriteria').value.trim(),
    updatedAt: new Date().toISOString()
  };

  if (task?.source === 'local') {
    const localTask = store.objectives.find(item => String(item.id) === String(id));
    if (localTask) {
      localTask.period = data.period;
      localTask.estimatedHours = data.hours;
      localTask.category = data.category;
      localTask.description = data.criteria || localTask.description;
    }
  } else {
    store.estimates[id] = data;
  }

  saveStore();
  currentTask = getTaskById(id);
  renderAll();
  showFormMessage('Estimación guardada ✔');
}

function createObjective(event) {
  event.preventDefault();
  const form = $('#objectiveForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const task = {
    id: uid('OBJ'),
    title: $('#objTitle').value.trim(),
    person: $('#objPerson').value.trim() || inferPersonFromConfig(),
    period: $('#objPeriod').value || todayMonth(),
    estimatedHours: toNumber($('#objHours').value),
    category: $('#objCategory').value,
    state: $('#objState').value,
    description: $('#objDescription').value.trim(),
    createdAt: new Date().toISOString()
  };

  store.objectives.push(task);
  saveStore();
  form.reset();
  $('#objPeriod').value = todayMonth();
  $('#objPerson').value = inferPersonFromConfig();
  hideModal('#modalObjective');
  switchView('bolsa');
  openDetailById(task.id);
}

function saveBudget(event) {
  event.preventDefault();
  const form = $('#budgetForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const period = $('#budgetPeriod').value;
  const person = $('#budgetPerson').value.trim();
  const hours = toNumber($('#budgetHours').value);
  const note = $('#budgetNote').value.trim();
  const existing = store.budgets.find(budget => budget.period === period && norm(budget.person) === norm(person));

  if (existing) {
    existing.hours = hours;
    existing.note = note;
    existing.updatedAt = new Date().toISOString();
  } else {
    store.budgets.push({ id: uid('BOLSA'), period, person, hours, note, createdAt: new Date().toISOString() });
  }

  saveStore();
  renderAll();
  form.reset();
  $('#budgetPeriod').value = period;
  $('#budgetPerson').value = person;
}

function exportHoursCsv() {
  const headers = ['ID registro', 'ID tarea', 'Tarea', 'Responsable', 'Periodo', 'Inicio', 'Fin', 'Duración horas', 'Horas reconocidas', 'Tipo de trabajo', 'Estado', 'Avance', 'Falta', 'Mejora', 'Origen', 'Sincronizado backend'];
  const rows = store.hourLogs.map(log => [
    log.id,
    log.taskId,
    log.taskTitle,
    log.person,
    log.period,
    log.start,
    log.end,
    round2(log.durationHours),
    round2(log.recognizedHours || log.durationHours),
    log.workType,
    log.state,
    log.advanced,
    log.missing,
    log.improve,
    log.source,
    log.backendSynced ? 'Sí' : 'No'
  ]);
  downloadText(`bolsa-horas-musicala-${new Date().toISOString().slice(0, 10)}.csv`, rowsToCsv(headers, rows), 'text/csv;charset=utf-8');
}

function exportJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'Bitácora Musicala · Bolsa de horas',
    data: store
  };
  downloadText(`respaldo-bitacora-horas-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const data = parsed.data || parsed;
      if (!data || typeof data !== 'object') throw new Error('Archivo inválido');
      store.estimates = data.estimates || {};
      store.objectives = data.objectives || [];
      store.budgets = data.budgets || [];
      store.hourLogs = data.hourLogs || [];
      saveStore();
      renderAll();
      setStatus('Respaldo importado correctamente.');
    } catch (err) {
      setStatus(`No pude importar el respaldo: ${err.message}`, true);
    }
  };
  reader.readAsText(file);
}

function clearLocalData() {
  const ok = confirm('Esto borra estimaciones, bolsas y registros locales de horas en este navegador. Las tareas de Google Sheets no se borran. ¿Continuar?');
  if (!ok) return;
  store.estimates = {};
  store.objectives = [];
  store.budgets = [];
  store.hourLogs = [];
  saveStore();
  renderAll();
}

function attachEvents() {
  $$('.tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));

  $('#btnReload')?.addEventListener('click', async () => {
    try {
      await fetchData();
      renderAll();
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`, true);
    }
  });

  $('#btnNewObjective')?.addEventListener('click', () => {
    $('#objectiveForm')?.reset();
    $('#objPeriod').value = todayMonth();
    $('#objPerson').value = inferPersonFromConfig();
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

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideModal();
  });

  $('#logForm')?.addEventListener('submit', submitLog);
  $('#estimateForm')?.addEventListener('submit', saveEstimate);
  $('#objectiveForm')?.addEventListener('submit', createObjective);
  $('#budgetForm')?.addEventListener('submit', saveBudget);
  $('#btnExportHours')?.addEventListener('click', exportHoursCsv);
  $('#btnExportJson')?.addEventListener('click', exportJson);
  $('#btnClearLocal')?.addEventListener('click', clearLocalData);
  $('#importJson')?.addEventListener('change', event => importJson(event.target.files?.[0]));
  $('#logInicio')?.addEventListener('change', updateDurationPreview);
  $('#logFin')?.addEventListener('change', updateDurationPreview);

  // Volver al HUB: si está embebido, avisa al padre; si no, intenta history.back.
  $('#btnBackHub')?.addEventListener('click', goBackToHub);
}

function goBackToHub() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'closeAcademicModule' }, '*');
      return;
    }
  } catch (_) { /* cross-origin: ignore */ }
  if (history.length > 1) history.back();
}

/* Bloquea el filtro de responsable a la docente activa (los docentes solo ven
   lo suyo). La coordinación (Admin) sí puede ver y filtrar a todas. */
function applyRoleScope() {
  const back = $('#btnBackHub');
  if (back) back.hidden = !ACADEMIC_CTX.embedded;

  if (isAdminContext()) return; // admin ve todo

  const me = ACADEMIC_CTX.name || inferPersonFromConfig();
  if (!me) return;
  ['#fPersona', '#fBolsaPersona'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.value = me;
    el.dataset.locked = '1';
    el.title = 'Filtrado a tu información';
  });
  // Si intentan cambiarlo, lo regresamos a la docente.
  document.addEventListener('change', (e) => {
    if (!isAdminContext() && e.target?.dataset?.locked === '1' && e.target.value !== me) {
      e.target.value = me;
      renderAll();
    }
  });
}

async function init() {
  readContextFromUrl();
  readStore();
  attachEvents();
  $('#budgetPeriod').value = todayMonth();
  $('#budgetPerson').value = inferPersonFromConfig();
  $('#objPeriod').value = todayMonth();

  try {
    await loadConfig();
    $('#budgetPerson').value = inferPersonFromConfig();
    $('#objPerson').value = inferPersonFromConfig();
    await fetchData();
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`, true);
  } finally {
    renderTabs();
    renderAll();
    applyRoleScope();
  }
}

document.addEventListener('DOMContentLoaded', init);
