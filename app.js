/* Musicala · Docentes Hub
   - Login con Google (Firebase Auth)
   - Hub exclusivo para Docentes (lista blanca por correo)
   - Links generales + links personalizados por usuario
   - Carnet abre modal (imagen en /assets/*.png)
   - Drawer lateral: perfil + accesos rápidos + logout
   - PWA con instalación + SW update banner
   - Horario anual 2026 personalizado por docente
   - Bitácoras de clase pendientes con link individual por docente
   - Bitácora de tareas académicas con link individual por docente
   - Bitácora de clases (nueva versión)
*/

const BUILD = "2026-05-28.1";

const ADMIN_EMAILS = [
  "alekcaballeromusic@gmail.com",
  "catalina.medina.leal@gmail.com"
];

/* ============================================================================
   1) FIREBASE CONFIG
============================================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyC06dLl2Lig3-kD4OVmh4C9LpFW9AeTyOc",
  authDomain: "musicala-docentes-hub.firebaseapp.com",
  projectId: "musicala-docentes-hub",
  storageBucket: "musicala-docentes-hub.firebasestorage.app",
  messagingSenderId: "936379833270",
  appId: "1:936379833270:web:512519cf318c919e3abf17"
};

/* ============================================================================
   2) CONFIG DOCENTES HUB
============================================================================ */
const HUB = {
  name: "Docentes · Musicala",

  GENERAL_LINKS: {
    salones: "https://musicala.github.io/asignaciondesalones/",
    nomina: "https://docs.google.com/forms/d/e/1FAIpQLSeMOhoY9d8JOf1Oq8DnD_aSEDkBmOXmzYJtlCCU-7CNVYjnLA/viewform",
    observacion: "https://docs.google.com/forms/d/1z8TEQACP6L8d0vTWEpSl2RQJ198PwQwzH4-UKqq9EQA/viewform?edit_requested=true",
    induccion: "https://musicalaescuela.github.io/inducciondocentesmusicala/",
    infoEstudiantes: "https://musicalaescuela.github.io/verificaci-nestudiantes/",
    jornada: "__INTERNAL_TEACHER_SHIFT__",
    muestras: "https://musicalaescuela.github.io/muestrasdeproceso/#musica",
    guiones: "https://musicalaescuela.github.io/plantillaparaguiones/",
    protocolosMusica: "https://musicalaescuela.github.io/protocolosmusica/",
    vacaciones: "https://musicalaescuela.github.io/vacacionesartisticas/",
    explicacionArtes: "https://musicala.github.io/explicacionartes/",
    edades: "https://musicala.github.io/musiedades/",
    reglamento: "https://drive.google.com/file/d/1Oda0c_FnHrsgME2GE8LCb7z5huH-YbBk/view",
    musicalaFest: "https://musicalaescuela.github.io/programamusicalafest2025/",
    bitacoraClases: "https://musicalaescuela.github.io/registrodeclasemusicala/",
    bitacoraClasesNueva: "https://musicalaescuela.github.io/bitacoradeclase/",
    musigym: "https://musicalaescuela.github.io/musigymtraininghub/",

    // Por defecto vacíos para que aparezcan como "Pendiente"
    calendario: "",
    bitacorasClasePendientes: "",
    bitacoraAcademica: "",
    documentosContratacion: "",
    horarioAnual: ""
  },

  USERS: {
    "alekcaballeromusic@gmail.com": {
      label: "Alek Caballero",
      carnet: "./assets/alekcaballero.png",
      links: {
        horarioAnual: "https://musicala.github.io/horario2026emilybejarano/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareasCata/",
        bitacoraAcademica: ""
      }
    },

    "catalina.medina.leal@gmail.com": {
      label: "Catalina Medina",
      carnet: "./assets/catalinamedina.png",
      links: {
        horarioAnual: "https://musicala.github.io/horario2026emilybejarano/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareasCata/",
        bitacoraAcademica: ""
      }
    },

    "emilybg0102@gmail.com": {
      label: "Emily Bejarano",
      carnet: "./assets/emilybejarano.png",
      // academica: habilita el módulo interno "Bitácora Académica" del HUB.
      // El endpoint/datos de cada docente vive en
      // modules/bitacora-academica/teachers.js (no se duplica la app).
      academica: true,
      links: {
        horarioAnual: "https://musicala.github.io/horario2026emilybejarano/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareasCata/",
        bitacoraAcademica: "https://musicala.github.io/bitacoratareasemilybejarano/"
      }
    },

    "annitolad@gmail.com": {
      label: "Angie Nitola",
      carnet: "./assets/angienitola.png",
      links: {
        horarioAnual: "https://musicala.github.io/horario2026angienitola/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareasCata/",
        bitacoraAcademica: "https://musicala.github.io/bitacoratareasangienitola/"
      }
    },

    "lorenaduarte.404@gmail.com": {
      label: "Laura Sánchez",
      carnet: "./assets/laurasanchez.png",
      links: {
        horarioAnual: "https://musicala.github.io/horario2026laurasanchez/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareas1/",
        bitacoraAcademica: "https://musicala.github.io/bitacoradetareaslaurasanchez/"
      }
    },

    "malego2709@gmail.com": {
      label: "María Alejandra Gómez",
      carnet: "",
      links: {}
    },

    "bagutierrezm@gmail.com": {
      label: "Brian Alexander Gutiérrez",
      carnet: "",
      links: {}
    },

    "darasaxcifuentes@gmail.com": {
      label: "Dara Natalia Cifuentes Rojas",
      carnet: "",
      links: {}
    }
  },

  BUTTONS: [
    { id: "carnet", icon: "🪪", title: "Carnet docente", subtitle: "Personal", section: "Mi trabajo hoy" },
    { id: "jornada", icon: "⏱️", title: "Registro de jornada", subtitle: "Diario", section: "Mi trabajo hoy" },
    { id: "salones", icon: "🏫", title: "Asignación de salones", subtitle: "Sede", section: "Mi trabajo hoy" },
    { id: "infoEstudiantes", icon: "🧒", title: "Info estudiantes", subtitle: "Verificación", section: "Mi trabajo hoy" },
    { id: "horarioAnual", icon: "📅", title: "Horario anual 2026", subtitle: "Solo tu horario", section: "Mi trabajo hoy" },

    {
      id: "bitacorasClasePendientes",
      icon: "📝",
      title: "Bitácoras de clase pendientes",
      subtitle: "Individual",
      section: "Gestión docente",
      showWhenMissing: true
    },
    {
      id: "observacion",
      icon: "👀",
      title: "Formulario observación docente",
      subtitle: "Registro",
      section: "Gestión docente"
    },
    {
      id: "bitacoraClases",
      icon: "📒",
      title: "Bitácora de clases",
      subtitle: "Seguimiento",
      section: "Gestión docente"
    },
    {
      id: "bitacoraClasesNueva",
      icon: "✨",
      title: "Bitácora de clases (nueva versión)",
      subtitle: "Seguimiento actualizado",
      section: "Gestión docente"
    },
    {
      id: "bitacoraAcademica",
      icon: "✅",
      title: "Bitácora tareas académicas",
      subtitle: "Pendientes",
      section: "Gestión docente",
      showWhenMissing: true
    },
    {
      // Módulo interno (no abre app externa): Bitácora Académica / Trabajo por objetivos.
      id: "academicModule",
      icon: "🎯",
      title: "Bitácora Académica",
      subtitle: "Trabajo por objetivos",
      section: "Gestión docente"
    },

    { id: "induccion", icon: "🎓", title: "Inducción Docentes Musicala", subtitle: "Onboarding", section: "Recursos" },
    { id: "protocolosMusica", icon: "🎵", title: "Protocolos clases de música", subtitle: "Guía", section: "Recursos" },
    { id: "muestras", icon: "🎭", title: "Info Muestras de proceso", subtitle: "Planeación", section: "Recursos" },
    { id: "guiones", icon: "🎬", title: "Plantilla guiones de video", subtitle: "Contenido", section: "Recursos" },
    { id: "explicacionArtes", icon: "🧩", title: "Explicación de las artes", subtitle: "Oferta", section: "Recursos" },
    { id: "edades", icon: "📏", title: "Rangos de edades", subtitle: "Guía rápida", section: "Recursos" },
    { id: "musigym", icon: "🏋️", title: "MusiGym Training Hub", subtitle: "Entrenamiento", section: "Recursos" },

    { id: "nomina", icon: "💰", title: "Novedades nómina", subtitle: "General", section: "Institucional" },
    { id: "calendario", icon: "🗓️", title: "Calendario Académico", subtitle: "General", section: "Institucional", showWhenMissing: true },
    { id: "reglamento", icon: "📜", title: "Reglamento interno de trabajo", subtitle: "Documento", section: "Institucional" },
    { id: "documentosContratacion", icon: "📁", title: "Documentos de contratación", subtitle: "Carpeta", section: "Institucional", showWhenMissing: true },
    { id: "vacaciones", icon: "🌞", title: "Info Vacaciones artísticas", subtitle: "General", section: "Institucional" },
    { id: "musicalaFest", icon: "🎸", title: "Musicala Fest 2025", subtitle: "Programa", section: "Institucional" },

    { id: "adminPanel", icon: "🛠️", title: "Panel admin", subtitle: "Solo administradores", section: "Administración", adminOnly: true }
  ]
};

/* ============================================================================
   3) FIREBASE SDK (CDN MODULAR)
============================================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* ============================================================================
   4) HELPERS BASE
============================================================================ */
const $ = (selector, root = document) => root?.querySelector?.(selector) || null;
const $$ = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);

const APP_STATE = {
  activeLinks: {},
  activeProfile: null,
  activeUser: null,
  db: null,
  teacherShiftStatus: {
    open: false,
    record: null
  }
};

const TEACHER_SITE_QR_ARRIVAL = "ADM-LLEGADA";
const TEACHER_SITE_QR_EXIT = "ADM-SALIDA";
const TEACHER_SITE_QR_LUNCH = [
  "ADM-ALMUERZO-INICIO",
  "ADM-ALMUERZO-FIN"
];
const TEACHER_SHIFT_EMAIL_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzDNyxzjieDdAdX8UyzXVTdGFWPj4JEJ6Q3OtKHjMqCI0QlDyak3ZEW49LYDm6ANUVSKA/exec";
const TEACHER_SHIFT_NOTIFY_EXITS = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeQrValue(value) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function emailKey(user) {
  return String(user?.email || "").toLowerCase().trim();
}

function prettyName(user, fallbackEmail = "") {
  const name = String(user?.displayName || "").trim();
  const email = String(user?.email || fallbackEmail || "").trim();
  return name || email || "Sesión activa";
}

function getButtonMeta(buttonId) {
  return HUB.BUTTONS.find((button) => button.id === buttonId) || null;
}

function getButtonTitle(buttonId) {
  return getButtonMeta(buttonId)?.title || buttonId || "este acceso";
}

function hasUserRestrictions() {
  return !!(HUB.USERS && Object.keys(HUB.USERS).length > 0);
}

function buildLinksForUser(email) {
  const base = { ...(HUB.GENERAL_LINKS || {}) };
  const profile = HUB.USERS?.[email] || null;
  const overrides = profile?.links || {};
  return { ...base, ...overrides };
}

function assertConfig(config) {
  const isInvalid =
    !config ||
    !config.apiKey ||
    !config.authDomain ||
    !config.projectId ||
    !config.appId;

  if (isInvalid) {
    console.warn("Firebase config incompleto. Revisa firebaseConfig en app.js");
    return false;
  }

  return true;
}

/* ============================================================================
   5) TOAST
============================================================================ */
let toastTimer = null;

function pickToastEl() {
  const toastApp = $("#toast-app");
  const toastFallback = $("#toast");
  if (toastApp && !toastApp.hidden) return toastApp;
  return toastFallback || toastApp || null;
}

