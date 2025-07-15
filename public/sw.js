const CACHE_NAME = 'glinda-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png'
];

// URLs that should never be cached
const NO_CACHE_PATTERNS = [
  /\/api\//,
  /\/content\//,
  /\/[^\/]+\/[^\/]+$/, // Dynamic category/slug routes
  /\/search/,
  /\/dashboard/,
  /\/auth/
];

// Check if URL should be cached
const shouldCache = (url) => {
  const urlPath = new URL(url).pathname;
  return !NO_CACHE_PATTERNS.some(pattern => pattern.test(urlPath));
};

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for certain URLs
  if (!shouldCache(event.request.url)) {
    console.log('Service Worker: Skipping cache for', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Fetch from network
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            // Return a fallback page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            throw error;
          });
      })
  );
});
