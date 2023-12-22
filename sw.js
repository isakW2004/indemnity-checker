var CACHE_NAME = 'drivingLog';
var urlsToCache = [
  'index.html',
  "index.css",
  "index.js",
  "icons.woff2",
  "icon.svg",
  "brands.json",
  "logos/elan.svg",
  "logos/fischer.svg",
  "logos/head.svg",
  "logos/look.svg",
  "logos/marker.svg",
  "logos/salomon-atomic.svg"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response){
      if(!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      var responseToCache = response.clone();
      caches.open(CACHE_NAME)
        .then(function(cache) {
          cache.put(event.request, responseToCache);
        });
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

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