function toast(message, options = {}) {
  const el = pickToastEl();
  if (!el) return;

  const {
    actionText = "",
    onAction = null,
    sticky = false,
    ms = 2600
  } = options;

  el.classList.remove("show");
  el.hidden = false;
  el.innerHTML = "";

  const msgSpan = document.createElement("span");
  msgSpan.className = "toastMsg";
  msgSpan.textContent = String(message ?? "");
  el.appendChild(msgSpan);

  if (actionText) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "toastBtn";
    button.textContent = actionText;
    button.addEventListener("click", () => {
      try {
        onAction?.();
      } finally {
        el.classList.remove("show");
      }
    });
    el.appendChild(button);
  }

  requestAnimationFrame(() => el.classList.add("show"));

  clearTimeout(toastTimer);
  if (!sticky) {
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      if (el.id === "toast-app") {
        el.hidden = true;
      }
    }, Math.max(1200, Number(ms) || 2600));
  }
}

function setButtonBusy(button, busy, busyLabel = "Procesando...") {
  if (!button) return;
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent || "";
  }

  button.disabled = !!busy;
  button.setAttribute("aria-busy", busy ? "true" : "false");
  button.textContent = busy ? busyLabel : button.dataset.originalText;
}

/* ============================================================================
   6) VISTAS
============================================================================ */
function show(which) {
  const loginView = $("#view-login");
  const appView = $("#view-app");
  if (!loginView || !appView) return;

  if (which === "login") {
    loginView.hidden = false;
    appView.hidden = true;

    const toastApp = $("#toast-app");
    if (toastApp) toastApp.hidden = true;
  } else {
    loginView.hidden = true;
    appView.hidden = false;
  }
}

/* ============================================================================
   7) URL SAFETY
============================================================================ */
function normalizeUrl(raw) {
  const url = String(raw || "").trim();
  if (!url) return "";

  if (/^\s*javascript:/i.test(url)) return "";
  if (/^\s*data:/i.test(url)) return "";
  if (/^(https?:)?\/\//i.test(url)) return url;

  return `https://${url}`;
}

function openExternal(rawUrl) {
  const safeUrl = normalizeUrl(rawUrl);
  if (!safeUrl) return false;
  window.open(safeUrl, "_blank", "noopener,noreferrer");
  return true;
}

/* ============================================================================
   8) PWA
============================================================================ */
let deferredInstallPrompt = null;

function isIOS() {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua);
}

function isStandalone() {
  if (window.navigator.standalone) return true;
  return !!(
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function setInstallUI(visible) {
  const btn1 = $("#btn-install");
  const btn2 = $("#btn-install-2");
  if (btn1) btn1.hidden = !visible;
  if (btn2) btn2.hidden = !visible;
}

async function trySkipWaiting() {
  try {
    const registration = await navigator.serviceWorker.getRegistration("./");
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      return true;
    }
  } catch (_) {}
  return false;
}

function wireUpdateBanner() {
  const wrap = $("#pwa-update");
  const btn = $("#btn-update");
  if (!wrap || !btn) return;

  btn.addEventListener("click", async () => {
    const ok = await trySkipWaiting();
    if (!ok) {
      toast("No hay actualización lista aún 🙃");
    }
  });

  const maybeShow = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration("./");
      if (registration?.waiting) {
        wrap.hidden = false;
      }
    } catch (_) {}
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event?.data?.type === "SW_ACTIVATED") {
        wrap.hidden = true;
      }
    });
    maybeShow();
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  // Aplica la actualización automáticamente. Si hay un SW "waiting",
  // le pedimos que tome el control de inmediato (sin que la docente toque nada).
  // Se deja el banner/toast solo como respaldo por si el auto-update no aplica.
  const applyUpdate = (registration) => {
    if (!registration?.waiting) return;
    try {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } catch (error) {
      console.warn("No se pudo activar update automáticamente", error);
      // Respaldo: mostramos el banner para que pueda forzar la actualización.
      const wrap = $("#pwa-update");
      if (wrap) wrap.hidden = false;
    }
  };

  try {
    const registration = await navigator.serviceWorker.register("./sw.js", {
      scope: "./"
    });

    applyUpdate(registration);

    registration.addEventListener("updatefound", () => {
      const sw = registration.installing;
      if (!sw) return;

      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          applyUpdate(registration);
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (window.__reloadingForSW) return;
      window.__reloadingForSW = true;
      window.location.reload();
    });

    // Chequeos de actualización: al cargar, al volver a la app y cada 60s.
    const checkForUpdate = () => registration.update?.().catch(() => null);
    checkForUpdate();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdate();
    });
    window.addEventListener("focus", checkForUpdate);
    setInterval(checkForUpdate, 60 * 1000);
  } catch (error) {
    console.warn("SW no se pudo registrar", error);
  }
}

function setupInstallPrompt() {
  if (isStandalone()) {
    setInstallUI(false);
    return;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setInstallUI(true);
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    setInstallUI(false);
    toast("Instalada ✨");
  });

  const onInstallClick = async () => {
    if (isIOS() && !deferredInstallPrompt) {
      toast("En iPhone/iPad: Compartir → Agregar a pantalla de inicio");
      return;
    }

    if (!deferredInstallPrompt) {
      toast("Instalación no disponible todavía. Abre en Chrome o Safari.");
      return;
    }

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;

    if (!choice || choice.outcome !== "accepted") {
      setInstallUI(false);
      setTimeout(() => setInstallUI(true), 8000);
    }
  };

  $("#btn-install")?.addEventListener("click", onInstallClick);
  $("#btn-install-2")?.addEventListener("click", onInstallClick);
}

/* ============================================================================
   9) DRAWER
============================================================================ */
let drawerBound = false;

function drawerEls() {
  return {
    btnMenu: $("#btn-menu"),
    overlay: $("#drawer-overlay"),
    drawer: $("#app-drawer"),
    btnClose: $("#drawer-close"),
    userName: $("#drawer-user-name"),
    userEmail: $("#drawer-user-email"),
    buildTag: $("#drawer-build")
  };
}

function isDrawerOpen() {
  const { overlay, drawer } = drawerEls();
  if (!overlay || !drawer) return false;
  return !overlay.hidden && !drawer.hidden;
}

function openDrawer() {
  const { overlay, drawer, btnClose } = drawerEls();
  if (!overlay || !drawer) return;

  overlay.hidden = false;
  drawer.hidden = false;
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    (btnClose || drawer).focus?.();
  }, 0);
}

function closeDrawer() {
  const { overlay, drawer, btnMenu } = drawerEls();
  if (!overlay || !drawer) return;

  overlay.hidden = true;
  drawer.hidden = true;
  document.body.style.overflow = "";

  setTimeout(() => {
    btnMenu?.focus?.();
  }, 0);
}

function toggleDrawer() {
  if (isDrawerOpen()) closeDrawer();
  else openDrawer();
}

function setDrawerProfile(profile, user) {
  const { userName, userEmail, buildTag } = drawerEls();
  if (userName) userName.textContent = profile?.label || user?.displayName || "Docente";
  if (userEmail) userEmail.textContent = String(user?.email || "").trim() || "—";
  if (buildTag) buildTag.textContent = `BUILD ${BUILD}`;
}

function wireDrawerHandlers(auth) {
  if (drawerBound) return;
  drawerBound = true;

  const { btnMenu, overlay, drawer, btnClose } = drawerEls();
  if (!overlay || !drawer) return;

  btnMenu?.addEventListener("click", toggleDrawer);
  btnClose?.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isDrawerOpen()) {
      closeDrawer();
    }
  });

  drawer.addEventListener(
    "click",
    async (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;

      const action = String(button.getAttribute("data-action") || "").trim();
      if (!action) return;

      closeDrawer();

      if (action === "logout") {
        await doLogout(auth);
        return;
      }

      if (action === "install") {
        const installBtn = $("#btn-install-2") || $("#btn-install");
        installBtn?.click?.();
        return;
      }

      if (/^open:/i.test(action)) {
        const id = action.split(":")[1] || "";
        if (!id) return;
        handleButtonAction(id);
        return;
      }

      const href = button.getAttribute("data-href");
      if (href && !openExternal(href)) {
        toast("Ese link está raro y lo bloqueé 😶‍🌫️");
      }
    },
    { passive: true }
  );
}

/* ============================================================================
   10) MODAL CARNET
============================================================================ */
let carnetModal = null;

function ensureCarnetModal() {
  if (carnetModal) return carnetModal;

  const modal = document.createElement("div");
  modal.id = "carnetModal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Carnet docente");

  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.background = "rgba(11,16,32,.55)";
  modal.style.backdropFilter = "blur(6px)";
  modal.style.webkitBackdropFilter = "blur(6px)";
  modal.style.display = "grid";
  modal.style.placeItems = "center";
  modal.style.zIndex = "9999";
  modal.style.padding = "18px";

  modal.innerHTML = `
    <div class="carnetCard" style="
      width:min(680px, 100%);
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(11,16,32,.14);
      border-radius: 22px;
      box-shadow: 0 28px 80px rgba(11,16,32,.22);
      overflow:hidden;
    ">
      <div class="carnetTop" style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding: 12px 14px;
        background: rgba(255,255,255,.86);
        border-bottom: 1px solid rgba(11,16,32,.10);
      ">
        <div class="carnetTitle" id="carnetTitle" style="font-weight:900;">Carnet docente</div>
        <button
          type="button"
          id="carnetClose"
          class="btnGhost"
          style="
            height:36px;
            padding:0 12px;
            border-radius:12px;
            border:1px solid rgba(11,16,32,.14);
            background: rgba(255,255,255,.92);
            font-weight:850;
            cursor:pointer;
          "
        >
          Cerrar
        </button>
      </div>

      <div class="carnetBody" style="padding: 14px;">
        <img
          id="carnetImg"
          alt="Carnet docente"
          style="
            width:100%;
            height:auto;
            border-radius: 16px;
            border: 1px solid rgba(11,16,32,.10);
            background: rgba(255,255,255,.6);
            display:block;
          "
        />
        <div
          id="carnetNote"
          style="
            margin-top: 10px;
            font-size: 12px;
            color: rgba(11,16,32,.68);
            text-align:center;
          "
        >
          Muestra este carnet para validar tu vinculación con Musicala.
        </div>
      </div>
    </div>
  `;

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  modal.querySelector("#carnetClose")?.addEventListener("click", close);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      close();
    }
  });

  document.body.appendChild(modal);
  carnetModal = modal;
  return modal;
}

