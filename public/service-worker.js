// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage('SW activated'));
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event?.data?.json();
  console.log('push event');
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icon-192x192.png'
  });
});

self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(
    fetch('http://localhost:5055/api/notification/pushsubscriptionchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
        new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
        new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
        new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
      })
    })
  );
});

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyC3iYWOHZIiz2VGiuzS8ye6SQ7p0XQDR4c',
  authDomain: 'push-message-seowon.firebaseapp.com',
  databaseURL: 'https://push-message-seowon-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'push-message-seowon',
  storageBucket: 'push-message-seowon.appspot.com',
  messagingSenderId: '282049744676',
  appId: '1:282049744676:web:da36cd0754756f4ac5edb1',
  measurementId: 'G-SV1WK7XPN9'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[service-worker.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/android-chrome-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener('push', function (event) {
//   lastEventName = 'push';
//   var msg = {};
//   if (event.data) {
//     msg = event.data.json();
//     if (msg.isEcho) {
//       self.registration.pushManager.getSubscription().then(function (subscription) {
//         if (!subscription) {
//           console.log('first');
//         } else {
//           subscription.unsubscribe().then(function () {
//             self.registration.pushManager
//               .subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToUint8Array('xxxxxxxxxxxxxxxx') })
//               .then(function (subscription) {
//                 resubscription(subscription);
//               });
//           });
//         }
//       });
//       return;
//     }
//   }
//   if (msg.isEcho) return;
//   let notificationTitle = msg.title;
//   const notificationOptions = {
//     body: msg.body,
//     dir: 'rtl',
//     icon: msg.icon,
//     data: {
//       url: msg.url,
//       id: msg.id,
//       key: msg.key
//     }
//   };
//   event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));

//   const fetchOptions = { method: 'post', mode: 'no-cors' };
//   fetch('http://example.com', fetchOptions)
//     .then(function (response) {
//       if (response.status >= 400 && response.status < 500) {
//         throw new Error('Failed to send push message via web push protocol');
//       }
//       lastEventName = 'view';
//     })
//     .catch((err) => {
//       this.showErrorMessage('Ooops Unable to Send a Click', err);
//     });
// });
