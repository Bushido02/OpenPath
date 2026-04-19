const CACHE_NAME = 'openpath-cache-v2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// При установке сохраняем статику (Интерфейс)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Перехват запросов (Роутер Офлайн-режима)
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // 1. Если запрашиваем API (точки с сервера) -> Стратегия "Сначала Сеть, потом Кэш"
    if (requestUrl.pathname.startsWith('/api/places')) {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    // Сохраняем свежие данные в кэш
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return networkResponse;
                })
                .catch(() => {
                    // Нет интернета? Достаем из кэша!
                    return caches.match(event.request);
                })
        );
        return;
    }

    // 2. Если запрашиваем картинки карты (тайлы Leaflet) -> Кэшируем на лету
    if (requestUrl.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then(networkResponse => {
                    const clone = networkResponse.clone();
                    caches.open('openpath-map-tiles').then(cache => cache.put(event.request, clone));
                    return networkResponse;
                });
            })
        );
        return;
    }

    // 3. Для всего остального (HTML, CSS) -> Стратегия "Сначала Кэш, потом Сеть"
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});