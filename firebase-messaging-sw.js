// web/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Sua configuração do Firebase (copie do seu Firebase Console)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  
  const notificationTitle = payload.notification?.title || 'Nova entrega';
  const notificationOptions = {
    body: payload.notification?.body || 'Uma nova entrega está disponível',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
    tag: 'delivery-notification',
    renotify: true,
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Ver entrega'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click: ', event.notification);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/');
      })
  );
});