function openCarnet(profile) {
  const path = String(profile?.carnet || "").trim();
  if (!path) {
    toast("Este usuario no tiene carnet asignado en /assets 😶‍🌫️");
    return;
  }

  const modal = ensureCarnetModal();
  const image = $("#carnetImg", modal);
  const title = $("#carnetTitle", modal);

  if (title) {
    title.textContent = `Carnet · ${profile?.label || "Docente"}`;
  }

  if (image) {
    image.src = path;
    image.onerror = () => {
      toast("No pude cargar el carnet. Revisa el nombre del archivo en /assets 😵");
      image.onerror = null;
    };
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

/* ============================================================================
   11) REGISTRO DE JORNADA
============================================================================ */
let teacherShiftModal = null;
let teacherQrReader = null;
let teacherQrRunning = false;

function bogotaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })
    .formatToParts(date)
    .reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`
  };
}

function getTeacherName() {
  return (
    APP_STATE.activeProfile?.label ||
    APP_STATE.activeUser?.displayName ||
    emailKey(APP_STATE.activeUser) ||
    "Docente"
  );
}

function getTeacherShiftSessionId(user = APP_STATE.activeUser) {
  const uid = String(user?.uid || "").trim();
  if (uid) return uid;
  return emailKey(user).replace(/[^a-z0-9_-]+/gi, "_").toLowerCase();
}

function getOpenTeacherShift(records = []) {
  const ordered = records
    .slice()
    .sort((a, b) => Number(a.createdAtClient || 0) - Number(b.createdAtClient || 0));
  let open = null;

  for (const record of ordered) {
    if (record.action === "fin_jornada") {
      open = null;
      continue;
    }

    if (record.action === "inicio_clase") {
      open = record;
    }
  }

  return open;
}

function getTeacherShiftActionLabel(action = "") {
  return action === "fin_jornada" ? "Salida" : "Ingreso";
}

function getTeacherShiftSourceLabel(source = "") {
  return {
    qr_sede: "QR",
    manual_hogar: "Manual hogar",
    manual_virtual: "Manual virtual",
    manual_fin: "Cierre manual"
  }[source] || source || "-";
}

function getTeacherShiftModeLabel(modalidad = "") {
  return {
    sede: "Sede",
    hogar: "Hogar",
    virtual: "Virtual",
    jornada: "Jornada"
  }[modalidad] || modalidad || "-";
}

const MUSIPROFE_SUGGESTIONS = [
  "¿Cómo registro mi jornada?",
  "¿Qué hago si olvidé cerrar?",
  "¿Dónde está mi bitácora?",
  "No me abre un enlace",
  "Permisos de cámara",
  "Recursos para clase"
];

const MUSIPROFE_KNOWLEDGE = [
  {
    match: ["jornada", "ingreso", "entrada", "qr", "sede"],
    answer: "Para registrar jornada entra a Registro de jornada. Si estás en sede, usa el QR autorizado de ingreso o salida. La app no permite otro ingreso mientras tengas una jornada abierta."
  },
  {
    match: ["cerrar", "salida", "olvid", "abierta", "sesion", "sesión"],
    answer: "Si olvidaste cerrar, vuelve a Registro de jornada. MusiProfe te mostrará la sesión abierta y podrás tocar Sí, cerrar jornada antes de crear un nuevo ingreso."
  },
  {
    match: ["bitacora", "bitácora", "clase", "evidencia", "tarea"],
    answer: "La bitácora está en el botón Bitácora de clase. También tienes disponible “Bitácora de clases (nueva versión)” para el nuevo enlace. Después de terminar tus clases, deja allí la evidencia y el seguimiento del proceso del estudiante."
  },
  {
    match: ["link", "enlace", "pendiente", "abre", "abrir"],
    answer: "Si un enlace aparece como Pendiente, todavía no hay un link asignado para tu perfil. Si un enlace no abre, prueba actualizar la app y reporta el botón exacto."
  },
  {
    match: ["camara", "cámara", "permiso", "qr"],
    answer: "Para leer QR revisa que el navegador tenga permiso de cámara, selecciona la cámara correcta y usa buena luz. En celular suele funcionar mejor la cámara trasera."
  },
  {
    match: ["recurso", "protocolo", "salon", "salón", "estudiante", "horario"],
    answer: "En Mi trabajo hoy encuentras horario, salones e info de estudiantes. En Recursos están protocolos, guías y materiales docentes."
  }
];

async function notifyTeacherShiftByEmail(payload) {
  const webhookUrl = String(TEACHER_SHIFT_EMAIL_WEBHOOK_URL || "").trim();
  if (!webhookUrl) return;
  if (payload?.action === "fin_jornada" && !TEACHER_SHIFT_NOTIFY_EXITS) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload || {})
    });
  } catch (error) {
    console.warn("No se pudo enviar la notificacion de jornada por correo", error);
  }
}

function isValidTeacherSiteQr(decodedText) {
  const value = normalizeQrValue(decodedText);
  return value === TEACHER_SITE_QR_ARRIVAL || value === TEACHER_SITE_QR_EXIT;
}

function getTeacherQrMessage(decodedText) {
  const value = normalizeQrValue(decodedText);

  if (value === TEACHER_SITE_QR_ARRIVAL) {
    return {
      status: "arrival",
      value,
      message: "QR de ingreso válido. Guardando registro..."
    };
  }

  if (value === TEACHER_SITE_QR_EXIT) {
    return {
      status: "exit",
      value,
      message: "QR de salida válido. Guardando registro..."
    };
  }

  if (TEACHER_SITE_QR_LUNCH.includes(value)) {
    return {
      status: "lunch",
      value,
      message: "Este QR es de almuerzo. Esta app todavía no registra almuerzos."
    };
  }

  return {
    status: "unknown",
    value,
    message: "Este QR no corresponde al registro de jornada de Musicala."
  };
}

function ensureTeacherShiftModal() {
  if (teacherShiftModal) return teacherShiftModal;

  const modal = document.createElement("div");
  modal.id = "teacherShiftModal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Registro de jornada");

  modal.innerHTML = `
    <div class="shiftTool" role="document">
      <div class="shiftToolHead">
        <div>
          <p class="shiftEyebrow">Registro de jornada</p>
          <h2>Registro de jornada</h2>
        </div>
        <button class="btnGhost shiftClose" id="teacherShiftClose" type="button" aria-label="Cerrar">Cerrar</button>
      </div>

      <div class="shiftPerson">
        <div class="shiftAvatar" aria-hidden="true">DM</div>
        <div>
          <strong id="teacherShiftName">Docente</strong>
          <span id="teacherShiftEmail">correo</span>
        </div>
      </div>

      <div class="shiftDateLine">
        <span id="teacherShiftDate">Fecha Bogotá</span>
        <span id="teacherShiftTime">Hora Bogotá</span>
      </div>

      <div class="shiftModeGrid" aria-label="Modalidad de clase">
        <button class="shiftModeCard" type="button" data-shift-mode="sede">
          <strong>Estoy en sede · Escanear QR</strong>
          <span>Obligatorio para clases en sede</span>
        </button>
        <button class="shiftModeCard" type="button" data-shift-mode="hogar">
          <strong>Clase a hogar</strong>
          <span>Ya llegué a la ubicación de la clase</span>
          <small>Registro manual bajo responsabilidad del docente</small>
        </button>
        <button class="shiftModeCard" type="button" data-shift-mode="virtual">
          <strong>Clase virtual</strong>
          <span>Ya me conecté</span>
          <small>Registro manual bajo responsabilidad del docente</small>
        </button>
      </div>

      <section class="shiftModePanel" id="teacherShiftPanel" aria-live="polite">
        <p>Elige la modalidad para registrar tu evento de jornada.</p>
      </section>

      <section class="summaryBox">
        <div class="summaryHead">
          <strong>Mis registros de hoy</strong>
          <button class="btnGhost compact" id="teacherShiftRefresh" type="button">Actualizar</button>
        </div>
        <div id="teacherShiftSummary">Cargando registros...</div>
      </section>
    </div>
  `;

  const close = () => closeTeacherShiftModal();
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  modal.querySelector("#teacherShiftClose")?.addEventListener("click", close);
  modal.querySelector("#teacherShiftRefresh")?.addEventListener("click", () => loadTeacherShiftSummary());
  modal.querySelectorAll("[data-shift-mode]").forEach((button) => {
    button.addEventListener("click", () => selectTeacherShiftMode(button.dataset.shiftMode));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });

  document.body.appendChild(modal);
  teacherShiftModal = modal;
  return modal;
}

function setTeacherShiftPanel(html) {
  const panel = $("#teacherShiftPanel", teacherShiftModal);
  if (panel) panel.innerHTML = html;
}

function updateTeacherShiftHeader() {
  const modal = ensureTeacherShiftModal();
  const now = bogotaParts();
  const name = getTeacherName();
  const email = emailKey(APP_STATE.activeUser);

  $("#teacherShiftName", modal).textContent = name;
  $("#teacherShiftEmail", modal).textContent = email;
  $("#teacherShiftDate", modal).textContent = `Fecha Bogotá: ${now.date}`;
  $("#teacherShiftTime", modal).textContent = `Hora Bogotá: ${now.time}`;
  $(".shiftAvatar", modal).textContent = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "DM";
}

async function stopTeacherQrReader() {
  if (!teacherQrReader || !teacherQrRunning) return;

  try {
    await teacherQrReader.stop();
  } catch (error) {
    console.warn("No se pudo detener el lector QR", error);
  } finally {
    try {
      teacherQrReader.clear();
    } catch (_) {}
    teacherQrRunning = false;
  }
}

function closeTeacherShiftModal() {
  if (!teacherShiftModal) return;
  stopTeacherQrReader();
  teacherShiftModal.hidden = true;
  document.body.style.overflow = "";
}

async function openTeacherShiftModal() {
  if (!APP_STATE.db) {
    toast("Firestore no está listo todavía. Intenta de nuevo en un momento.");
    return;
  }

  const modal = ensureTeacherShiftModal();
  updateTeacherShiftHeader();
  setTeacherShiftPanel("<p>Elige la modalidad para registrar tu evento de jornada.</p>");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  await loadTeacherShiftSummary();
  if (APP_STATE.teacherShiftStatus.open) {
    renderOpenTeacherShiftNotice(APP_STATE.teacherShiftStatus.record);
  }
}

function renderOpenTeacherShiftNotice(openRecord = {}) {
  const modeLabel = getTeacherShiftModeLabel(openRecord?.modalidad);
  const sourceLabel = getTeacherShiftSourceLabel(openRecord?.source);
  const startTime = openRecord?.time || "hora no disponible";

  setSelectedShiftMode("");
  setTeacherShiftPanel(`
    <div class="openShiftNotice">
      <strong>Tienes una sesión abierta todavía</strong>
      <p>Registraste ingreso a las ${escapeHtml(startTime)} (${escapeHtml(modeLabel)} · ${escapeHtml(sourceLabel)}). Para registrar un nuevo ingreso primero debes cerrar esta jornada.</p>
      <div class="openShiftActions">
        <button class="btnGoogle" id="teacherCloseOpenShift" type="button">Sí, cerrar jornada</button>
        <button class="btnGhost" id="teacherKeepOpenShift" type="button">Mantener abierta</button>
      </div>
    </div>
  `);

  $("#teacherCloseOpenShift", teacherShiftModal)?.addEventListener("click", async (event) => {
    await saveTeacherClassStartRecord({
      modalidad: openRecord?.modalidad || "jornada",
      source: openRecord?.source === "qr_sede" ? "qr_sede" : "manual_fin",
      raw: "CIERRE_SESION_ABIERTA",
      action: "fin_jornada",
      button: event.currentTarget,
      successMessage: "Jornada cerrada. Ya puedes registrar un nuevo ingreso."
    });
  });

  $("#teacherKeepOpenShift", teacherShiftModal)?.addEventListener("click", () => {
    toast("La jornada sigue abierta.");
  });
}

async function fetchTodayTeacherShiftRecords() {
  if (!APP_STATE.db || !APP_STATE.activeUser) return [];

  const { date } = bogotaParts();
  const q = query(
    collection(APP_STATE.db, "teacherClassStartRecords"),
    where("email", "==", emailKey(APP_STATE.activeUser)),
    where("date", "==", date),
    limit(30)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => doc.data() || {})
    .sort((a, b) => Number(b.createdAtClient || 0) - Number(a.createdAtClient || 0));
}

function updateHeroJornadaButton() {
  const button = $(".heroPrimary[data-id='jornada']");
  if (!button) return;

  button.disabled = false;
  button.classList.remove("isFinalizing", "isDone", "hasOpenShift");
  button.removeAttribute("data-jornada-action");

  if (APP_STATE.teacherShiftStatus.open) {
    button.classList.add("hasOpenShift");
    button.dataset.jornadaAction = "close";
    button.textContent = "Tienes una jornada abierta";
    return;
  }

  button.textContent = "Registrar ingreso";
}

async function refreshTeacherJornadaStatus() {
  if (!APP_STATE.db || !APP_STATE.activeUser) {
    APP_STATE.teacherShiftStatus = { open: false, record: null };
    updateHeroJornadaButton();
    return;
  }

  try {
    const records = await fetchTodayTeacherShiftRecords();
    const openRecord = getOpenTeacherShift(records);
    APP_STATE.teacherShiftStatus = { open: !!openRecord, record: openRecord || null };
  } catch (error) {
    console.warn("No se pudo actualizar el estado de jornada", error);
  }

  updateHeroJornadaButton();
}

function setSelectedShiftMode(mode) {
  teacherShiftModal?.querySelectorAll("[data-shift-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.shiftMode === mode);
  });
}

async function selectTeacherShiftMode(mode) {
  await stopTeacherQrReader();
  setSelectedShiftMode(mode);

  if (mode === "sede") {
    renderTeacherSiteQrPanel();
    return;
  }

  if (mode === "hogar" || mode === "virtual") {
    renderTeacherManualPanel(mode);
  }
}

function renderTeacherSiteQrPanel() {
  setTeacherShiftPanel(`
    <div class="reader">
      <div class="readerTop">
        <div>
          <strong>Clase en sede</strong>
          <span>Escanea el QR autorizado de ingreso o salida.</span>
        </div>
      </div>
      <label class="fieldLabel" for="teacherCameraSelect">Cámara</label>
      <select id="teacherCameraSelect" class="shiftSelect">
        <option value="">Cargando cámaras...</option>
      </select>
      <div id="teacherQrReader" class="qrBox"></div>
      <div class="readerActions">
        <button class="btnGoogle" id="teacherQrStart" type="button">Iniciar cámara</button>
        <button class="btnGhost" id="teacherQrStop" type="button">Detener</button>
      </div>
      <div class="readerReadout" id="teacherQrReadout" aria-live="polite"></div>
      <div class="readerResult" id="teacherQrResult">Esperando lectura de QR.</div>
    </div>
  `);

  const startBtn = $("#teacherQrStart", teacherShiftModal);
  const stopBtn = $("#teacherQrStop", teacherShiftModal);
  const cameraSelect = $("#teacherCameraSelect", teacherShiftModal);

  startBtn?.addEventListener("click", () => startTeacherQrReader());
  stopBtn?.addEventListener("click", () => stopTeacherQrReader());

  loadTeacherCameras(cameraSelect);
}

async function loadTeacherCameras(select) {
  if (!select) return;
  if (!window.Html5Qrcode) {
    select.innerHTML = '<option value="">Lector QR no disponible</option>';
    return;
  }

  try {
    const cameras = await window.Html5Qrcode.getCameras();
    if (!cameras?.length) {
      select.innerHTML = '<option value="">No se detectaron cámaras</option>';
      return;
    }

    select.innerHTML = cameras
      .map((camera, index) => `<option value="${escapeHtml(camera.id)}">${escapeHtml(camera.label || `Cámara ${index + 1}`)}</option>`)
      .join("");
  } catch (error) {
    console.warn("No se pudieron listar cámaras", error);
    select.innerHTML = '<option value="">Permite la cámara para continuar</option>';
  }
}

async function startTeacherQrReader() {
  const result = $("#teacherQrResult", teacherShiftModal);
  const select = $("#teacherCameraSelect", teacherShiftModal);

  if (!window.Html5Qrcode) {
    if (result) result.textContent = "No se pudo cargar el lector QR.";
    return;
  }

  await stopTeacherQrReader();
  teacherQrReader = new window.Html5Qrcode("teacherQrReader");
  const cameraId = select?.value || undefined;

  try {
    teacherQrRunning = true;
    if (result) result.textContent = "Cámara activa. Escanea el QR de sede.";

    await teacherQrReader.start(
      cameraId || { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      async (decodedText) => handleTeacherQrDecoded(decodedText),
      () => {}
    );
  } catch (error) {
    teacherQrRunning = false;
    console.error("QR start error:", error);
    if (result) result.textContent = "No se pudo iniciar la cámara. Revisa permisos.";
  }
}

async function handleTeacherQrDecoded(decodedText) {
  const result = $("#teacherQrResult", teacherShiftModal);
  const readout = $("#teacherQrReadout", teacherShiftModal);
  console.info("[Musicala QR leído]", decodedText);
  await stopTeacherQrReader();

  const qrInfo = getTeacherQrMessage(decodedText);
  if (readout) {
    readout.textContent = `QR leído: ${qrInfo.value || "sin valor"}`;
  }

  if (qrInfo.status === "lunch" || qrInfo.status === "unknown") {
    if (result) result.textContent = qrInfo.message;
    toast(qrInfo.message);
    return;
  }

  if (result) result.textContent = qrInfo.message;
  await saveTeacherClassStartRecord({
    modalidad: "sede",
    source: "qr_sede",
    raw: decodedText,
    action: qrInfo.status === "exit" ? "fin_jornada" : "inicio_clase",
    successMessage: qrInfo.status === "exit" ? "Salida en sede guardada." : "Ingreso en sede guardado."
  });
}

function renderTeacherManualPanel(mode) {
  const isHome = mode === "hogar";
  const title = isHome ? "Clase a hogar" : "Clase virtual";
  const buttonText = isHome ? "Ya llegué a la ubicación de la clase" : "Ya me conecté";

  setTeacherShiftPanel(`
    <div class="manualPanel">
      <strong>${escapeHtml(title)}</strong>
      <p>Registro manual bajo responsabilidad del docente.</p>
      <div class="manualData">
        <span>${escapeHtml(getTeacherName())}</span>
        <span>${escapeHtml(emailKey(APP_STATE.activeUser))}</span>
      </div>
      <button class="btnGoogle" id="teacherManualConfirm" type="button">${escapeHtml(buttonText)}</button>
    </div>
  `);

  $("#teacherManualConfirm", teacherShiftModal)?.addEventListener("click", async (event) => {
    await saveTeacherClassStartRecord({
      modalidad: mode,
      source: isHome ? "manual_hogar" : "manual_virtual",
      raw: isHome ? "MANUAL_HOGAR" : "MANUAL_VIRTUAL",
      button: event.currentTarget
    });
  });
}

async function saveTeacherShiftRecordTransaction(user, payload) {
  const sessionRef = doc(APP_STATE.db, "teacherOpenShiftSessions", getTeacherShiftSessionId(user));
  const recordRef = doc(collection(APP_STATE.db, "teacherClassStartRecords"));

  await runTransaction(APP_STATE.db, async (transaction) => {
    const sessionSnap = await transaction.get(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() || {} : {};
    const sessionIsOpen = !!session.open && session.email === payload.email;

    if (payload.action === "inicio_clase" && sessionIsOpen) {
      const openError = new Error("OPEN_TEACHER_SHIFT");
      openError.openRecord = session.openRecord || session.lastRecord || session;
      throw openError;
    }

    transaction.set(recordRef, payload);

    if (payload.action === "fin_jornada") {
      transaction.set(sessionRef, {
        open: false,
        email: payload.email,
        uid: payload.uid,
        name: payload.name,
        closedAt: serverTimestamp(),
        closedAtClient: payload.createdAtClient,
        closeRecordId: recordRef.id,
        lastRecord: payload
      }, { merge: true });
      return;
    }

    transaction.set(sessionRef, {
      open: true,
      email: payload.email,
      uid: payload.uid,
      name: payload.name,
      openedAt: serverTimestamp(),
      openedAtClient: payload.createdAtClient,
      openRecordId: recordRef.id,
      openRecord: payload,
      lastRecord: payload
    }, { merge: true });
  });
}

async function saveTeacherClassStartRecord({
  modalidad,
  source,
  raw,
  button = null,
  action = "inicio_clase",
  successMessage = "Inicio de jornada guardado."
}) {
  if (!APP_STATE.db || !APP_STATE.activeUser) {
    toast("No hay sesión lista para guardar el registro.");
    return;
  }

  const user = APP_STATE.activeUser;
  const parts = bogotaParts();
  const payload = {
    role: "docente",
    email: emailKey(user),
    name: getTeacherName(),
    uid: user.uid || "",
    date: parts.date,
    time: parts.time,
    stamp: new Date().toISOString(),
    createdAt: serverTimestamp(),
    createdAtClient: Date.now(),
    action,
    modalidad,
    source,
    raw: String(raw || "")
  };

  try {
    setButtonBusy(button, true, "Guardando...");
    await saveTeacherShiftRecordTransaction(user, payload);
    notifyTeacherShiftByEmail(payload);
    toast(successMessage);
    if (teacherShiftModal && !teacherShiftModal.hidden) {
      updateTeacherShiftHeader();
      await loadTeacherShiftSummary();
      if (action === "inicio_clase") {
        renderOpenTeacherShiftNotice(payload);
      }
    }
  } catch (error) {
    if (error?.message === "OPEN_TEACHER_SHIFT") {
      const openRecord = error.openRecord || APP_STATE.teacherShiftStatus.record || {};
      APP_STATE.teacherShiftStatus = { open: true, record: openRecord };
      renderOpenTeacherShiftNotice(openRecord);
      updateHeroJornadaButton();
      toast("Tienes una sesión abierta todavía. Ciérrala antes de registrar otro ingreso.");
      return;
    }

    console.error("No se pudo guardar el registro de clase", error);
    toast("No se pudo guardar el registro. Revisa conexión o permisos.");
  } finally {
    setButtonBusy(button, false);
    await refreshTeacherJornadaStatus();
  }
}

async function loadTeacherShiftSummary() {
  const target = $("#teacherShiftSummary", teacherShiftModal);
  if (!target || !APP_STATE.db || !APP_STATE.activeUser) return;

  target.textContent = "Cargando registros...";

  try {
    const records = await fetchTodayTeacherShiftRecords();
    const openRecord = getOpenTeacherShift(records);
    APP_STATE.teacherShiftStatus = { open: !!openRecord, record: openRecord || null };
    updateHeroJornadaButton();

    if (!records.length) {
      target.textContent = "Aún no hay registros de jornada hoy.";
      return;
    }

    const rows = records
      .slice()
      .sort((a, b) => Number(a.createdAtClient || 0) - Number(b.createdAtClient || 0))
      .map((data) => {
        const actionLabel = getTeacherShiftActionLabel(data.action);
        const modalidadLabel = getTeacherShiftModeLabel(data.modalidad);
        const sourceLabel = getTeacherShiftSourceLabel(data.source);

        return `
          <tr>
            <td>${escapeHtml(actionLabel)}</td>
            <td>${escapeHtml(modalidadLabel)}</td>
            <td>${escapeHtml(data.time || "-")}</td>
            <td>${escapeHtml(sourceLabel)}</td>
          </tr>
        `;
      }).join("");

    target.innerHTML = `
      <div class="recordTableWrap">
        <table class="recordTable">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Modalidad</th>
              <th>Hora</th>
              <th>Fuente</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error("No se pudo cargar el resumen", error);
    target.textContent = "No se pudo cargar el resumen de hoy.";
  }
}

