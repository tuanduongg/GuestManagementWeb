self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  alert('activate');
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage('SW activated'));
    })
  );
});

self.addEventListener('message', (event) => {
  if (event?.data?.channel === 'newguest') {
    const record = event.data.data;
    // Gửi thông báo lên client PWA
    self.registration.showNotification('Có bản ghi mới', {
      body: JSON.stringify(record)
    });
  }
});
self.addEventListener('push', function (event) {
  // Xử lý sự kiện khi nhận được một thông báo từ máy chủ
  // Ví dụ: hiển thị thông báo
  console.log('Push received', event);

  var options = {
    body: 'This is a push notification',
    icon: 'icon.png',
    badge: 'badge.png'
  };

  event.waitUntil(self.registration.showNotification('Notification Title', options));
});
