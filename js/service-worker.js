// service-worker.js (versión de prueba súper simple)
self.addEventListener('install', event => {
  console.log('Service Worker: Evento de instalación disparado');
  // No uses self.skipWaiting() aquí para esta prueba inicial
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Evento de activación disparado');
});

// Comenta o elimina los listeners de 'push' y 'notificationclick' temporalmente
/*
self.addEventListener('push', event => {
  // ... tu código de push ...
});

self.addEventListener('notificationclick', event => {
  // ... tu código de notificationclick ...
});
*/