/* ============================================================================
   11b) PANEL ADMIN
============================================================================ */
let adminPanelModal = null;
const ADMIN_STATE = {
  records: [],
  liveSessions: [],
  schedules: {},       // { email: scheduleDoc }
  overrides: {},       // { "email__date": overrideDoc }
  loading: false,
  tab: "puntualidad",
  filters: {
    email: "",
    from: "",
    to: ""
  }
};

const PUNCTUALITY = {
  DEFAULT_GRACE: 5,
  WEEKDAYS: ["dom", "lun", "mar", "mie", "jue", "vie", "sab"],
  WEEKDAY_LABELS: {
    lun: "Lunes", mar: "Martes", mie: "Miércoles", jue: "Jueves",
    vie: "Viernes", sab: "Sábado", dom: "Domingo"
  }
};

function adminDefaultDateRange() {
  const { date } = bogotaParts();
  const today = date;
  const dt = new Date(today + "T00:00:00");
  dt.setDate(dt.getDate() - 30);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return { from: `${yyyy}-${mm}-${dd}`, to: today };
}

function getAdminTeacherOptions() {
  const entries = Object.entries(HUB.USERS || {})
    .map(([email, profile]) => ({ email, label: profile?.label || email }))
    .filter((item) => !ADMIN_EMAILS.includes(item.email) || true)
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
  return entries;
}

