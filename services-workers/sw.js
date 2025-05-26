// Path: /jiffy/service-workers/sw.js
// Purpose: Service worker to cache assets for offline access, improve loading, and handle push notifications for app-like behavior.

const CACHE_NAME = 'jiffy-cache-v1';
const urlsToCache = [
  '/jiffy/pages/home/index.html',
  '/jiffy/pages/prompts/index.html',
  '/jiffy/pages/prompts/styles.css',
  '/jiffy/pages/prompts/scripts.js',
  '/jiffy/pages/prompts/promptManagement.js',
  '/jiffy/shared/scripts/main.js',
  '/jiffy/assets/icon.png',
  '/jiffy/assets/widget-icon.png',
  '/jiffy/manifest.json'
];

self.addEventListener('install', event => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Service Worker: Cache failed:', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          console.log('Fetch failed, serving fallback');
        });
      })
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/jiffy/assets/widget-icon.png',
    actions: [
      { action: 'done', title: 'Done' },
      { action: 'add', title: 'Add New' }
    ]
  });
});