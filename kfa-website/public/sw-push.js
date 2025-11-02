/**
 * Service Worker - Push Notifications Handler
 *
 * Обработка push уведомлений в Service Worker
 * Этот файл должен быть импортирован в основной SW
 */

// Обработка входящих push сообщений
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  let data = {
    title: 'КФА - Уведомление',
    body: 'Новое уведомление от КФА',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    url: '/',
  };

  // Парсим данные из push сообщения
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      data.body = event.data.text();
    }
  }

  // Опции уведомления
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    vibrate: data.vibrate || [200, 100, 200],
    tag: data.tag || `notification-${Date.now()}`,
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url,
      timestamp: Date.now(),
      ...data.data,
    },
    actions: data.actions || [
      {
        action: 'open',
        title: 'Открыть',
      },
      {
        action: 'close',
        title: 'Закрыть',
      },
    ],
  };

  // Показываем уведомление
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);

  event.notification.close();

  // Обработка действий
  if (event.action === 'close') {
    return;
  }

  // Получаем URL из данных уведомления
  const urlToOpen = event.notification.data?.url || '/';

  // Открываем URL
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Проверяем, есть ли уже открытое окно с этим URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Если нет, открываем новое окно
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Обработка закрытия уведомления
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);

  // Отправляем аналитику (если нужно)
  event.waitUntil(
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: event.notification.tag,
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.error('[SW] Analytics error:', error);
    })
  );
});

// Обработка изменения подписки
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');

  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        // Отправляем новую подписку на сервер
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });
      })
      .catch((error) => {
        console.error('[SW] Push resubscription failed:', error);
      })
  );
});
