// service-worker.js

self.addEventListener('install', event => {
    console.log('Service Worker: Instalado');
    // self.skipWaiting(); // Opcional: activa el nuevo SW inmediatamente
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker: Activado');
    // event.waitUntil(clients.claim()); // Opcional: toma control de las páginas abiertas inmediatamente
  });
  
  self.addEventListener('push', event => {
    console.log('Service Worker: Notificación Push recibida', event.data.text());
    
    // Intenta parsear los datos como JSON si es posible, de lo contrario usa el texto.
    let notificationData = { title: 'Nueva Notificación', body: event.data.text() };
    try {
      const payload = event.data.json(); // Asume que el servidor envía JSON con title, body, icon, etc.
      notificationData.title = payload.title || 'Nueva Notificación';
      notificationData.body = payload.body || event.data.text();
      notificationData.icon = payload.icon; // Si el servidor envía un ícono específico
      notificationData.data = payload.data; // Datos adicionales
      // Puedes añadir más opciones aquí: tag, requireInteraction, vibrate, etc.
    } catch (e) {
      console.log('Service Worker: Payload de push no es JSON, usando texto directo.');
    }
  
    const options = {
      body: notificationData.body,
      icon: notificationData.icon || '/../assets/logo.png', // Icono por defecto
      tag: notificationData.tag || 'default-tag',
      requireInteraction: notificationData.requireInteraction || true,
      data: notificationData.data || {}, // Datos para usar en 'notificationclick'
      // ... puedes añadir más opciones por defecto aquí
    };
  
    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notificación clickeada', event.notification);
    event.notification.close(); // Cierra la notificación
  
    // Ejemplo: Abrir una URL específica o enfocar una ventana existente
    const urlToOpen = event.notification.data && event.notification.data.urlDestino;
  
    if (urlToOpen) {
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
          // Comprueba si ya hay una ventana abierta con esa URL
          let matchingClient = null;
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen) {
              matchingClient = client;
              break;
            }
          }
          // Si la hay, la enfoca; si no, abre una nueva.
          if (matchingClient) {
            return matchingClient.focus();
          } else {
            return clients.openWindow(urlToOpen);
          }
        })
      );
    } else {
      // Si no hay URL, podrías simplemente enfocar la última ventana activa de tu app
      event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
          if (clientList.length > 0) {
            return clientList[0].focus();
          }
        })
      );
    }
  });