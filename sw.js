const CACHE_NAME = 'basyairul-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/image_355983.png',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
        return caches.match('/index.html');
    })
  );
});

Setelah Anda mengunggah pembaruan `index.html` yang baru ini **dan** menambahkan file `sw.js` ke GitHub Anda, aplikasi Vercel Anda akan langsung mengenali perintah offline secara natural tanpa menampilkan halaman dinosaurus atau pesan error sama sekali.