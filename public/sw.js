const CACHE='the-drop-v1';
const SHELL=['/','/manifest.json','/icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('/api/')){e.respondWith(fetch(e.request));return;}
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
