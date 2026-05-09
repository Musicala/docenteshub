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

const BUILD = "2026-05-08.1";

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
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
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
  db: null
};

const TEACHER_SITE_QR_ARRIVAL = "ADM-LLEGADA";
const TEACHER_SITE_QR_EXIT = "ADM-SALIDA";
const TEACHER_SITE_QR_LUNCH = [
  "ADM-ALMUERZO-INICIO",
  "ADM-ALMUERZO-FIN"
];

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

function isValidTeacherSiteQr(decodedText) {
  return normalizeQrValue(decodedText) === TEACHER_SITE_QR_ARRIVAL;
}

function getTeacherQrMessage(decodedText) {
  const value = normalizeQrValue(decodedText);

  if (value === TEACHER_SITE_QR_ARRIVAL) {
    return {
      status: "valid",
      value,
      message: "QR válido. Guardando registro..."
    };
  }

  if (value === TEACHER_SITE_QR_EXIT) {
    return {
      status: "exit",
      value,
      message: "Este QR es de salida. Para iniciar jornada en sede, escanea el QR de Llegada."
    };
  }

  if (TEACHER_SITE_QR_LUNCH.includes(value)) {
    return {
      status: "lunch",
      value,
      message: "Este QR es de almuerzo. Este Hub todavía no registra almuerzos."
    };
  }

  return {
    status: "unknown",
    value,
    message: "Este QR no corresponde al registro de clase en sede. Escanea el QR de Llegada."
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
          <h2>Inicio de jornada</h2>
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
        <p>Elige la modalidad para registrar el inicio de tu jornada.</p>
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
  setTeacherShiftPanel("<p>Elige la modalidad para registrar el inicio de tu jornada.</p>");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  await loadTeacherShiftSummary();
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

function getTodayJornadaStatus(records = []) {
  const hasStart = records.some((record) => record.action === "inicio_clase");
  const hasEnd = records.some((record) => record.action === "fin_jornada");
  if (hasEnd) return "finished";
  if (hasStart) return "started";
  return "idle";
}

function updateHeroJornadaButton(status = "idle") {
  const button = $(".heroPrimary[data-id='jornada']");
  if (!button) return;

  button.disabled = false;
  button.classList.remove("isFinalizing", "isDone");
  button.removeAttribute("data-jornada-action");

  if (status === "started") {
    button.textContent = "Finalizar jornada";
    button.dataset.jornadaAction = "finish";
    button.classList.add("isFinalizing");
    return;
  }

  if (status === "finished") {
    button.textContent = "Jornada finalizada";
    button.dataset.jornadaAction = "done";
    button.classList.add("isDone");
    button.disabled = true;
    return;
  }

  button.textContent = "Iniciar jornada";
}

async function refreshTeacherJornadaStatus() {
  try {
    const records = await fetchTodayTeacherShiftRecords();
    updateHeroJornadaButton(getTodayJornadaStatus(records));
  } catch (error) {
    console.warn("No se pudo actualizar estado de jornada", error);
    updateHeroJornadaButton("idle");
  }
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
          <span>Escanea el QR autorizado de Musicala para guardar el inicio.</span>
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
  console.info("[Musicala QR le?do]", decodedText);
  await stopTeacherQrReader();

  const qrInfo = getTeacherQrMessage(decodedText);
  if (readout) {
    readout.textContent = `QR le?do: ${qrInfo.value || "sin valor"}`;
  }

  if (!isValidTeacherSiteQr(decodedText)) {
    if (result) result.textContent = qrInfo.message;
    toast(qrInfo.message);
    return;
  }

  if (result) result.textContent = qrInfo.message;
  await saveTeacherClassStartRecord({
    modalidad: "sede",
    source: "qr_sede",
    raw: decodedText
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
    await addDoc(collection(APP_STATE.db, "teacherClassStartRecords"), payload);
    toast(successMessage);
    if (teacherShiftModal && !teacherShiftModal.hidden) {
      updateTeacherShiftHeader();
      await loadTeacherShiftSummary();
    }
  } catch (error) {
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
    updateHeroJornadaButton(getTodayJornadaStatus(records));

    if (!records.length) {
      target.textContent = "Aún no hay registros de inicio de jornada hoy.";
      return;
    }

    const rows = records
      .map((data) => {
        const actionLabel = data.action === "fin_jornada" ? "finalización" : data.modalidad || "-";
        return `
          <tr>
            <td>${escapeHtml(actionLabel)}</td>
            <td>${escapeHtml(data.time || "-")}</td>
            <td>${escapeHtml(data.source || "-")}</td>
          </tr>
        `;
      }).join("");

    target.innerHTML = `
      <div class="recordTableWrap">
        <table class="recordTable">
          <thead>
            <tr>
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
        <span>Marca el inicio de trabajo. Sede requiere QR; hogar y virtual se confirman manualmente.</span>
        <div class="heroShiftActions">
          <button class="heroPrimary" type="button" data-id="jornada">Iniciar jornada</button>
          <button class="heroSecondary" type="button" data-id="bitacoraClases">Bitácora de clase</button>
        </div>
      </article>
    </section>

    <details class="teacherInstructions">
      <summary>¿Cómo usar este Hub?</summary>
      <div class="teacherInstructionsGrid">
        <div class="teacherInstructionItem">Inicia sesión con tu cuenta autorizada por Musicala.</div>
        <div class="teacherInstructionItem">Si estás en sede, registra tu llegada escaneando el QR de Llegada.</div>
        <div class="teacherInstructionItem">Si estás en clase a hogar o virtual, usa el registro manual correspondiente.</div>
        <div class="teacherInstructionItem">Usa la bitácora para dejar registro de tus clases.</div>
        <div class="teacherInstructionItem">Si la cámara falla, revisa permisos del navegador, buena luz y que estés usando la cámara correcta.</div>
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

async function handleButtonAction(id, trigger = null) {
  if (!id) return;

  if (id === "carnet") {
    openCarnet(APP_STATE.activeProfile);
    return;
  }

  if (id === "jornada") {
    const jornadaAction = trigger?.dataset?.jornadaAction || "";
    if (jornadaAction === "finish") {
      await saveTeacherClassStartRecord({
        modalidad: "jornada",
        source: "manual_fin",
        raw: "MANUAL_FIN_JORNADA",
        action: "fin_jornada",
        successMessage: "Finalización de jornada guardada.",
        button: trigger
      });
      return;
    }

    if (jornadaAction === "done") {
      toast("Tu jornada de hoy ya está finalizada.");
      return;
    }

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
