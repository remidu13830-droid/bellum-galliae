// Bellum Galliae — Service Worker v3 (P1-B/C/D deploy)
// Strategie : Cache-first pour les assets statiques, Network-first pour les API
const CACHE = 'bellum-v3';
const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
];

// URLs qui ne doivent jamais etre cachees (API Supabase)
const NO_CACHE = ['.supabase.co', '/auth/', '/rest/', '/functions/', '/realtime/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Ne pas cacher les appels API Supabase
  if (NO_CACHE.some(p => url.includes(p))) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first pour les assets statiques (HTML, JS, CSS, images)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Revalider en arriere-plan (stale-while-revalidate)
        fetch(e.request).then(fresh => {
          caches.open(CACHE).then(c => c.put(e.request, fresh));
        }).catch(() => {});
        return cached;
      }
      // Pas en cache — fetch puis mettre en cache
      return fetch(e.request).then(r => {
        if (r.ok) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(() => new Response('Offline', { status: 503 }))
