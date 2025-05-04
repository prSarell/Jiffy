self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('jiffy-cache').then(cache => {
      return cache.addAll([
        '/jiffy/',
        '/jiffy/pages/home/index.html',
        '/jiffy/shared/styles.css',
        '/jiffy/shared/data.js',
        '/jiffy/assets/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
