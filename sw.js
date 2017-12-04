var Name = 'cache-v1';

var files = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css?family=Roboto:400,500,700',
  './css/style.css',
  './css/reset.css',
  './js/main.js',
  './favicon.ico',
  './manifest.json',
  './img/icon-48.png',
  './img/icon-96.png',
  './img/icon-144.png',
  './img/icon-196.png',
  './img/icon-256.png',
  './img/icon-512.png',
  './img/icon-1024.png'
];

self.addEventListener('install', (event) => {
  console.info('Event: Install');
  event.waitUntil(
    caches.open(Name)
    .then((cache) => {
      return cache.addAll(files)
      .then(() => {
        console.info('All files are cached');
        return self.skipWaiting();
      })
      .catch((error) =>  {
        console.error('Failed to cache', error);
      })
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch',event.request.url);
  var request = event.request;

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        var responseToCache = response.clone();
        caches.open(Name).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  var cacheWhitelist = [Name];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});