const CACHE = 'dinotask-v3';
const ASSETS = ['/', '/index.html', '/dinos/comum.png', '/dinos/raro.png', '/dinos/epico.png', '/dinos/lendario.png', '/eggs/estagio1.png', '/eggs/estagio2.png', '/eggs/estagio3.png'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