function ensureAdminPanelModal() {
  if (adminPanelModal) return adminPanelModal;

  const modal = document.createElement("div");
  modal.id = "adminPanelModal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Panel admin");

  const teacherOptions = getAdminTeacherOptions()
    .map((item) => `<option value="${escapeHtml(item.email)}">${escapeHtml(item.label)}</option>`)
    .join("");

  const range = adminDefaultDateRange();
  ADMIN_STATE.filters.from = range.from;
  ADMIN_STATE.filters.to = range.to;

  modal.innerHTML = `
    <div class="shiftTool adminTool" role="document">
      <div class="shiftToolHead">
        <div>
          <p class="shiftEyebrow">Administración</p>
          <h2>Panel admin · Marcaciones docentes</h2>
        </div>
        <button class="btnGhost shiftClose" id="adminPanelClose" type="button" aria-label="Cerrar">Cerrar</button>
      </div>

      <div class="adminTabs" role="tablist">
        <button class="adminTab active" type="button" data-admin-tab="puntualidad" role="tab">Puntualidad</button>
        <button class="adminTab" type="button" data-admin-tab="marcaciones" role="tab">Marcaciones</button>
        <button class="adminTab" type="button" data-admin-tab="diario" role="tab">Jornadas por día</button>
        <button class="adminTab" type="button" data-admin-tab="mensual" role="tab">Estadísticas</button>
        <button class="adminTab" type="button" data-admin-tab="horarios" role="tab">Horarios</button>
        <button class="adminTab" type="button" data-admin-tab="vivo" role="tab">En vivo</button>
      </div>

      <div class="adminFilters" id="adminFilters">
        <label>
          <span>Docente</span>
          <select id="adminFilterEmail">
            <option value="">Todos</option>
            ${teacherOptions}
          </select>
        </label>
        <label>
          <span>Desde</span>
          <input type="date" id="adminFilterFrom" value="${escapeHtml(range.from)}" />
        </label>
        <label>
          <span>Hasta</span>
          <input type="date" id="adminFilterTo" value="${escapeHtml(range.to)}" />
        </label>
        <button class="btnGoogle adminApply" id="adminFilterApply" type="button">Aplicar</button>
      </div>

      <div class="adminBody" id="adminBody">
        <p>Cargando…</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  adminPanelModal = modal;

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAdminPanel();
  });

  $("#adminPanelClose", modal)?.addEventListener("click", closeAdminPanel);

  modal.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.adminTab;
      setAdminTab(id);
    });
  });

  $("#adminFilterApply", modal)?.addEventListener("click", () => {
    ADMIN_STATE.filters.email = $("#adminFilterEmail", modal).value || "";
    ADMIN_STATE.filters.from = $("#adminFilterFrom", modal).value || "";
    ADMIN_STATE.filters.to = $("#adminFilterTo", modal).value || "";
    loadAdminData();
  });

  return modal;
}

function openAdminPanel() {
  if (!isAdminUser()) {
    toast("Sección reservada para administradores.");
    return;
  }
  const modal = ensureAdminPanelModal();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  setAdminTab(ADMIN_STATE.tab || "marcaciones");
  loadAdminData();
}

function closeAdminPanel() {
  if (!adminPanelModal) return;
  adminPanelModal.hidden = true;
  document.body.style.overflow = "";
}

function setAdminTab(tabId) {
  ADMIN_STATE.tab = tabId;
  if (!adminPanelModal) return;

  adminPanelModal.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.adminTab === tabId);
  });

  const filters = $("#adminFilters", adminPanelModal);
  if (filters) filters.style.display = (tabId === "vivo" || tabId === "horarios") ? "none" : "";

  renderAdminBody();
}

async function loadAdminData() {
  if (!APP_STATE.db || !isAdminUser()) return;
  const body = $("#adminBody", adminPanelModal);
  if (body) body.innerHTML = "<p>Cargando registros…</p>";
  ADMIN_STATE.loading = true;

  try {
    if (ADMIN_STATE.tab === "vivo") {
      ADMIN_STATE.liveSessions = await fetchAdminLiveSessions();
    } else if (ADMIN_STATE.tab === "horarios") {
      ADMIN_STATE.schedules = await fetchAdminSchedules();
    } else {
      const [records] = await Promise.all([fetchAdminRecords()]);
      ADMIN_STATE.records = records;
      // Para puntualidad necesitamos horarios + overrides del rango.
      if (ADMIN_STATE.tab === "puntualidad") {
        const [schedules, overrides] = await Promise.all([
          fetchAdminSchedules(),
          fetchAdminOverrides()
        ]);
        ADMIN_STATE.schedules = schedules;
        ADMIN_STATE.overrides = overrides;
      }
    }
  } catch (error) {
    console.error("Admin load error", error);
    if (body) body.innerHTML = `<p>No se pudieron cargar los datos. ${escapeHtml(error?.message || "")}</p>`;
    ADMIN_STATE.loading = false;
    return;
  }

  ADMIN_STATE.loading = false;
  renderAdminBody();
}

async function fetchAdminRecords() {
  const { email, from, to } = ADMIN_STATE.filters;
  const constraints = [];
  if (email) constraints.push(where("email", "==", email));
  if (from) constraints.push(where("date", ">=", from));
  if (to) constraints.push(where("date", "<=", to));
  constraints.push(orderBy("date", "desc"));
  constraints.push(limit(1000));

  const q = query(collection(APP_STATE.db, "teacherClassStartRecords"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
}

async function fetchAdminLiveSessions() {
  const q = query(
    collection(APP_STATE.db, "teacherOpenShiftSessions"),
    where("open", "==", true),
    limit(200)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
}

/* ============================================================================
   11c) HORARIOS Y PUNTUALIDAD
============================================================================ */
async function fetchAdminSchedules() {
  const snapshot = await getDocs(collection(APP_STATE.db, "teacherSchedules"));
  const map = {};
  snapshot.forEach((d) => { map[d.id] = { email: d.id, ...(d.data() || {}) }; });
  return map;
}

async function fetchAdminOverrides() {
  const { from, to } = ADMIN_STATE.filters;
  const constraints = [];
  if (from) constraints.push(where("date", ">=", from));
  if (to) constraints.push(where("date", "<=", to));
  const q = constraints.length
    ? query(collection(APP_STATE.db, "teacherScheduleOverrides"), ...constraints)
    : collection(APP_STATE.db, "teacherScheduleOverrides");
  const snapshot = await getDocs(q);
  const map = {};
  snapshot.forEach((d) => { map[d.id] = { id: d.id, ...(d.data() || {}) }; });
  return map;
}

function overrideId(email, date) {
  return `${email}__${date}`;
}

async function saveTeacherSchedule(email, data) {
  const ref = doc(APP_STATE.db, "teacherSchedules", email);
  await setDoc(ref, {
    ...data,
    email,
    updatedBy: emailKey(APP_STATE.activeUser),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function saveScheduleOverride(email, date, data) {
  const ref = doc(APP_STATE.db, "teacherScheduleOverrides", overrideId(email, date));
  await setDoc(ref, {
    email,
    date,
    ...data,
    updatedBy: emailKey(APP_STATE.activeUser),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function deleteScheduleOverride(email, date) {
  const ref = doc(APP_STATE.db, "teacherScheduleOverrides", overrideId(email, date));
  await deleteDoc(ref);
}

// "YYYY-MM-DD" -> clave de día de semana ("lun".."dom") en zona Bogotá.
const WEEKDAY_MAP = { Sun: "dom", Mon: "lun", Tue: "mar", Wed: "mie", Thu: "jue", Fri: "vie", Sat: "sab" };
function weekdayKeyFromDate(dateStr) {
  // Anclamos a mediodía Bogotá (-05) para evitar saltos por zona horaria.
  const dt = new Date(`${dateStr}T12:00:00-05:00`);
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota", weekday: "short"
  }).format(dt);
  return WEEKDAY_MAP[short] || "dom";
}

function timeToMinutes(hhmm) {
  const m = String(hhmm || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function minutesToLabel(mins) {
  if (mins == null || !Number.isFinite(mins)) return "-";
  const sign = mins < 0 ? "-" : "";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return h ? `${sign}${h}h ${String(m).padStart(2, "0")}m` : `${sign}${m}m`;
}

// Devuelve el horario esperado para (email, date): primero override, luego semanal (fijo).
function getExpectedSchedule(email, date) {
  const ov = ADMIN_STATE.overrides[overrideId(email, date)];
  if (ov) {
    return {
      start: ov.start || "",
      end: ov.end || "",
      excused: !!ov.excused,
      note: ov.note || "",
      source: "override"
    };
  }
  const sched = ADMIN_STATE.schedules[email];
  if (sched && sched.type === "fijo" && sched.weekly) {
    const day = sched.weekly[weekdayKeyFromDate(date)];
    if (day && day.start) {
      return { start: day.start, end: day.end || "", excused: false, note: "", source: "weekly" };
    }
  }
  return null; // sin horario esperado configurado
}

function getGraceMinutes(email) {
  const sched = ADMIN_STATE.schedules[email];
  const g = Number(sched?.graceMinutes);
  return Number.isFinite(g) ? g : PUNCTUALITY.DEFAULT_GRACE;
}

// Evalúa puntualidad de un día-docente a partir de las marcas emparejadas.
function evaluatePunctuality(email, date, firstInTime, lastOutTime) {
  const expected = getExpectedSchedule(email, date);
  const grace = getGraceMinutes(email);

  if (!expected || !expected.start) {
    return { status: "sin_horario", label: "Sin horario", lateMin: null, earlyMin: null, expected, grace };
  }
  if (expected.excused) {
    return { status: "justificado", label: "Justificado", lateMin: null, earlyMin: null, expected, grace };
  }
  if (!firstInTime) {
    return { status: "ausente", label: "Ausente", lateMin: null, earlyMin: null, expected, grace };
  }

  const expStart = timeToMinutes(expected.start);
  const realStart = timeToMinutes(firstInTime);
  let lateMin = null;
  if (expStart != null && realStart != null) lateMin = realStart - expStart;

  let earlyMin = null;
  if (expected.end && lastOutTime) {
    const expEnd = timeToMinutes(expected.end);
    const realEnd = timeToMinutes(lastOutTime);
    if (expEnd != null && realEnd != null) earlyMin = expEnd - realEnd; // positivo = salió antes
  }

  let status = "a_tiempo";
  let label = "A tiempo";
  if (lateMin != null && lateMin > grace) {
    status = "tarde";
    label = `Tarde ${minutesToLabel(lateMin)}`;
  } else if (earlyMin != null && earlyMin > grace) {
    status = "salida_temprana";
    label = `Salió ${minutesToLabel(earlyMin)} antes`;
  }

  return { status, label, lateMin, earlyMin, expected, grace };
}

const PUNCTUALITY_BADGE = {
  a_tiempo: "ok",
  tarde: "late",
  salida_temprana: "early",
  ausente: "absent",
  justificado: "excused",
  sin_horario: "none"
};

function renderAdminBody() {
  const body = $("#adminBody", adminPanelModal);
  if (!body) return;
  if (ADMIN_STATE.loading) {
    body.innerHTML = "<p>Cargando…</p>";
    return;
  }

  if (ADMIN_STATE.tab === "puntualidad") return renderAdminPuntualidad(body);
  if (ADMIN_STATE.tab === "marcaciones") return renderAdminMarcaciones(body);
  if (ADMIN_STATE.tab === "diario") return renderAdminDiario(body);
  if (ADMIN_STATE.tab === "mensual") return renderAdminMensual(body);
  if (ADMIN_STATE.tab === "horarios") return renderAdminHorarios(body);
  if (ADMIN_STATE.tab === "vivo") return renderAdminVivo(body);
}

function renderAdminMarcaciones(body) {
  const records = ADMIN_STATE.records.slice().sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return Number(b.createdAtClient || 0) - Number(a.createdAtClient || 0);
  });

  if (!records.length) {
    body.innerHTML = "<p>No hay marcaciones en el rango seleccionado.</p>";
    return;
  }

  const rows = records.map((r) => `
    <tr>
      <td>${escapeHtml(r.date || "-")}</td>
      <td>${escapeHtml(r.time || "-")}</td>
      <td>${escapeHtml(r.name || r.email || "-")}</td>
      <td>${escapeHtml(getTeacherShiftActionLabel(r.action))}</td>
      <td>${escapeHtml(getTeacherShiftModeLabel(r.modalidad))}</td>
      <td>${escapeHtml(getTeacherShiftSourceLabel(r.source))}</td>
    </tr>
  `).join("");

  body.innerHTML = `
    <p class="adminMeta">${records.length} marcaciones</p>
    <div class="recordTableWrap">
      <table class="recordTable">
        <thead><tr>
          <th>Fecha</th><th>Hora</th><th>Docente</th><th>Tipo</th><th>Modalidad</th><th>Fuente</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function pairDailyShifts(records) {
  const byKey = new Map();
  for (const r of records) {
    const key = `${r.email}|${r.date}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(r);
  }

  const rows = [];
  for (const [key, list] of byKey.entries()) {
    list.sort((a, b) => Number(a.createdAtClient || 0) - Number(b.createdAtClient || 0));
    const [email, date] = key.split("|");
    const name = list[0]?.name || email;
    const inicios = list.filter((r) => r.action === "inicio_clase");
    const fines = list.filter((r) => r.action === "fin_jornada");
    const firstIn = inicios[0];
    const lastOut = fines[fines.length - 1];

    let horas = "-";
    if (firstIn?.stamp && lastOut?.stamp) {
      const ms = new Date(lastOut.stamp).getTime() - new Date(firstIn.stamp).getTime();
      if (Number.isFinite(ms) && ms > 0) {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        horas = `${h}h ${String(m).padStart(2, "0")}m`;
      }
    }

    const modalidades = Array.from(new Set(list.map((r) => getTeacherShiftModeLabel(r.modalidad)))).join(", ");
    rows.push({
      date, name, email,
      entrada: firstIn?.time || "-",
      salida: lastOut?.time || (firstIn ? "Sin cierre" : "-"),
      horas,
      modalidades,
      total: list.length
    });
  }

  rows.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.name.localeCompare(b.name, "es");
  });
  return rows;
}

function renderAdminDiario(body) {
  const rows = pairDailyShifts(ADMIN_STATE.records);
  if (!rows.length) {
    body.innerHTML = "<p>No hay jornadas en el rango seleccionado.</p>";
    return;
  }

  const html = rows.map((r) => `
    <tr>
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.entrada)}</td>
      <td>${escapeHtml(r.salida)}</td>
      <td>${escapeHtml(r.horas)}</td>
      <td>${escapeHtml(r.modalidades)}</td>
      <td>${escapeHtml(String(r.total))}</td>
    </tr>
  `).join("");

  body.innerHTML = `
    <p class="adminMeta">${rows.length} días-docente</p>
    <div class="recordTableWrap">
      <table class="recordTable">
        <thead><tr>
          <th>Fecha</th><th>Docente</th><th>Entrada</th><th>Salida</th><th>Horas</th><th>Modalidades</th><th>Marcas</th>
        </tr></thead>
        <tbody>${html}</tbody>
      </table>
    </div>
  `;
}

function renderAdminMensual(body) {
  const records = ADMIN_STATE.records;
  if (!records.length) {
    body.innerHTML = "<p>No hay datos en el rango seleccionado.</p>";
    return;
  }

  const byTeacher = new Map();
  for (const r of records) {
    const email = r.email || "-";
    if (!byTeacher.has(email)) {
      byTeacher.set(email, {
        name: r.name || email,
        email,
        ingresos: 0,
        cierres: 0,
        sede: 0,
        hogar: 0,
        virtual: 0,
        otras: 0,
        dias: new Set(),
        horasMs: 0
      });
    }
    const t = byTeacher.get(email);
    if (r.action === "inicio_clase") t.ingresos += 1;
    if (r.action === "fin_jornada") t.cierres += 1;
    const mod = String(r.modalidad || "").toLowerCase();
    if (mod === "sede") t.sede += 1;
    else if (mod === "hogar") t.hogar += 1;
    else if (mod === "virtual") t.virtual += 1;
    else t.otras += 1;
    if (r.date) t.dias.add(r.date);
  }

  for (const row of pairDailyShifts(records)) {
    const t = byTeacher.get(row.email);
    if (!t) continue;
    const match = String(row.horas).match(/(\d+)h (\d+)m/);
    if (match) {
      t.horasMs += (Number(match[1]) * 60 + Number(match[2])) * 60000;
    }
  }

  const list = Array.from(byTeacher.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));

  const rows = list.map((t) => {
    const totalH = Math.floor(t.horasMs / 3600000);
    const totalM = Math.floor((t.horasMs % 3600000) / 60000);
    const horasTotal = `${totalH}h ${String(totalM).padStart(2, "0")}m`;
    return `
      <tr>
        <td>${escapeHtml(t.name)}</td>
        <td>${t.dias.size}</td>
        <td>${t.ingresos}</td>
        <td>${t.cierres}</td>
        <td>${t.sede}</td>
        <td>${t.hogar}</td>
        <td>${t.virtual}</td>
        <td>${escapeHtml(horasTotal)}</td>
      </tr>
    `;
  }).join("");

  body.innerHTML = `
    <p class="adminMeta">${list.length} docentes en el rango ${escapeHtml(ADMIN_STATE.filters.from)} → ${escapeHtml(ADMIN_STATE.filters.to)}</p>
    <div class="recordTableWrap">
      <table class="recordTable">
        <thead><tr>
          <th>Docente</th><th>Días</th><th>Ingresos</th><th>Cierres</th><th>Sede</th><th>Hogar</th><th>Virtual</th><th>Horas (aprox.)</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="adminNote">Horas calculadas como diferencia entre el primer ingreso y la última salida del día. Si una jornada quedó sin cerrar no se contabiliza.</p>
  `;
}

function renderAdminVivo(body) {
  const sessions = ADMIN_STATE.liveSessions.slice().sort((a, b) => {
    const ta = Number(a.openedAtClient || 0);
    const tb = Number(b.openedAtClient || 0);
    return tb - ta;
  });

  if (!sessions.length) {
    body.innerHTML = `
      <p>No hay docentes con jornada abierta en este momento.</p>
      <button class="btnGhost" type="button" id="adminReloadLive">Recargar</button>
    `;
    $("#adminReloadLive", body)?.addEventListener("click", loadAdminData);
    return;
  }

  const rows = sessions.map((s) => {
    const rec = s.openRecord || s.lastRecord || {};
    const opened = rec.time && rec.date ? `${rec.date} ${rec.time}` : (s.openedAtClient ? new Date(s.openedAtClient).toLocaleString("es-CO", { timeZone: "America/Bogota" }) : "-");
    return `
      <tr>
        <td>${escapeHtml(s.name || rec.name || s.email || "-")}</td>
        <td>${escapeHtml(s.email || "-")}</td>
        <td>${escapeHtml(opened)}</td>
        <td>${escapeHtml(getTeacherShiftModeLabel(rec.modalidad))}</td>
        <td>${escapeHtml(getTeacherShiftSourceLabel(rec.source))}</td>
      </tr>
    `;
  }).join("");

  body.innerHTML = `
    <p class="adminMeta">${sessions.length} jornadas abiertas</p>
    <div class="recordTableWrap">
      <table class="recordTable">
        <thead><tr>
          <th>Docente</th><th>Correo</th><th>Inicio</th><th>Modalidad</th><th>Fuente</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <button class="btnGhost" type="button" id="adminReloadLive">Recargar</button>
  `;
  $("#adminReloadLive", body)?.addEventListener("click", loadAdminData);
}

/* ---- Enumerar fechas del rango (YYYY-MM-DD) ---- */
function enumerateDates(from, to) {
  const out = [];
  if (!from || !to) return out;
  let cur = new Date(`${from}T12:00:00-05:00`);
  const end = new Date(`${to}T12:00:00-05:00`);
  let guard = 0;
  while (cur <= end && guard < 400) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return out;
}

/* ---- Construye filas de evaluación de puntualidad ---- */
function buildPunctualityRows() {
  const { email: filterEmail, from, to } = ADMIN_STATE.filters;

  // Mapa de marcas por día/docente.
  const recRows = pairDailyShifts(ADMIN_STATE.records);
  const recMap = new Map();
  for (const r of recRows) recMap.set(`${r.email}|${r.date}`, r);

  // Universo de docentes a evaluar.
  let teachers = getAdminTeacherOptions().filter((t) => !ADMIN_EMAILS.includes(t.email));
  if (filterEmail) teachers = teachers.filter((t) => t.email === filterEmail);

  const dates = enumerateDates(from, to);
  const rows = [];
  const validTime = (t) => /^\d{1,2}:\d{2}$/.test(String(t || ""));

  for (const t of teachers) {
    for (const date of dates) {
      const rec = recMap.get(`${t.email}|${date}`);
      const expected = getExpectedSchedule(t.email, date);
      if (!expected && !rec) continue; // nada que mostrar

      const firstIn = rec && validTime(rec.entrada) ? rec.entrada : "";
      const lastOut = rec && validTime(rec.salida) ? rec.salida : "";
      const evalResult = evaluatePunctuality(t.email, date, firstIn, lastOut);

      rows.push({
        email: t.email,
        name: t.label,
        date,
        firstIn: firstIn || "-",
        lastOut: lastOut || (rec ? "Sin cierre" : "-"),
        expectedStart: expected?.start || "-",
        expectedEnd: expected?.end || "-",
        note: expected?.note || "",
        source: expected?.source || "",
        ...evalResult
      });
    }
  }

  rows.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.name.localeCompare(b.name, "es");
  });
  return rows;
}

function renderAdminPuntualidad(body) {
  const rows = buildPunctualityRows();

  if (!rows.length) {
    body.innerHTML = `
      <p>No hay datos de puntualidad en el rango. Configura horarios en la pestaña <strong>Horarios</strong> o verifica que existan marcaciones.</p>
    `;
    return;
  }

  // KPIs
  const counts = { a_tiempo: 0, tarde: 0, salida_temprana: 0, ausente: 0, justificado: 0, sin_horario: 0 };
  let lateSum = 0, lateN = 0;
  for (const r of rows) {
    counts[r.status] = (counts[r.status] || 0) + 1;
    if (r.status === "tarde" && Number.isFinite(r.lateMin)) { lateSum += r.lateMin; lateN += 1; }
  }
  const evaluables = counts.a_tiempo + counts.tarde + counts.salida_temprana + counts.ausente;
  const pctPuntual = evaluables ? Math.round((counts.a_tiempo / evaluables) * 100) : 0;
  const avgLate = lateN ? Math.round(lateSum / lateN) : 0;

  const kpis = `
    <div class="adminKpis">
      <div class="kpiCard kpiOk"><span class="kpiNum">${pctPuntual}%</span><span class="kpiLbl">Puntualidad</span></div>
      <div class="kpiCard kpiLate"><span class="kpiNum">${counts.tarde}</span><span class="kpiLbl">Tardanzas</span></div>
      <div class="kpiCard kpiAbsent"><span class="kpiNum">${counts.ausente}</span><span class="kpiLbl">Ausencias</span></div>
      <div class="kpiCard kpiEarly"><span class="kpiNum">${counts.salida_temprana}</span><span class="kpiLbl">Salidas antes</span></div>
      <div class="kpiCard kpiAvg"><span class="kpiNum">${avgLate ? minutesToLabel(avgLate) : "0m"}</span><span class="kpiLbl">Tarde promedio</span></div>
    </div>
  `;

  const html = rows.map((r) => {
    const badge = PUNCTUALITY_BADGE[r.status] || "none";
    const noteHtml = r.note ? `<span class="puntNote" title="${escapeHtml(r.note)}">📝</span>` : "";
    return `
      <tr>
        <td>${escapeHtml(r.date)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.expectedStart)}${r.expectedEnd !== "-" ? " → " + escapeHtml(r.expectedEnd) : ""}</td>
        <td>${escapeHtml(r.firstIn)}</td>
        <td><span class="puntBadge punt-${badge}">${escapeHtml(r.label)}</span> ${noteHtml}</td>
        <td><button class="btnGhost puntAdjust" type="button" data-email="${escapeHtml(r.email)}" data-date="${escapeHtml(r.date)}">Ajustar</button></td>
      </tr>
    `;
  }).join("");

  body.innerHTML = `
    ${kpis}
    <p class="adminMeta">${rows.length} días evaluados · ${escapeHtml(ADMIN_STATE.filters.from)} → ${escapeHtml(ADMIN_STATE.filters.to)}</p>
    <div class="recordTableWrap">
      <table class="recordTable">
        <thead><tr>
          <th>Fecha</th><th>Docente</th><th>Esperado</th><th>Entrada real</th><th>Estado</th><th></th>
        </tr></thead>
        <tbody>${html}</tbody>
      </table>
    </div>
    <p class="adminNote">El estado compara la primera marca de ingreso contra la hora esperada (override del día si existe, si no el horario semanal del docente fijo). Gracia configurable por docente.</p>
  `;

  body.querySelectorAll(".puntAdjust").forEach((btn) => {
    btn.addEventListener("click", () => openOverrideEditor(btn.dataset.email, btn.dataset.date));
  });
}

/* ---- Editor de ajuste de un día (override) ---- */
function openOverrideEditor(email, date) {
  const teacher = getAdminTeacherOptions().find((t) => t.email === email);
  const name = teacher?.label || email;
  const expected = getExpectedSchedule(email, date);
  const ov = ADMIN_STATE.overrides[overrideId(email, date)];

  const dialog = document.createElement("div");
  dialog.className = "adminSubModal";
  dialog.innerHTML = `
    <div class="adminSubCard" role="dialog" aria-modal="true">
      <h3>Ajustar día · ${escapeHtml(name)}</h3>
      <p class="adminSubSub">${escapeHtml(date)}</p>
      <label>Hora esperada de entrada
        <input type="time" id="ovStart" value="${escapeHtml(expected?.start || "")}" />
      </label>
      <label>Hora esperada de salida (opcional)
        <input type="time" id="ovEnd" value="${escapeHtml(expected?.end || "")}" />
      </label>
      <label class="adminCheck">
        <input type="checkbox" id="ovExcused" ${expected?.excused ? "checked" : ""} />
        <span>Justificado (no cuenta como tardanza/ausencia)</span>
      </label>
      <label>Nota
        <input type="text" id="ovNote" maxlength="140" value="${escapeHtml(expected?.note || "")}" placeholder="Ej: cambio de horario por evento" />
      </label>
      <div class="adminSubActions">
        ${ov ? `<button class="btnGhost adminDanger" id="ovDelete" type="button">Quitar ajuste</button>` : "<span></span>"}
        <div>
          <button class="btnGhost" id="ovCancel" type="button">Cancelar</button>
          <button class="btnGoogle" id="ovSave" type="button">Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  const close = () => dialog.remove();
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
  $("#ovCancel", dialog)?.addEventListener("click", close);

  $("#ovSave", dialog)?.addEventListener("click", async () => {
    const data = {
      start: $("#ovStart", dialog).value || "",
      end: $("#ovEnd", dialog).value || "",
      excused: $("#ovExcused", dialog).checked,
      note: $("#ovNote", dialog).value.trim()
    };
    try {
      await saveScheduleOverride(email, date, data);
      ADMIN_STATE.overrides[overrideId(email, date)] = { id: overrideId(email, date), email, date, ...data };
      toast("Ajuste guardado ✅");
      close();
      renderAdminBody();
    } catch (err) {
      console.error(err);
      toast("No se pudo guardar el ajuste. Revisa permisos/reglas.");
    }
  });

  $("#ovDelete", dialog)?.addEventListener("click", async () => {
    try {
      await deleteScheduleOverride(email, date);
      delete ADMIN_STATE.overrides[overrideId(email, date)];
      toast("Ajuste eliminado.");
      close();
      renderAdminBody();
    } catch (err) {
      console.error(err);
      toast("No se pudo eliminar el ajuste.");
    }
  });
}

