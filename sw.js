// NK학원 숙제 알림 Service Worker v1.0
// ※ 이 파일은 student.html과 같은 경로에 있어야 합니다

self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// ── 푸시 수신 ──────────────────────────────────────────────
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e) { data = { title: '숙제 알림', body: event.data?.text() || '' }; }

  const title   = data.title || 'NK학원 숙제 알림';
  const options = {
    body:             data.body || '',
    icon:             data.icon || undefined,
    tag:              data.tag  || 'hw-notification',
    renotify:         true,
    vibrate:          [200, 100, 200],
    requireInteraction: !!data.requireInteraction,
    data:             { url: data.url || '/student.html', ...data }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ── 알림 클릭 ──────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/student.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
