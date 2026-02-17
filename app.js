/* Musicala · Docentes Hub (SIMPLE + Firebase Google Login)
   - Login con Google (Firebase Auth)
   - Hub exclusivo para Docentes (lista blanca por correo)
   - Links generales + links personalizados por usuario (Carnet / Horario / etc.)
   - Carnet abre modal (imagen en /assets/*.png)
*/
const BUILD = "2026-02-17.1";

/* ===========
   1) Firebase Config (YA LISTO)
   Nota: si este hub va en OTRO proyecto Firebase, cambia esto.
=========== */
const firebaseConfig = {
  apiKey: "AIzaSyC06dLl2Lig3-kD4OVmh4C9LpFW9AeTyOc",
  authDomain: "musicala-docentes-hub.firebaseapp.com",
  projectId: "musicala-docentes-hub",
  storageBucket: "musicala-docentes-hub.firebasestorage.app",
  messagingSenderId: "936379833270",
  appId: "1:936379833270:web:512519cf318c919e3abf17"
};

/* ===========
   2) Config Docentes Hub
   - GENERAL_LINKS: le sale a TODOS los autorizados
   - USERS: lista blanca por correo + perfil (label, carnet, links personalizados)
   - BUTTONS: catálogo de botones (id debe existir en links o tener handler especial)
=========== */
const HUB = {
  name: "Docentes · Musicala",

  // Links generales para docentes (los que no tengan URL quedan “Pendiente”)
  GENERAL_LINKS: {
    // 🧾 Institucional / info
    salones: "https://musicala.github.io/asignaciondesalones/",
    nomina: "https://docs.google.com/forms/d/e/1FAIpQLSeMOhoY9d8JOf1Oq8DnD_aSEDkBmOXmzYJtlCCU-7CNVYjnLA/viewform",
    observacion: "https://docs.google.com/forms/d/1z8TEQACP6L8d0vTWEpSl2RQJ198PwQwzH4-UKqq9EQA/viewform?edit_requested=true",
    induccion: "https://musicalaescuela.github.io/inducciondocentesmusicala/",
    infoEstudiantes: "https://musicalaescuela.github.io/verificaci-nestudiantes/",
    jornada: "https://musicala.github.io/registrojornadadocentes/",
    muestras: "https://musicalaescuela.github.io/muestrasdeproceso/#musica",
    guiones: "https://musicalaescuela.github.io/plantillaparaguiones/",
    protocolosMusica: "https://musicalaescuela.github.io/protocolosmusica/",
    vacaciones: "https://musicalaescuela.github.io/vacacionesartisticas/",
    explicacionArtes: "https://musicala.github.io/explicacionartes/",
    edades: "https://musicala.github.io/musiedades/",
    reglamento: "https://drive.google.com/file/d/1Oda0c_FnHrsgME2GE8LCb7z5huH-YbBk/view",
    musicalaFest: "https://musicalaescuela.github.io/programamusicalafest2025/",

    // 🗓️ Pendientes (pégalas cuando las tengan)
    calendario: "",             // Calendario Académico
    apuntes: "",                // Apuntes y tareas pendientes
    bitacoraAcademica: "",      // Bitácora de tareas académicas
    documentosContratacion: "", // Carpeta o página con documentos de contratación
    horarioAnual: "",           // Horario anual 2026 (si es general)
    bitacoraClases: ""          // Registro de bitácora de clases (me dejaste un link duplicado en el mensaje)
  },

  // Lista blanca (DOCENTES)
  // carnet: ruta a imagen en /assets/*.png
  // links: overrides por usuario (si alguien tiene un horario personal, por ejemplo)
  USERS: {
    "alekcaballeromusic@gmail.com": {
      label: "Alek Caballero",
      carnet: "./assets/alekcaballero.png",
      links: { /* horarioAnual: "https://..." */ }
    },
    "catalina.medina.leal@gmail.com": {
      label: "Catalina Medina",
      carnet: "./assets/catalinamedina.png",
      links: { }
    },
    "angiecamilar4@gmail.com": {
      label: "Angie (Camila) Rodríguez",
      carnet: "./assets/angienitola.png",
      links: { }
    },
    "emilybejarano@gmail.com": {
      label: "Emily Bejarano",
      carnet: "./assets/emilybejarano.png",
      links: { }
    },
    "laurasanchez@gmail.com": {
      label: "Laura Sánchez",
      carnet: "./assets/laurasanchez.png",
      links: { }
    }
  },

  // Catálogo de botones (con secciones)
  BUTTONS: [
    // ===== MI TRABAJO HOY =====
    { id: "carnet", icon: "🪪", title: "Carnet docente", subtitle: "Personal", section: "Mi trabajo hoy" },
    { id: "jornada", icon: "⏱️", title: "Registro de jornada", subtitle: "Diario", section: "Mi trabajo hoy" },
    { id: "salones", icon: "🏫", title: "Asignación de salones", subtitle: "Sede", section: "Mi trabajo hoy" },
    { id: "infoEstudiantes", icon: "🧒", title: "Info estudiantes", subtitle: "Verificación", section: "Mi trabajo hoy" },
    { id: "horarioAnual", icon: "📅", title: "Horario anual 2026", subtitle: "General o personal", section: "Mi trabajo hoy" },

    // ===== GESTIÓN DOCENTE =====
    { id: "apuntes", icon: "📝", title: "Apuntes y tareas pendientes", subtitle: "Organización", section: "Gestión docente" },
    { id: "observacion", icon: "👀", title: "Formulario observación docente", subtitle: "Registro", section: "Gestión docente" },
    { id: "bitacoraClases", icon: "📒", title: "Bitácora de clases", subtitle: "Seguimiento", section: "Gestión docente" },
    { id: "bitacoraAcademica", icon: "✅", title: "Bitácora tareas académicas", subtitle: "Pendientes", section: "Gestión docente" },

    // ===== RECURSOS PEDAGÓGICOS =====
    { id: "induccion", icon: "🎓", title: "Inducción Docentes Musicala", subtitle: "Onboarding", section: "Recursos" },
    { id: "protocolosMusica", icon: "🎵", title: "Protocolos clases de música", subtitle: "Guía", section: "Recursos" },
    { id: "muestras", icon: "🎭", title: "Info Muestras de proceso", subtitle: "Planeación", section: "Recursos" },
    { id: "guiones", icon: "🎬", title: "Plantilla guiones de video", subtitle: "Contenido", section: "Recursos" },
    { id: "explicacionArtes", icon: "🧩", title: "Explicación de las artes", subtitle: "Oferta", section: "Recursos" },
    { id: "edades", icon: "📏", title: "Rangos de edades", subtitle: "Guía rápida", section: "Recursos" },

    // ===== INSTITUCIONAL =====
    { id: "nomina", icon: "💰", title: "Novedades nómina", subtitle: "General", section: "Institucional" },
    { id: "calendario", icon: "🗓️", title: "Calendario Académico", subtitle: "General", section: "Institucional" },
    { id: "reglamento", icon: "📜", title: "Reglamento interno de trabajo", subtitle: "Documento", section: "Institucional" },
    { id: "documentosContratacion", icon: "📁", title: "Documentos de contratación", subtitle: "Carpeta", section: "Institucional" },
    { id: "vacaciones", icon: "🌞", title: "Info Vacaciones artísticas", subtitle: "General", section: "Institucional" },
    { id: "musicalaFest", icon: "🎸", title: "Musicala Fest 2025", subtitle: "Programa", section: "Institucional" }
  ]
};

