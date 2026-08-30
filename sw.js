// Three Sevens — offline cache.
//
// The whole point of this file: after the first visit the app is stored on the
// phone and runs with no network at all. Bump CACHE whenever index.html changes,
// or phones will keep serving the version they already have.
const CACHE = "three-sevens-v1";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if any single file 404s, so cache them
      // one by one and let the app install even if an icon is missing.
      .then((cache) => Promise.all(
        SHELL.map((url) => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isFont = url.hostname === "fonts.googleapis.com" ||
                 url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !isFont) return;

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) {
        // Refresh in the background so the next launch gets any update,
        // without ever making this launch wait on the network.
        if (!isFont) {
          fetch(request)
            .then((fresh) => {
              if (fresh && fresh.ok) {
                caches.open(CACHE).then((cache) => cache.put(request, fresh));
              }
            })
            .catch(() => {});
        }
        return hit;
      }

      return fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === "opaque")) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // Offline and never cached: for a page request, fall back to the app
          // shell so the user gets Three Sevens rather than a browser error.
          if (request.mode === "navigate") return caches.match("./index.html");
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});
