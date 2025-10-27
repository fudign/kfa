/**
 * Push Notifications Utilities
 *
 * Утилиты для работы с push уведомлениями
 */

/**
 * Типы уведомлений
 */
export enum NotificationType {
  NEWS = 'news',
  EVENT = 'event',
  DOCUMENT = 'document',
  ANNOUNCEMENT = 'announcement',
  REMINDER = 'reminder',
}

/**
 * Интерфейс действия уведомления
 */
export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

/**
 * Интерфейс данных уведомления
 */
export interface PushNotificationData {
  type: NotificationType;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  image?: string;
  timestamp?: number;
  requireInteraction?: boolean;
  actions?: PushNotificationAction[];
}

/**
 * Проверка поддержки push уведомлений
 */
export function isPushSupported(): boolean {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Получить статус разрешения
 */
export function getPermissionStatus(): NotificationPermission {
  return Notification.permission;
}

/**
 * Запросить разрешение на уведомления
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  return await Notification.requestPermission();
}

/**
 * Конвертировать VAPID ключ
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Подписаться на push уведомления
 */
export async function subscribeToPush(
  vapidPublicKey: string
): Promise<PushSubscription> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const registration = await navigator.serviceWorker.ready;
  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey.buffer as BufferSource,
  });

  return subscription;
}

/**
 * Отписаться от push уведомлений
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    return await subscription.unsubscribe();
  }

  return false;
}

/**
 * Получить текущую подписку
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

/**
 * Проверить, подписан ли пользователь
 */
export async function isSubscribed(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription !== null;
}

/**
 * Отправить подписку на сервер
 */
export async function sendSubscriptionToServer(
  subscription: PushSubscription,
  endpoint: string = '/api/push/subscribe'
): Promise<void> {
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
}

/**
 * Удалить подписку с сервера
 */
export async function removeSubscriptionFromServer(
  subscription: PushSubscription,
  endpoint: string = '/api/push/subscribe'
): Promise<void> {
  await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });
}

/**
 * Показать локальное уведомление (для тестирования)
 */
export async function showLocalNotification(
  data: PushNotificationData
): Promise<void> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const registration = await navigator.serviceWorker.ready;

  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon || '/android-chrome-192x192.png',
    badge: data.badge || '/favicon-32x32.png',
    tag: `${data.type}-${Date.now()}`,
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url,
      type: data.type,
      timestamp: data.timestamp || Date.now(),
      image: data.image,
    },
  };

  // Add actions if provided
  if (data.actions && data.actions.length > 0) {
    (options as any).actions = data.actions;
  }

  await registration.showNotification(data.title, options);
}

/**
 * Примеры шаблонов уведомлений
 */
export const NotificationTemplates = {
  /**
   * Новость
   */
  news: (title: string, preview: string, url: string): PushNotificationData => ({
    type: NotificationType.NEWS,
    title: `📰 ${title}`,
    body: preview,
    url,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Читать',
      },
      {
        action: 'close',
        title: 'Закрыть',
      },
    ],
  }),

  /**
   * Событие
   */
  event: (title: string, date: string, url: string): PushNotificationData => ({
    type: NotificationType.EVENT,
    title: `📅 ${title}`,
    body: `Событие запланировано на ${date}`,
    url,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Подробнее',
      },
      {
        action: 'dismiss',
        title: 'Отклонить',
      },
    ],
  }),

  /**
   * Документ
   */
  document: (title: string, type: string, url: string): PushNotificationData => ({
    type: NotificationType.DOCUMENT,
    title: `📄 Новый документ: ${type}`,
    body: title,
    url,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: false,
    actions: [
      {
        action: 'download',
        title: 'Скачать',
      },
      {
        action: 'view',
        title: 'Просмотр',
      },
    ],
  }),

  /**
   * Объявление
   */
  announcement: (title: string, message: string, url?: string): PushNotificationData => ({
    type: NotificationType.ANNOUNCEMENT,
    title: `📢 ${title}`,
    body: message,
    url,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: true,
    actions: url
      ? [
          {
            action: 'read',
            title: 'Читать',
          },
          {
            action: 'dismiss',
            title: 'Закрыть',
          },
        ]
      : undefined,
  }),

  /**
   * Напоминание
   */
  reminder: (title: string, time: string, url: string): PushNotificationData => ({
    type: NotificationType.REMINDER,
    title: `⏰ Напоминание: ${title}`,
    body: `Событие начнется через ${time}`,
    url,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Перейти',
      },
      {
        action: 'snooze',
        title: 'Отложить',
      },
    ],
  }),
};