/* ===========
   3) Firebase SDK (CDN modular)
=========== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

/* ===========
   Helpers UI
=========== */
const $ = (sel, el = document) => el.querySelector(sel);

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pickToastEl() {
  const a = $("#toast-app");
  const b = $("#toast");
  if (a && !a.hidden) return a;
  return b || a || null;
}

let toastTimer = null;
/**
 * toast("Mensaje", { actionText:"Actualizar", onAction:()=>{}, sticky:true, ms:5000 })
 */
function toast(msg, opts = {}) {
  const el = pickToastEl();
  if (!el) return;

  const { actionText = "", onAction = null, sticky = false, ms = 2600 } = opts || {};

  el.classList.remove("show");
  el.hidden = false;
  el.innerHTML = "";

  const msgSpan = document.createElement("span");
  msgSpan.className = "toastMsg";
  msgSpan.textContent = String(msg ?? "");
  el.appendChild(msgSpan);

  if (actionText) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toastBtn";
    btn.textContent = actionText;
    btn.addEventListener("click", () => {
      try { onAction && onAction(); }
      finally { el.classList.remove("show"); }
    });
    el.appendChild(btn);
  }

  requestAnimationFrame(() => el.classList.add("show"));

  clearTimeout(toastTimer);
  if (!sticky) {
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      if (el.id === "toast-app") el.hidden = true;
    }, Math.max(1200, Number(ms) || 2600));
  }
}

