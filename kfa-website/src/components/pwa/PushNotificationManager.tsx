import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';

interface PushNotificationManagerProps {
  /**
   * VAPID публичный ключ (будет предоставлен сервером)
   * Для генерации: web-push generate-vapid-keys
   */
  vapidPublicKey?: string;

  /**
   * URL эндпоинта для регистрации подписки на сервере
   */
  subscriptionEndpoint?: string;

  /**
   * Показывать ли промпт автоматически
   */
  autoPrompt?: boolean;

  /**
   * Задержка перед показом промпта (мс)
   */
  promptDelay?: number;
}

/**
 * Push Notification Manager Component
 *
 * Управляет подписками на push уведомления
 * Требует backend для отправки уведомлений
 */
export function PushNotificationManager({
  vapidPublicKey,
  subscriptionEndpoint = '/api/push/subscribe',
  autoPrompt = true,
  promptDelay = 5000,
}: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем поддержку уведомлений
    if (!('Notification' in window)) {
      console.warn('Push notifications are not supported');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker is not supported');
      return;
    }

    // Проверяем текущее состояние
    setPermission(Notification.permission);
    checkSubscription();

    // Показываем промпт через delay
    if (autoPrompt && Notification.permission === 'default') {
      const isDismissed = localStorage.getItem('push-prompt-dismissed') === 'true';
      if (!isDismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, promptDelay);
      }
    }
  }, [autoPrompt, promptDelay]);

  /**
   * Проверяем существующую подписку
   */
  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  /**
   * Конвертируем VAPID ключ для использования
   */
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  /**
   * Подписаться на уведомления
   */
  const subscribe = async () => {
    setIsLoading(true);

    try {
      // Запрашиваем разрешение
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        console.log('Notification permission denied');
        setIsLoading(false);
        setShowPrompt(false);
        return;
      }

      // Получаем Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Создаем подписку
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
          ? urlBase64ToUint8Array(vapidPublicKey)
          : undefined,
      });

      // Отправляем подписку на сервер
      if (subscriptionEndpoint) {
        await fetch(subscriptionEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });
      }

      setIsSubscribed(true);
      setShowPrompt(false);
      localStorage.setItem('push-subscribed', 'true');

      console.log('Push subscription successful');
    } catch (error) {
      console.error('Error subscribing to push:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Отписаться от уведомлений
   */
  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Удаляем подписку с сервера
        if (subscriptionEndpoint) {
          await fetch(subscriptionEndpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
        }

        setIsSubscribed(false);
        localStorage.removeItem('push-subscribed');
        console.log('Push unsubscription successful');
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Закрыть промпт
   */
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push-prompt-dismissed', 'true');
  };

  /**
   * Тестовое уведомление (работает только если есть подписка)
   */
  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      const options: NotificationOptions = {
        body: 'Это тестовое уведомление от КФА',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        tag: 'test-notification',
        requireInteraction: false,
      };

      new Notification('КФА - Тестовое уведомление', options);
    }
  };

  // Промпт для подписки на уведомления
  if (showPrompt && !isSubscribed && permission === 'default') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-[90] animate-slide-up md:bottom-6 md:right-6 md:left-auto md:max-w-md"
        role="dialog"
        aria-labelledby="push-prompt-title"
        aria-describedby="push-prompt-description"
      >
        <div className="relative overflow-hidden rounded-t-kfa border border-neutral-200 bg-white shadow-kfa-xl dark:border-neutral-700 dark:bg-neutral-800 md:rounded-kfa">
          {/* Градиентная полоса */}
          <div className="h-1 bg-gradient-to-r from-accent-600 to-primary-600"></div>

          <div className="p-5 md:p-6">
            {/* Кнопка закрытия */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Иконка */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 to-accent-700 text-white shadow-lg md:h-14 md:w-14">
                <Bell className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div className="flex-1">
                <h3
                  id="push-prompt-title"
                  className="font-display text-lg font-bold text-primary-900 dark:text-primary-100 md:text-xl"
                >
                  Включить уведомления?
                </h3>
              </div>
            </div>

            {/* Описание */}
            <p
              id="push-prompt-description"
              className="mb-5 text-sm text-neutral-600 dark:text-neutral-400 md:text-base"
            >
              Получайте уведомления о важных новостях, событиях и обновлениях КФА
            </p>

            {/* Преимущества */}
            <ul className="mb-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-accent-600 dark:text-accent-400">✓</span>
                <span>Важные новости и события</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-600 dark:text-accent-400">✓</span>
                <span>Напоминания о мероприятиях</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-600 dark:text-accent-400">✓</span>
                <span>Обновления документов</span>
              </li>
            </ul>

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                onClick={subscribe}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-accent-600 to-accent-700 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-accent-700 hover:to-accent-800 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Подключение...' : 'Включить'}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Контроллер уведомлений (показывается только если уведомления включены)
  if (!isSubscribed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* Индикатор подписки */}
      <div className="flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-2 text-sm font-medium text-accent-700 shadow-sm dark:border-accent-800 dark:bg-accent-900/20 dark:text-accent-300">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Уведомления включены</span>
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-2">
        {/* Тестовое уведомление (только в development) */}
        {import.meta.env.DEV && (
          <button
            onClick={sendTestNotification}
            className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-600 shadow-sm transition-all hover:border-accent-500 hover:bg-accent-50 hover:text-accent-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-accent-500 dark:hover:bg-accent-900/20 dark:hover:text-accent-400"
            aria-label="Тестовое уведомление"
            title="Отправить тестовое уведомление"
          >
            <Bell className="h-4 w-4" />
          </button>
        )}

        {/* Отписаться */}
        <button
          onClick={unsubscribe}
          disabled={isLoading}
          className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-600 shadow-sm transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Отключить уведомления"
          title="Отключить уведомления"
        >
          <BellOff className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