/* ---- Pestaña Horarios: configurar tipo + gracia + semana ---- */
function renderAdminHorarios(body) {
  const teachers = getAdminTeacherOptions().filter((t) => !ADMIN_EMAILS.includes(t.email));
  if (!teachers.length) {
    body.innerHTML = "<p>No hay docentes configurados.</p>";
    return;
  }

  const cards = teachers.map((t) => {
    const sched = ADMIN_STATE.schedules[t.email] || {};
    const type = sched.type || "flexible";
    const grace = Number.isFinite(Number(sched.graceMinutes)) ? Number(sched.graceMinutes) : PUNCTUALITY.DEFAULT_GRACE;
    const summary = type === "fijo"
      ? "Jornada fija (horario semanal)"
      : "Flexible (se ajusta por día)";
    return `
      <div class="schedCard">
        <div class="schedCardHead">
          <div>
            <strong>${escapeHtml(t.label)}</strong>
            <span class="schedType schedType-${type}">${type === "fijo" ? "Fijo" : "Flexible"}</span>
          </div>
          <button class="btnGhost schedEdit" type="button" data-email="${escapeHtml(t.email)}">Configurar</button>
        </div>
        <p class="schedSummary">${summary} · gracia ${grace} min</p>
      </div>
    `;
  }).join("");

  body.innerHTML = `
    <p class="adminMeta">Configura el horario esperado de cada docente. Los <strong>flexibles</strong> se ajustan día por día desde Puntualidad; los <strong>fijos</strong> usan el horario semanal de abajo.</p>
    <div class="schedGrid">${cards}</div>
  `;

  body.querySelectorAll(".schedEdit").forEach((btn) => {
    btn.addEventListener("click", () => openScheduleEditor(btn.dataset.email));
  });
}

