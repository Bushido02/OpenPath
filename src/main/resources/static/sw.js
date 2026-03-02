const CACHE_NAME = 'openpath-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Установка воркера и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Выдача файлов из кэша, если нет интернета
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});