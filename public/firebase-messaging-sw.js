// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyC3iYWOHZIiz2VGiuzS8ye6SQ7p0XQDR4c',
  authDomain: 'push-message-seowon.firebaseapp.com',
  databaseURL: 'https://push-message-seowon-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'push-message-seowon',
  storageBucket: 'push-message-seowon.appspot.com',
  messagingSenderId: '282049744676',
  appId: '1:282049744676:web:da36cd0754756f4ac5edb1',
  measurementId: 'G-SV1WK7XPN9'
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    type: 'basic',
    iconUrl: '/favicon-16x16.png',
    body: payload.notification.body,
    actions: [
      { action: 'btnOK', title: 'Button OK' },
      { action: 'btnCancel', title: 'Button Cancel' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event?.notification;
  const action = event?.action;

  if (action === 'btnOK') {
    // Xử lý hành động khi nút 1 được nhấp vào
    console.log('btnOK');
  } else if (action === 'btnCancel') {
    // Xử lý hành động khi nút 2 được nhấp vào
    console.log('Button btnCancel');
  } else {
    // Xử lý hành động mặc định khi thông báo được nhấp vào
    console.log('Notification clicked');
  }

  // Đóng thông báo
  clickedNotification.close();
});