function openScheduleEditor(email) {
  const teacher = getAdminTeacherOptions().find((t) => t.email === email);
  const name = teacher?.label || email;
  const sched = ADMIN_STATE.schedules[email] || {};
  const type = sched.type || "flexible";
  const grace = Number.isFinite(Number(sched.graceMinutes)) ? Number(sched.graceMinutes) : PUNCTUALITY.DEFAULT_GRACE;
  const weekly = sched.weekly || {};

  const weekdayRows = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"].map((wd) => {
    const day = weekly[wd] || {};
    return `
      <div class="schedDayRow">
        <span class="schedDayLbl">${escapeHtml(PUNCTUALITY.WEEKDAY_LABELS[wd])}</span>
        <input type="time" data-wd="${wd}" data-field="start" value="${escapeHtml(day.start || "")}" />
        <span>→</span>
        <input type="time" data-wd="${wd}" data-field="end" value="${escapeHtml(day.end || "")}" />
      </div>
    `;
  }).join("");

  const dialog = document.createElement("div");
  dialog.className = "adminSubModal";
  dialog.innerHTML = `
    <div class="adminSubCard" role="dialog" aria-modal="true">
      <h3>Horario · ${escapeHtml(name)}</h3>
      <label>Tipo de docente
        <select id="schedType">
          <option value="flexible" ${type === "flexible" ? "selected" : ""}>Flexible (ajuste por día)</option>
          <option value="fijo" ${type === "fijo" ? "selected" : ""}>Fijo (horario semanal)</option>
        </select>
      </label>
      <label>Minutos de gracia
        <input type="number" id="schedGrace" min="0" max="60" value="${grace}" />
      </label>
      <div id="schedWeekly" class="schedWeekly" ${type === "fijo" ? "" : "hidden"}>
        <p class="schedWeeklyHint">Horario semanal (deja vacío un día si no trabaja).</p>
        ${weekdayRows}
      </div>
      <div class="adminSubActions">
        <span></span>
        <div>
          <button class="btnGhost" id="schedCancel" type="button">Cancelar</button>
          <button class="btnGoogle" id="schedSave" type="button">Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  const close = () => dialog.remove();
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
  $("#schedCancel", dialog)?.addEventListener("click", close);

  $("#schedType", dialog)?.addEventListener("change", (e) => {
    const wk = $("#schedWeekly", dialog);
    if (wk) wk.hidden = e.target.value !== "fijo";
  });

  $("#schedSave", dialog)?.addEventListener("click", async () => {
    const newType = $("#schedType", dialog).value;
    const newGrace = Number($("#schedGrace", dialog).value) || 0;
    const newWeekly = {};
    dialog.querySelectorAll("[data-wd]").forEach((input) => {
      const wd = input.dataset.wd;
      const field = input.dataset.field;
      if (!newWeekly[wd]) newWeekly[wd] = {};
      newWeekly[wd][field] = input.value || "";
    });
    // Limpia días sin start.
    Object.keys(newWeekly).forEach((wd) => {
      if (!newWeekly[wd].start) delete newWeekly[wd];
    });

    const data = { type: newType, graceMinutes: newGrace, weekly: newWeekly };
    try {
      await saveTeacherSchedule(email, data);
      ADMIN_STATE.schedules[email] = { email, ...data };
      toast("Horario guardado ✅");
      close();
      renderAdminBody();
    } catch (err) {
      console.error(err);
      toast("No se pudo guardar el horario. Revisa permisos/reglas.");
    }
  });
}

/* ============================================================================
   12) RENDER BOTONES
============================================================================ */
function groupBySection(buttons = []) {
  const map = new Map();

  for (const button of buttons) {
    const section = button.section || "Accesos";
    if (!map.has(section)) {
      map.set(section, []);
    }
    map.get(section).push(button);
  }

  return map;
}

function isAdminUser(user = APP_STATE.activeUser) {
  return ADMIN_EMAILS.includes(emailKey(user));
}

// ¿La docente activa tiene habilitado el módulo de Bitácora Académica?
function isAcademicEnabled(user = APP_STATE.activeUser) {
  const email = emailKey(user);
  return !!HUB.USERS?.[email]?.academica;
}

function getResolvedButtonState(button, links = {}) {
  const isSpecial =
    button?.id === "carnet" ||
    button?.id === "jornada" ||
    button?.id === "adminPanel" ||
    button?.id === "academicModule";
  if (button?.adminOnly && !isAdminUser()) {
    return { isSpecial: false, url: "", available: false, visible: false };
  }
  // El módulo académico solo se muestra a docentes habilitadas (o admin).
  if (button?.id === "academicModule") {
    const allow = isAcademicEnabled() || isAdminUser();
    return { isSpecial: true, url: "__SPECIAL__", available: allow, visible: allow };
  }
  const url = isSpecial ? "__SPECIAL__" : String(links?.[button?.id] || "").trim();
  const available = isSpecial || !!url;
  const visible = isSpecial || available || !!button?.showWhenMissing;

  return {
    isSpecial,
    url,
    available,
    visible
  };
}

function renderButtons(buttons = [], links = {}, profile = null) {
  const grid = $("#grid");
  if (!grid) return;

  APP_STATE.activeLinks = links || {};
  APP_STATE.activeProfile = profile || null;

  const filteredButtons = buttons.filter((button) => {
    const state = getResolvedButtonState(button, APP_STATE.activeLinks);
    return state.visible;
  });

  const sections = groupBySection(filteredButtons);
  let html = `
    <section class="hubHero" aria-label="Inicio de hoy">
      <div class="heroCopy">
        <p>Inicio de hoy</p>
        <h1>Docentes Musicala</h1>
        <span>Inicia tu jornada, deja a mano la bitácora de clase y conserva tus recursos docentes en un solo lugar.</span>
      </div>

      <article class="heroShiftCard">
        <p>Jornada</p>
        <h2>Registro de jornada</h2>
        <span>Registra ingreso y salida. Sede requiere QR; hogar y virtual se confirman manualmente.</span>
        <div class="heroShiftActions">
          <button class="heroPrimary" type="button" data-id="jornada">Registrar ingreso / salida</button>
          <button class="heroSecondary" type="button" data-id="bitacoraClases">Bitácora de clase</button>
          <button class="heroSecondary" type="button" data-id="bitacoraClasesNueva">Nueva versión</button>
        </div>
      </article>
    </section>

    <details class="teacherInstructions">
      <summary>¿Cómo usar esta app?</summary>
      <div class="teacherInstructionsGrid">
        <div class="teacherInstructionItem">Revisa tu información y accesos asignados al iniciar sesión.</div>
        <div class="teacherInstructionItem">Para clases en sede, registra ingreso y salida escaneando el QR correspondiente.</div>
        <div class="teacherInstructionItem">Para clases a hogar o virtuales, usa el registro manual disponible en la app.</div>
        <div class="teacherInstructionItem">Al terminar tus clases, completa la bitácora para dejar evidencia del proceso.</div>
        <div class="teacherInstructionItem">En “Mi trabajo hoy” encontrarás tus accesos, documentos y enlaces importantes.</div>
        <div class="teacherInstructionItem">Puedes instalar la app en tu dispositivo para abrirla más fácil.</div>
        <div class="teacherInstructionItem">Cuando termines en un equipo compartido, cierra sesión desde el menú.</div>
        <div class="teacherInstructionItem">Si la cámara no funciona, revisa permisos del navegador, buena iluminación y cámara seleccionada.</div>
      </div>
    </details>
  `;

  for (const [section, items] of sections.entries()) {
    html += `
      <div class="secBlock" data-sec="${escapeHtml(section)}" style="grid-column: 1 / -1;">
        <div class="secTitle">${escapeHtml(section)}</div>
      </div>
    `;

    html += items
      .map((button) => {
        const state = getResolvedButtonState(button, APP_STATE.activeLinks);
        const tileClass = state.available ? "tile" : "tile pending";
        const badge = state.available
          ? '<span class="badge ok">Abrir</span>'
          : '<span class="badge">Pendiente</span>';

        return `
          <button
            class="${tileClass}"
            type="button"
            data-id="${escapeHtml(button.id)}"
            aria-label="${escapeHtml(button.title)}"
          >
            <div class="tileTop">
              <div class="ico" aria-hidden="true">${escapeHtml(button.icon)}</div>
              ${badge}
            </div>
            <div class="tileText">
              <div class="tTitle">${escapeHtml(button.title)}</div>
              <div class="tSub">${escapeHtml(button.subtitle)}</div>
            </div>
          </button>
        `;
      })
      .join("");
  }

  grid.innerHTML = html;
  ensureMusiProfeBot();

  if (!grid.dataset.boundClick) {
    grid.dataset.boundClick = "true";
    grid.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest("button[data-id]");
        if (!button) return;

        const id = button.getAttribute("data-id");
        handleButtonAction(id, button);
      },
      { passive: true }
    );
  }
}

function getMusiProfeAnswer(question = "") {
  const normalized = normalizeText(question);
  const found = MUSIPROFE_KNOWLEDGE.find((item) =>
    item.match.some((term) => normalized.includes(normalizeText(term)))
  );

  if (found) return found.answer;
  return "Puedo ayudarte con jornada, QR, cierre de sesión abierta, bitácoras, enlaces, cámara y recursos de clase. Escríbeme qué necesitas revisar.";
}

function addMusiProfeMessage(body, who = "bot") {
  const log = $("#musiProfeLog");
  if (!log) return;

  const message = document.createElement("div");
  message.className = `musiProfeMsg ${who === "user" ? "fromUser" : "fromBot"}`;
  message.textContent = body;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

function ensureMusiProfeBot() {
  if ($("#musiProfeBot")) return;

  const bot = document.createElement("aside");
  bot.id = "musiProfeBot";
  bot.className = "musiProfeBot";
  bot.innerHTML = `
    <button class="musiProfeFab" id="musiProfeFab" type="button" aria-expanded="false" aria-controls="musiProfePanel">
      <span aria-hidden="true">MP</span>
      <strong>¿Cómo les podemos ayudar?</strong>
    </button>
    <section class="musiProfePanel" id="musiProfePanel" hidden>
      <div class="musiProfeHead">
        <div>
          <p>MusiProfe</p>
          <strong>Asistente docente</strong>
        </div>
        <button class="btnGhost compact" id="musiProfeClose" type="button">Cerrar</button>
      </div>
      <div class="musiProfeLog" id="musiProfeLog" aria-live="polite"></div>
      <div class="musiProfeChips">
        ${MUSIPROFE_SUGGESTIONS.map((item) => `<button type="button" data-musi-question="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
      </div>
      <form class="musiProfeForm" id="musiProfeForm">
        <input id="musiProfeInput" type="text" autocomplete="off" placeholder="Escribe tu duda" />
        <button type="submit">Enviar</button>
      </form>
    </section>
  `;

  document.body.appendChild(bot);
  const fab = $("#musiProfeFab", bot);
  const panel = $("#musiProfePanel", bot);
  const form = $("#musiProfeForm", bot);
  const input = $("#musiProfeInput", bot);

  const open = () => {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (!$("#musiProfeLog", bot)?.children.length) {
      addMusiProfeMessage("Hola, soy MusiProfe. Puedo orientarles con jornada, QR, bitácoras y accesos de la app.");
    }
    setTimeout(() => input?.focus(), 30);
  };

  const close = () => {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  };

  fab?.addEventListener("click", () => {
    if (panel.hidden) open();
    else close();
  });
  $("#musiProfeClose", bot)?.addEventListener("click", close);
  bot.querySelectorAll("[data-musi-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.getAttribute("data-musi-question") || "";
      addMusiProfeMessage(question, "user");
      addMusiProfeMessage(getMusiProfeAnswer(question));
    });
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = String(input?.value || "").trim();
    if (!question) return;
    addMusiProfeMessage(question, "user");
    addMusiProfeMessage(getMusiProfeAnswer(question));
    input.value = "";
  });
}

