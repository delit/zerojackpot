/* ZeroJackpot — offline cache; bump CACHE_VERSION when static assets change */
const CACHE_VERSION = 'zerojackpot-v11';
const PRECACHE_URLS = [
    './',
    './index.html',
    './about.html',
    './jackpot.html',
    './manifest.webmanifest',
    './css/styles.css',
    './css/mobile.css',
    './js/logic.js',
    './js/i18n.js',
    './js/app.js',
    './js/jakten.js',
    './js/pwa-register.js',
    './i18n/sv.json',
    './i18n/en.json',
    './i18n/de.json',
    './i18n/es.json',
    './grafik/01logo-zero-jackpot@2x.png',
    './grafik/favicon/01favicon.svg',
    './grafik/favicon/01favicon.png',
    './grafik/favicon/01favicon@3x.png',
    './grafik/favicon/icon-192.png',
    './grafik/favicon/icon-512.png',
    './grafik/splash/splash-pwa-192.png',
    './grafik/splash/splash-pwa-512.png',
    './grafik/splash/apple-splash-1170x2532.png',
    './grafik/splash/apple-splash-1284x2778.png',
    './grafik/flags/sv.svg',
    './grafik/flags/gb.svg',
    './grafik/flags/de.svg',
    './grafik/flags/es.svg'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return Promise.all(
                PRECACHE_URLS.map(function (url) {
                    return cache.add(url).catch(function () {
                        return null;
                    });
                })
            );
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(function (keys) {
                return Promise.all(
                    keys.map(function (key) {
                        if (key !== CACHE_VERSION) return caches.delete(key);
                    })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

/* Network-first: pick up updates when online; cache fallback when offline */
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    var url;
    try {
        url = new URL(event.request.url);
    } catch (e) {
        return;
    }
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then(function (res) {
                if (res && res.status === 200 && res.type === 'basic') {
                    var copy = res.clone();
                    caches.open(CACHE_VERSION).then(function (cache) {
                        cache.put(event.request, copy);
                    });
                }
                return res;
            })
            .catch(function () {
                return caches.match(event.request).then(function (cached) {
                    return cached || caches.match('./index.html');
                });
            })
    );
});
