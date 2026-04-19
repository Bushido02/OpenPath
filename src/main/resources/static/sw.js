const CACHE_NAME = 'openpath-cache-v1';
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

// Перехват запросов (чтобы работало оффлайн)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});