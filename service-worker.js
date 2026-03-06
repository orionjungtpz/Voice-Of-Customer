const CACHE_NAME = 'room-inspection-v1';
const OFFLINE_URL = './room_inspectiontest.html';

const CACHE_ASSETS = [
  './room_inspectiontest.html'
];

// 설치 시 핵심 파일 캐시
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 활성화 시 구버전 캐시 삭제
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

// 네트워크 우선, 실패 시 캐시 폴백
self.addEventListener('fetch', function(e) {
  // 외부 API 요청(뉴스/날씨)은 캐시 거치지 않고 네트워크 직접 사용
  var url = e.request.url;
  if(url.includes('api.rss2json.com') ||
     url.includes('api.open-meteo.com') ||
     url.includes('nominatim.openstreetmap.org')) {
    e.respondWith(fetch(e.request).catch(function() {
      return new Response('{}', { headers: { 'Content-Type': 'application/json' }});
    }));
    return;
  }

  // HTML 등 앱 파일: 네트워크 우선, 오프라인 시 캐시
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // 성공 시 캐시도 갱신
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
