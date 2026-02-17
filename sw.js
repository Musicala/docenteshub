/* sw.js — Musicala Hub (PWA) — PRO
   Estrategia:
   - Precachéa core assets (resistente si falta alguno)
   - Navegación: Network-first con fallback offline a index.html
   - Same-origin assets: Stale-While-Revalidate
   - Limpieza de cachés viejos + mensajes para UI (update ready / activated)
*/

const BUILD = "2026-02-17.2";
const VERSION = `v4-${BUILD}`;

const CACHE_STATIC  = `musicala-static-${VERSION}`;
const CACHE_RUNTIME = `musicala-runtime-${VERSION}`;

/**
 * Core assets: ajusta si cambias estructura.
 * Nota: cache.add usa Request normal, respeta redirects.
 */
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/* =========================
   Utils
========================= */
const isHttp = (url) => url.protocol === "http:" || url.protocol === "https:";

const isRangeRequest = (req) => req.headers && req.headers.has("range");

async function postToAllClients(payload) {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clients) client.postMessage(payload);
}

async function safeCachePut(cache, request, response) {
  try {
    // Evita cachear respuestas inválidas u opacas raras
    if (!response || response.status === 206) return; // Range
    if (response.type === "opaque") return; // cross-origin opaque
    if (response.status >= 400) return;
    await cache.put(request, response);
  } catch (_) {}
}

/* =========================
   Messages
========================= */
self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (data.type === "GET_VERSION") {
    event.source?.postMessage({ type: "SW_VERSION", version: VERSION, build: BUILD });
  }
});

/* =========================
   Install
========================= */
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIC);

    // No usamos addAll: si falta 1 archivo, no se cae la instalación.
    await Promise.allSettled(
      CORE_ASSETS.map(async (url) => {
        try { await cache.add(url); } catch (_) {}
      })
    );

    // Queremos que instale rápido; la activación queda al usuario (update prompt)
    self.skipWaiting();
  })());
});

/* =========================
   Activate
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    // Borra caches viejos de esta misma app (musicala-*)
    await Promise.all(
      keys.map((k) => {
        const keep = (k === CACHE_STATIC || k === CACHE_RUNTIME);
        const isOurs = k.startsWith("musicala-static-") || k.startsWith("musicala-runtime-") ||
                       k.startsWith("practicantes-static-") || k.startsWith("practicantes-runtime-");
        return (!keep && isOurs) ? caches.delete(k) : null;
      })
    );

    await self.clients.claim();

    // Avisar que ya hay una versión activa
    await postToAllClients({ type: "SW_ACTIVATED", version: VERSION, build: BUILD });
  })());
});

/* =========================
   Fetch
========================= */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Solo GET
  if (req.method !== "GET") return;

  // Evita cosas raras (range requests rompen cache put en algunos casos)
  if (isRangeRequest(req)) return;

  const url = new URL(req.url);
  if (!isHttp(url)) return;

  const sameOrigin = url.origin === self.location.origin;

  // ===== Navegación (HTML) =====
  // Network-first: trae lo último cuando hay internet; si no, index.html cacheado.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);

        // Cachea una copia de index.html para offline
        const cache = await caches.open(CACHE_RUNTIME);
        await safeCachePut(cache, "./index.html", fresh.clone());

        return fresh;
      } catch (_) {
        const cached = await caches.match("./index.html") || await caches.match("./");
        return cached || new Response("Sin conexión", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

  // ===== Same-origin assets (CSS/JS/IMG/etc) =====
  // Stale-While-Revalidate: responde rápido desde caché y actualiza en segundo plano.
  if (sameOrigin) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });

      const fetchPromise = (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_RUNTIME);
          await safeCachePut(cache, req, fresh.clone());
          return fresh;
        } catch (_) {
          return null;
        }
      })();

      return cached || (await fetchPromise) || new Response("", { status: 504 });
    })());
    return;
  }

  // ===== Cross-origin =====
  // No cacheamos externo (Firebase CDN, Google, etc). Passthrough.
  // (Si algún día quieres cachear gstatic, se hace pero con cuidado.)
});

/* =========================
   Update signaling (optional but nice)
========================= */
self.addEventListener("controllerchange", () => {
  // Esto normalmente vive del lado cliente, pero lo dejo aquí por si el browser lo usa.
});

/**
 * Nota para tu app.js:
 * Si quieres banner de update "listo para aplicar", escucha estos mensajes:
 * - SW_ACTIVATED
 * - SW_VERSION
 * Y cuando el registro tenga reg.waiting, muestra botón que mande SKIP_WAITING.
 */
