
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('talbiya-v1').then(c=>c.addAll(['./','./index.html','./app.js','./assets/talbiya.png','./assets/hasseef.png','./assets/Vision2030.png'])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
