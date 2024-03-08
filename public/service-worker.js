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
  console.log('vao push');
  console.log('event', event);
  const data = event?.data?.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icon-192x192.png'
  });
});

// self.addEventListener('pushsubscriptionchange', function (event) {
//   event.waitUntil(
//     fetch('https://pushpad.xyz/pushsubscriptionchange', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
//         new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
//         new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
//         new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
//       })
//     })
//   );
// });

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