function show(which) {
  const vLogin = $("#view-login");
  const vApp = $("#view-app");
  if (!vLogin || !vApp) return;

  if (which === "login") {
    vLogin.hidden = false;
    vApp.hidden = true;
    const tApp = $("#toast-app");
    if (tApp) tApp.hidden = true;
  } else {
    vLogin.hidden = true;
    vApp.hidden = false;
  }
}

/* ===========
   PWA: install + SW + Update banner button
=========== */
let __deferredInstallPrompt = null;

function isIOS() {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua);
}
function isStandalone() {
  if (window.navigator.standalone) return true; // iOS Safari
  return window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
}

function setInstallUI(visible) {
  const b1 = document.getElementById("btn-install");
  const b2 = document.getElementById("btn-install-2");
  if (b1) b1.hidden = !visible;
  if (b2) b2.hidden = !visible;
}

async function trySkipWaiting() {
  try {
    const reg = await navigator.serviceWorker.getRegistration("./");
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
      return true;
    }
  } catch (_) {}
  return false;
}

function wireUpdateBanner() {
  const wrap = document.getElementById("pwa-update");
  const btn = document.getElementById("btn-update");
  if (!wrap || !btn) return;

  btn.addEventListener("click", async () => {
    const ok = await trySkipWaiting();
    if (!ok) toast("No hay actualización lista aún 🙃");
  });

  // Solo mostramos el banner si hay waiting SW
  const maybeShow = async () => {
    try {
      const reg = await navigator.serviceWorker.getRegistration("./");
      if (reg?.waiting) wrap.hidden = false;
    } catch (_) {}
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e?.data?.type === "SW_ACTIVATED") {
        // cuando el nuevo SW se activa, ocultamos banner
        wrap.hidden = true;
      }
    });
    maybeShow();
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const promptUpdate = (reg) => {
    if (!reg || !reg.waiting) return;

    // también mostramos banner si existe
    const wrap = document.getElementById("pwa-update");
    if (wrap) wrap.hidden = false;

    toast("Hay una actualización lista ✨", {
      actionText: "Actualizar",
      sticky: true,
      onAction: () => {
        try {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        } catch (e) {
          console.warn("No se pudo activar update", e);
          toast("No se pudo actualizar, recarga la página 🙃");
        }
      }
    });
  };

  try {
    const reg = await navigator.serviceWorker.register("./sw.js", { scope: "./" });

    promptUpdate(reg);

    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      if (!sw) return;

      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          promptUpdate(reg);
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (window.__reloadingForSW) return;
      window.__reloadingForSW = true;
      window.location.reload();
    });

    reg.update?.().catch(() => null);
  } catch (e) {
    console.warn("SW no se pudo registrar", e);
  }
}

function setupInstallPrompt() {
  if (isStandalone()) {
    setInstallUI(false);
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    __deferredInstallPrompt = e;
    setInstallUI(true);
  });

  window.addEventListener("appinstalled", () => {
    __deferredInstallPrompt = null;
    setInstallUI(false);
    toast("Instalada ✨");
  });

  const onInstallClick = async () => {
    if (isIOS() && !__deferredInstallPrompt) {
      toast("En iPhone/iPad: Compartir → “Agregar a pantalla de inicio”");
      return;
    }
    if (!__deferredInstallPrompt) {
      toast("Instalación no disponible todavía (abre en Chrome/Safari)");
      return;
    }

    __deferredInstallPrompt.prompt();
    const choice = await __deferredInstallPrompt.userChoice.catch(() => null);
    __deferredInstallPrompt = null;

    if (!choice || choice.outcome !== "accepted") {
      setInstallUI(false);
      setTimeout(() => setInstallUI(true), 8000);
      return;
    }
  };

  const b1 = document.getElementById("btn-install");
  const b2 = document.getElementById("btn-install-2");
  if (b1) b1.addEventListener("click", onInstallClick);
  if (b2) b2.addEventListener("click", onInstallClick);
}