async function handleButtonAction(id, trigger = null) {
  if (!id) return;

  if (id === "carnet") {
    openCarnet(APP_STATE.activeProfile);
    return;
  }

  if (id === "jornada") {
    openTeacherShiftModal();
    return;
  }

  if (id === "adminPanel") {
    openAdminPanel();
    return;
  }

  if (id === "academicModule") {
    openAcademicModule();
    return;
  }

  const url = String(APP_STATE.activeLinks?.[id] || "").trim();
  if (!url) {
    toast(`Aún no tienes un link asignado para “${getButtonTitle(id)}” 🙃`);
    return;
  }

  if (!openExternal(url)) {
    toast("Ese link está raro y lo bloqueé 😶‍🌫️");
  }
}

/* ============================================================================
   11d) MÓDULO INTERNO: BITÁCORA ACADÉMICA (iframe overlay)
   ----------------------------------------------------------------------------
   Abre modules/bitacora-academica dentro del HUB, pasando el contexto de la
   docente (correo, nombre, rol). El módulo resuelve su fuente de datos en
   modules/bitacora-academica/teachers.js. No se abre una app externa.
============================================================================ */
let academicOverlay = null;
let academicMsgWired = false;

function buildAcademicModuleUrl() {
  const user = APP_STATE.activeUser;
  const email = emailKey(user);
  const name = getTeacherName();
  const role = isAdminUser() ? "admin" : "docente";
  const params = new URLSearchParams({
    email,
    name,
    role,
    embedded: "1"
  });
  return `./modules/bitacora-academica/index.html?${params.toString()}`;
}

function openAcademicModule() {
  if (!isAcademicEnabled() && !isAdminUser()) {
    toast("El módulo de Bitácora Académica no está habilitado para tu cuenta.");
    return;
  }

  // Escucha el "Volver al HUB" del iframe una sola vez.
  if (!academicMsgWired) {
    window.addEventListener("message", (event) => {
      if (event?.data?.type === "closeAcademicModule") closeAcademicModule();
    });
    academicMsgWired = true;
  }

  if (!academicOverlay) {
    academicOverlay = document.createElement("div");
    academicOverlay.id = "academicOverlay";
    academicOverlay.className = "academicOverlay";
    academicOverlay.innerHTML = `
      <div class="academicBar">
        <span class="academicBarTitle">🎯 Bitácora Académica</span>
        <button class="btnGhost" id="academicCloseBtn" type="button" aria-label="Cerrar módulo">Cerrar ✕</button>
      </div>
      <iframe id="academicFrame" class="academicFrame" title="Bitácora Académica"
        referrerpolicy="no-referrer"></iframe>
    `;
    document.body.appendChild(academicOverlay);
    $("#academicCloseBtn", academicOverlay)?.addEventListener("click", closeAcademicModule);
  }

  const frame = $("#academicFrame", academicOverlay);
  if (frame) frame.src = buildAcademicModuleUrl();

  academicOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeAcademicModule() {
  if (!academicOverlay) return;
  academicOverlay.hidden = true;
  document.body.style.overflow = "";
  const frame = $("#academicFrame", academicOverlay);
  if (frame) frame.src = "about:blank"; // libera recursos
}

/* ============================================================================
   12) AUTH
============================================================================ */
let loginInFlight = false;

function friendlyAuthError(code = "") {
  if (code === "auth/unauthorized-domain") return "Dominio no autorizado en Firebase Auth.";
  if (code === "auth/popup-blocked") return "El navegador bloqueó la ventana de inicio de sesión.";
  if (code === "auth/cancelled-popup-request") return "Se canceló el intento de inicio de sesión.";
  if (code === "auth/popup-closed-by-user") return "Cerraste la ventana de inicio de sesión.";
  if (code === "auth/network-request-failed") return "Falló la red. Revisa internet.";
  if (code === "auth/internal-error") return "Hubo un error interno de autenticación.";
  return "";
}

async function ensureAuthPersistence(auth) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    return true;
  } catch (error) {
    console.warn("No se pudo setPersistence:", error);
    return false;
  }
}

async function doGoogleLogin(auth) {
  if (loginInFlight) return;

  const btnGoogle = $("#btn-google");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  loginInFlight = true;
  setButtonBusy(btnGoogle, true, "Entrando...");

  try {
    await ensureAuthPersistence(auth);

    if (isStandalone()) {
      toast("Abriendo Google para iniciar sesión…");
    }

    await signInWithPopup(auth, provider);
  } catch (error) {
    const code = error?.code || "";

    if (code === "auth/popup-closed-by-user") return;

    const friendly = friendlyAuthError(code);

    if (code === "auth/popup-blocked" && isStandalone()) {
      toast("La app instalada bloqueó la ventana de Google. Ahí toca resolver eso aparte 😵‍💫");
    } else {
      toast(friendly ? `No se pudo iniciar sesión: ${friendly}` : "No se pudo iniciar sesión");
    }

    console.error("Login error:", error);
  } finally {
    loginInFlight = false;
    setButtonBusy(btnGoogle, false);
  }
}

async function doLogout(auth) {
  try {
    closeDrawer();
    await signOut(auth);
  } catch (error) {
    toast("No se pudo cerrar sesión");
    console.error("Logout error:", error);
  }
}

/* ============================================================================
   13) APP BOOT
============================================================================ */
function setUserLine(profile, user) {
  const userLine = $("#user-line");
  if (!userLine) return;
  userLine.textContent = profile?.label || prettyName(user, emailKey(user));
}

async function handleAuthorizedUser(user) {
  const email = emailKey(user);
  const profile = HUB.USERS?.[email] || null;
  const mergedLinks = buildLinksForUser(email);

  APP_STATE.activeUser = user;
  APP_STATE.activeProfile = profile;
  APP_STATE.activeLinks = mergedLinks;

  setUserLine(profile, user);
  setDrawerProfile(profile, user);

  show("app");
  renderButtons(HUB.BUTTONS, mergedLinks, profile);
  await refreshTeacherJornadaStatus();
}

async function handleUnauthorizedUser(auth) {
  toast("Tu correo no está autorizado para este hub 🫠");

  try {
    await signOut(auth);
  } catch (_) {}

  APP_STATE.activeUser = null;
  APP_STATE.activeProfile = null;
  APP_STATE.activeLinks = {};

  show("login");
  closeDrawer();
}

async function mount() {
  try {
    document.title = "Musicala Docentes Hub";
  } catch (_) {}

  if (!assertConfig(firebaseConfig)) {
    show("login");
    toast("Falta configurar Firebase en app.js");
    return;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  APP_STATE.db = db;

  await ensureAuthPersistence(auth);

  $("#btn-google")?.addEventListener("click", () => doGoogleLogin(auth));
  $("#btn-logout")?.addEventListener("click", () => doLogout(auth));

  wireDrawerHandlers(auth);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      APP_STATE.activeUser = null;
      APP_STATE.activeProfile = null;
      APP_STATE.activeLinks = {};

      show("login");
      closeDrawer();
      return;
    }

    const email = emailKey(user);

    if (hasUserRestrictions() && !HUB.USERS[email]) {
      await handleUnauthorizedUser(auth);
      return;
    }

    await handleAuthorizedUser(user);
  });
}

/* ============================================================================
   14) INIT
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("BUILD", BUILD);
  registerServiceWorker();
  setupInstallPrompt();
  wireUpdateBanner();
  mount();
});