// service-workers/sw.js
self.addEventListener('install', event => {
  console.log('Service worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
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