/* ===========
   Carnet modal (se crea dinámico, no depende del HTML)
=========== */
let __carnetModal = null;

function ensureCarnetModal() {
  if (__carnetModal) return __carnetModal;

  const modal = document.createElement("div");
  modal.id = "carnetModal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Carnet docente");

  // Inline minimal style (para que funcione aunque el CSS no tenga nada)
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
        <button type="button" id="carnetClose" class="btnGhost" style="
          height:36px; padding:0 12px; border-radius:12px;
          border:1px solid rgba(11,16,32,.14); background: rgba(255,255,255,.92);
          font-weight:850; cursor:pointer;
        ">Cerrar</button>
      </div>

      <div class="carnetBody" style="padding: 14px;">
        <img id="carnetImg" alt="Carnet docente" style="
          width:100%;
          height:auto;
          border-radius: 16px;
          border: 1px solid rgba(11,16,32,.10);
          background: rgba(255,255,255,.6);
          display:block;
        " />
        <div id="carnetNote" style="
          margin-top: 10px;
          font-size: 12px;
          color: rgba(11,16,32,.68);
          text-align:center;
        ">Muestra este carnet para validar tu vinculación con Musicala.</div>
      </div>
    </div>
  `;

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  modal.querySelector("#carnetClose")?.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  document.body.appendChild(modal);
  __carnetModal = modal;
  return modal;
}

function openCarnet(profile) {
  const path = String(profile?.carnet || "").trim();
  if (!path) {
    toast("Este usuario no tiene carnet asignado en /assets 😶‍🌫️");
    return;
  }

  const modal = ensureCarnetModal();
  const img = modal.querySelector("#carnetImg");
  const title = modal.querySelector("#carnetTitle");

  if (title) title.textContent = `Carnet · ${profile?.label || "Docente"}`;

  if (img) {
    img.src = path;
    img.onerror = () => {
      toast("No pude cargar el carnet. Revisa el nombre del archivo en /assets 😵");
      img.onerror = null;
    };
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

/* ===========
   Render botones (agrupado por secciones)
=========== */
let ACTIVE_LINKS = {};
let ACTIVE_PROFILE = null;

function groupBySection(buttons = []) {
  const map = new Map();
  for (const b of buttons) {
    const sec = b.section || "Accesos";
    if (!map.has(sec)) map.set(sec, []);
    map.get(sec).push(b);
  }
  return map;
}

function renderButtons(buttons, links, profile) {
  const grid = $("#grid");
  if (!grid) return;

  ACTIVE_LINKS = links || {};
  ACTIVE_PROFILE = profile || null;

  const sections = groupBySection(buttons || []);
  let html = "";

  for (const [sec, items] of sections.entries()) {
    html += `
      <div class="secBlock" data-sec="${escapeHtml(sec)}" style="grid-column: 1 / -1;">
        <div class="secTitle" style="
          padding: 10px 4px 8px;
          font-weight: 920;
          letter-spacing: .1px;
          color: rgba(11,16,32,.82);
        ">${escapeHtml(sec)}</div>
      </div>
    `;

    html += items.map(b => {
      const isSpecial = (b.id === "carnet");
      const url = isSpecial ? "__SPECIAL__" : String(ACTIVE_LINKS[b.id] || "").trim();
      const pending = (!isSpecial && !url);
      const cls = pending ? "tile pending" : "tile";
      const badge = pending
        ? '<span class="badge">Pendiente</span>'
        : '<span class="badge ok">Abrir</span>';

      return `
        <button class="${cls}" type="button" data-id="${escapeHtml(b.id)}" aria-label="${escapeHtml(b.title)}">
          <div class="tileTop">
            <div class="ico" aria-hidden="true">${escapeHtml(b.icon)}</div>
            ${badge}
          </div>
          <div class="tileText">
            <div class="tTitle">${escapeHtml(b.title)}</div>
            <div class="tSub">${escapeHtml(b.subtitle)}</div>
          </div>
        </button>
      `;
    }).join("");
  }

  grid.innerHTML = html;

  if (!grid.__boundClick) {
    grid.__boundClick = true;
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;

      const id = btn.getAttribute("data-id");

      // Handler especial: carnet
      if (id === "carnet") {
        openCarnet(ACTIVE_PROFILE);
        return;
      }

      const url = String(ACTIVE_LINKS[id] || "").trim();
      if (!url) {
        toast(`Pendiente: falta pegar el link de “${id}”`);
        return;
      }

      // Asegura protocolo (evita links sin https://)
      const safeUrl = /^(https?:)?\/\//i.test(url) ? url : ("https://" + url);
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    }, { passive: true });
  }
}

/* ===========
   Auth
=========== */
function prettyName(user, fallbackEmail = "") {
  const name = user?.displayName || "";
  const email = user?.email || fallbackEmail || "";
  return name ? name : (email ? email : "Sesión activa");
}

function friendlyAuthError(code = "") {
  if (code === "auth/unauthorized-domain") return "Dominio no autorizado en Firebase Auth (Authorized domains).";
  if (code === "auth/popup-blocked") return "El navegador bloqueó el popup. En modo app instalada usamos redirect.";
  if (code === "auth/cancelled-popup-request") return "Se canceló el popup de inicio de sesión.";
  if (code === "auth/popup-closed-by-user") return "Cerraste el login.";
  if (code === "auth/network-request-failed") return "Falló la red. Revisa internet.";
  return "";
}

async function doGoogleLogin(auth) {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    await setPersistence(auth, browserLocalPersistence);

    if (isStandalone()) {
      await signInWithRedirect(auth, provider);
      return;
    }
    await signInWithPopup(auth, provider);
  } catch (err) {
    const code = err?.code || "";
    if (code === "auth/popup-closed-by-user") return;

    const friendly = friendlyAuthError(code);
    toast(friendly ? `No se pudo iniciar sesión: ${friendly}` : "No se pudo iniciar sesión");
    console.error("Login error:", err);
  }
}

async function doLogout(auth) {
  try {
    await signOut(auth);
  } catch (err) {
    toast("No se pudo cerrar sesión");
    console.error(err);
  }
}

/* ===========
   Boot
=========== */
function assertConfig(cfg) {
  const bad = !cfg || !cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId;
  if (!bad) return true;
  console.warn("Firebase config incompleto. Revisa firebaseConfig en app.js");
  return false;
}

async function finalizeRedirectIfAny(auth) {
  try {
    const res = await getRedirectResult(auth);
    if (res?.user) {
      console.log("Redirect login OK:", res.user.email || res.user.uid);
    }
  } catch (err) {
    const code = err?.code || "";
    if (code) {
      const friendly = friendlyAuthError(code);
      toast(friendly ? `Login redirect falló: ${friendly}` : "Login redirect falló");
      console.warn("Redirect result error:", err);
    }
  }
}

function emailKey(user) {
  return String(user?.email || "").toLowerCase().trim();
}

function hasUserRestrictions() {
  return HUB.USERS && Object.keys(HUB.USERS).length > 0;
}

function buildLinksForUser(email) {
  const base = { ...(HUB.GENERAL_LINKS || {}) };
  const prof = HUB.USERS?.[email] || null;
  const overrides = prof?.links || {};
  return { ...base, ...overrides };
}

async function mount() {
  // Título coherente
  try { document.title = "Musicala Docentes Hub"; } catch (_) {}

  if (!assertConfig(firebaseConfig)) {
    show("login");
    toast("Falta configurar Firebase en app.js");
    return;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.warn("No se pudo setPersistence:", e);
  }

  await finalizeRedirectIfAny(auth);

  const btnGoogle = $("#btn-google");
  const btnOut = $("#btn-logout");
  const userLine = $("#user-line");

  if (btnGoogle) btnGoogle.addEventListener("click", () => doGoogleLogin(auth));
  if (btnOut) btnOut.addEventListener("click", () => doLogout(auth));

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      show("login");
      return;
    }

    const email = emailKey(user);

    // Lista blanca
    if (hasUserRestrictions() && !HUB.USERS[email]) {
      toast("Tu correo no está autorizado para este hub 🫠");
      try { await signOut(auth); } catch (_) {}
      show("login");
      return;
    }

    const profile = HUB.USERS?.[email] || null;
    const mergedLinks = buildLinksForUser(email);

    if (userLine) {
      userLine.textContent = profile?.label || prettyName(user, email);
    }

    show("app");
    renderButtons(HUB.BUTTONS || [], mergedLinks, profile);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("BUILD", BUILD);

  registerServiceWorker();
  setupInstallPrompt();
  wireUpdateBanner();
  mount();
});
