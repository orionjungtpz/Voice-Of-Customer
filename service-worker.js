const CACHE_NAME = 'room-inspection-v3';
const OFFLINE_URL = './room_inspection.html';
const CACHE_ASSETS = [
  './room_inspection.html',
  './js/config.js',
  './js/main.js',
  './js/table.js',
  './js/stock.js',
  './js/weather.js',
  './js/admin.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if(url.includes('api.rss2json.com') ||
     url.includes('api.open-meteo.com') ||
     url.includes('nominatim.openstreetmap.org')) {
    e.respondWith(fetch(e.request).catch(function() {
      return new Response('{}', { headers: { 'Content-Type': 'application/json' }});
    }));
    re
