const CACHE_NAME = 'basyairul-offline-v7';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './image_355983.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap'
];

// Install Service Worker dan simpan Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Hapus Cache lama jika ada versi baru
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Ambil dari Cache jika offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Kembalikan file dari cache jika ada, jika tidak ambil dari internet
            return response || fetch(event.request).then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Simpan gambar atau aset eksternal yang baru diakses ke cache
                    if (event.request.url.startsWith('http')) {
                        cache.put(event.request, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        }).catch(() => {
            // Fallback jika benar-benar offline dan file tidak ada di cache
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
