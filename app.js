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
*/

const BUILD = "2026-05-26.1";

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
      links: {
        horarioAnual: "https://musicala.github.io/horario2026emilybejarano/",
        bitacorasClasePendientes: "https://musicalaescuela.github.io/pendientesapuntesytareasCata/",
        bitacoraAcademica: ""
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
        bitacoraAcademica: ""
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
      id: "bitacoraAcademica",
      icon: "✅",
      title: "Bitácora tareas académicas",
      subtitle: "Pendientes",
      section: "Gestión docente",
      showWhenMissing: true
    },

    { id: "induccion", icon: "🎓", title: "Inducción Docentes Musicala", subtitle: "Onboarding", section: "Recursos" },
    { id: "protocolosMusica", icon: "🎵", title: "Protocolos clases de música", subtitle: "Guía", section: "Recursos" },
    { id: "muestras", icon: "🎭", title: "Info Muestras de proceso", subtitle: "Planeación", section: "Recursos" },
    { id: "guiones", icon: "🎬", title: "Plantilla guiones de video", subtitle: "Contenido", section: "Recursos" },
    { id: "explicacionArtes", icon: "🧩", title: "Explicación de las artes", subtitle: "Oferta", section: "Recursos" },
    { id: "edades", icon: "📏", title: "Rangos de edades", subtitle: "Guía rápida", section: "Recursos" },

    { id: "nomina", icon: "💰", title: "Novedades nómina", subtitle: "General", section: "Institucional" },
    { id: "calendario", icon: "🗓️", title: "Calendario Académico", subtitle: "General", section: "Institucional", showWhenMissing: true },
    { id: "reglamento", icon: "📜", title: "Reglamento interno de trabajo", subtitle: "Documento", section: "Institucional" },
    { id: "documentosContratacion", icon: "📁", title: "Documentos de contratación", subtitle: "Carpeta", section: "Institucional", showWhenMissing: true },
    { id: "vacaciones", icon: "🌞", title: "Info Vacaciones artísticas", subtitle: "General", section: "Institucional" },
    { id: "musicalaFest", icon: "🎸", title: "Musicala Fest 2025", subtitle: "Programa", section: "Institucional" }
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
  getDocs,
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

  const promptUpdate = (registration) => {
    if (!registration?.waiting) return;

    const wrap = $("#pwa-update");
    if (wrap) wrap.hidden = false;

    toast("Hay una actualización lista ✨", {
      actionText: "Actualizar",
      sticky: true,
      onAction: () => {
        try {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        } catch (error) {
          console.warn("No se pudo activar update", error);
          toast("No se pudo actualizar, recarga la página 🙃");
        }
      }
    });
  };

  try {
    const registration = await navigator.serviceWorker.register("./sw.js", {
      scope: "./"
    });

    promptUpdate(registration);

    registration.addEventListener("updatefound", () => {
      const sw = registration.installing;
      if (!sw) return;

      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          promptUpdate(registration);
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (window.__reloadingForSW) return;
      window.__reloadingForSW = true;
      window.location.reload();
    });

    registration.update?.().catch(() => null);
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
    answer: "La bitácora está en el botón Bitácora de clase. Después de terminar tus clases, deja allí la evidencia y el seguimiento del proceso del estudiante."
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

function getResolvedButtonState(button, links = {}) {
  const isSpecial = button?.id === "carnet" || button?.id === "jornada";
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
