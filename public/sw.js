// Service worker — stratégies de cache volontairement simples (pas de
// build-time precache manifest / Workbox) : robuste à toute stratégie
// d'hébergement (racine ou sous-dossier) sans étape de build supplémentaire.
// Contrepartie assumée : la toute première visite doit être en ligne pour
// peupler le cache ; les visites suivantes fonctionnent hors-ligne.

const VERSION = "v1";
const SHELL_CACHE = `hifz-shell-${VERSION}`;
const DATA_CACHE = `hifz-data-${VERSION}`;
const AUDIO_CACHE = `hifz-audio-${VERSION}`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(["./", "./manifest.webmanifest", "./favicon.svg"]).catch(() => {
        // installation ne doit jamais échouer si une ressource optionnelle manque
      }),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![SHELL_CACHE, DATA_CACHE, AUDIO_CACHE].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isAudio(url) {
  return url.hostname === "everyayah.com" && url.pathname.endsWith(".mp3");
}

function isWarshData(url) {
  return url.pathname.includes("/data/warsh/") && url.pathname.endsWith(".json");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Audio Warsh : cache-first, mise en cache à la première écoute
  if (isAudio(url)) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return cached || Response.error();
        }
      }),
    );
    return;
  }

  // Données Warsh (JSON) : cache-first, contenu figé
  if (isWarshData(url)) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Navigation (HTML) : réseau d'abord, repli sur le shell en cache si hors-ligne
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(SHELL_CACHE).then((cache) => cache.put("./", res.clone()));
          return res;
        })
        .catch(() => caches.match("./").then((r) => r || caches.match(req))),
    );
    return;
  }

  // Reste (JS/CSS/polices/icônes) : cache d'abord, mise à jour en tâche de fond
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
