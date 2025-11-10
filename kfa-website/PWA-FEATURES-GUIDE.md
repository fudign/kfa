# 🚀 KFA PWA Features Guide

Полное руководство по Progressive Web App функциям сайта КФА.

## 📋 Содержание

1. [Web Share API](#web-share-api)
2. [Push Notifications](#push-notifications)
3. [API Caching System](#api-caching-system)
4. [Offline Support](#offline-support)
5. [Install Prompt](#install-prompt)
6. [Update Notifications](#update-notifications)
7. [Lighthouse CI](#lighthouse-ci)
8. [Best Practices](#best-practices)

---

## 🔗 Web Share API

### Компонент: `ShareButton`

Универсальная кнопка для sharing контента через нативный Web Share API с fallback на социальные сети.

#### Использование:

```tsx
import { ShareButton } from '@/components/common/ShareButton';

// Вариант 1: Кнопка
<ShareButton
  title="Новость КФА"
  text="Интересная новость от Кыргызского Финансового Альянса"
  url="https://kfa.kg/news/123"
  variant="button"
/>

// Вариант 2: Иконка
<ShareButton
  title="Событие КФА"
  text="Предстоящее событие"
  variant="icon"
/>

// Вариант 3: Floating Action Button
<ShareButton
  title="Страница КФА"
  text="Поделиться страницей"
  variant="fab"
/>
```

#### Поддерживаемые платформы:

- ✅ **Mobile**: Нативный share dialog (iOS, Android)
- ✅ **Desktop Fallback**:
  - Копирование ссылки
  - Facebook
  - Twitter
  - LinkedIn
  - Email

#### API:

| Prop        | Type                          | Default                | Description               |
| ----------- | ----------------------------- | ---------------------- | ------------------------- |
| `title`     | string                        | required               | Заголовок для sharing     |
| `text`      | string                        | required               | Описание контента         |
| `url`       | string                        | `window.location.href` | URL для sharing           |
| `variant`   | `'icon' \| 'button' \| 'fab'` | `'button'`             | Вариант отображения       |
| `className` | string                        | `''`                   | Дополнительные CSS классы |

---

## 🔔 Push Notifications

### Компонент: `PushNotificationManager`

Система управления push уведомлениями с поддержкой Web Push API.

#### Функции:

- ✅ Запрос разрешения на уведомления
- ✅ Подписка/отписка от уведомлений
- ✅ Интеграция с Service Worker
- ✅ Поддержка VAPID ключей
- ✅ Локальные тестовые уведомления
- ✅ Типизированные шаблоны уведомлений

#### Использование:

```tsx
import { PushNotificationManager } from '@/components/pwa/PushNotificationManager';

// В корневом компоненте приложения
<PushNotificationManager
  vapidPublicKey="YOUR_VAPID_PUBLIC_KEY"
  subscriptionEndpoint="/api/push/subscribe"
  autoPrompt={true}
  promptDelay={5000}
/>;
```

#### API компонента:

| Prop                   | Type    | Default               | Description                       |
| ---------------------- | ------- | --------------------- | --------------------------------- |
| `vapidPublicKey`       | string  | undefined             | VAPID публичный ключ для подписки |
| `subscriptionEndpoint` | string  | `/api/push/subscribe` | URL для регистрации подписки      |
| `autoPrompt`           | boolean | `true`                | Автоматически показывать промпт   |
| `promptDelay`          | number  | `5000`                | Задержка перед промптом (мс)      |

#### Утилиты для работы с уведомлениями:

```typescript
import {
  isPushSupported,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribed,
  showLocalNotification,
  NotificationTemplates,
  NotificationType,
} from '@/lib/push/pushNotifications';

// 1. Проверка поддержки
if (isPushSupported()) {
  console.log('Push notifications supported');
}

// 2. Запрос разрешения
const permission = await requestNotificationPermission();

// 3. Подписка на уведомления
const subscription = await subscribeToPush('YOUR_VAPID_PUBLIC_KEY');

// 4. Проверка подписки
const subscribed = await isSubscribed();

// 5. Отписка
await unsubscribeFromPush();

// 6. Локальное уведомление (для тестирования)
await showLocalNotification({
  type: NotificationType.NEWS,
  title: 'Новость КФА',
  body: 'Важная новость от Кыргызского Финансового Альянса',
  url: '/news/123',
  requireInteraction: false,
});
```

#### Шаблоны уведомлений:

```typescript
// Новость
const newsNotification = NotificationTemplates.news('Заголовок новости', 'Краткий превью новости...', '/news/123');

// Событие
const eventNotification = NotificationTemplates.event('Название события', '25 октября 2025', '/events/456');

// Документ
const docNotification = NotificationTemplates.document('Новый регламент', 'Нормативный документ', '/documents/789');

// Объявление
const announcement = NotificationTemplates.announcement('Важное объявление', 'Текст объявления', '/announcements/321');

// Напоминание
const reminder = NotificationTemplates.reminder('Название события', '1 час', '/events/654');
```

#### Service Worker интеграция:

Push уведомления обрабатываются в Service Worker:

```javascript
// public/sw-push.js автоматически обрабатывает:

// 1. Входящие push сообщения
self.addEventListener('push', handler);

// 2. Клики по уведомлениям
self.addEventListener('notificationclick', handler);

// 3. Закрытие уведомлений
self.addEventListener('notificationclose', handler);

// 4. Изменение подписки
self.addEventListener('pushsubscriptionchange', handler);
```

#### Backend Setup (Node.js + Express):

```javascript
// Установка
npm install web-push

// Генерация VAPID ключей
npx web-push generate-vapid-keys

// Сервер
const webPush = require('web-push');

webPush.setVapidDetails(
  'mailto:contact@kfa.kg',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Endpoint для подписки
app.post('/api/push/subscribe', (req, res) => {
  const subscription = req.body;

  // Сохранить подписку в БД
  saveSubscription(subscription);

  res.status(201).json({ success: true });
});

// Endpoint для отписки
app.delete('/api/push/subscribe', (req, res) => {
  const { endpoint } = req.body;

  // Удалить подписку из БД
  removeSubscription(endpoint);

  res.json({ success: true });
});

// Отправка уведомления
async function sendNotification(subscription, payload) {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error('Push send failed:', error);

    // Если подписка истекла, удалить из БД
    if (error.statusCode === 410) {
      removeSubscription(subscription.endpoint);
    }
  }
}

// Пример отправки
const payload = {
  title: 'Новость КФА',
  body: 'Важная новость от КФА',
  icon: '/android-chrome-192x192.png',
  url: '/news/123',
  actions: [
    { action: 'open', title: 'Читать' },
    { action: 'close', title: 'Закрыть' },
  ],
};

sendNotification(subscription, payload);
```

#### Типы уведомлений:

```typescript
enum NotificationType {
  NEWS = 'news', // 📰 Новости
  EVENT = 'event', // 📅 События
  DOCUMENT = 'document', // 📄 Документы
  ANNOUNCEMENT = 'announcement', // 📢 Объявления
  REMINDER = 'reminder', // ⏰ Напоминания
}
```

#### Рекомендации:

**Частота уведомлений**:

- Критичные: немедленно
- Важные: не более 3-5 в день
- Информационные: дайджест раз в день
- Маркетинговые: не более 2 в неделю

**Best Practices**:

- Всегда спрашивать разрешение в контексте
- Предоставлять ценность в каждом уведомлении
- Уважать выбор пользователя отписаться
- Группировать похожие уведомления
- Использовать понятные action buttons

**Безопасность**:

- Храните VAPID приватный ключ в безопасности
- Валидируйте подписки на сервере
- Проверяйте origin запросов
- Удаляйте истекшие подписки (410 Gone)

---

## 💾 API Caching System

### Модуль: `apiCache`

Продвинутая система кэширования API запросов с поддержкой offline и IndexedDB.

#### Использование:

```typescript
import { cachedFetch, apiCache, startCacheCleanup } from '@/lib/cache/apiCache';

// 1. Инициализация (в main.tsx)
startCacheCleanup();

// 2. Fetching с кэшированием
const news = await cachedFetch<NewsItem[]>('https://api.kfa.kg/news', {
  key: 'news-list',
  maxAge: 5 * 60 * 1000, // 5 минут
  staleWhileRevalidate: true, // Использовать кэш пока обновляется
});

// 3. Прямая работа с кэшем
await apiCache.set('my-key', data, 10 * 60 * 1000); // 10 минут
const cached = await apiCache.get('my-key');
await apiCache.delete('my-key');
await apiCache.clear();

// 4. Очистка устаревшего кэша
await apiCache.cleanExpired();

// 5. Получить размер кэша
const size = await apiCache.getSize();
```

#### Стратегии кэширования:

**1. Cache-First (по умолчанию)**

```typescript
const data = await cachedFetch(url, {
  key: 'cache-key',
  maxAge: 60000, // 1 минута
});
// Сначала кэш, затем сеть если кэш устарел
```

**2. Stale-While-Revalidate**

```typescript
const data = await cachedFetch(url, {
  key: 'cache-key',
  maxAge: 60000,
  staleWhileRevalidate: true,
});
// Возвращает кэш сразу, обновляет в фоне
```

**3. Network-First (offline fallback)**

```typescript
try {
  const data = await fetch(url).then((r) => r.json());
  await apiCache.set('key', data, maxAge);
} catch {
  // Offline - используем кэш
  const data = await apiCache.get('key');
}
```

#### Рекомендуемые TTL (Time To Live):

```typescript
const CACHE_TTL = {
  STATIC: 24 * 60 * 60 * 1000, // 24 часа (документы, статичный контент)
  SEMI_STATIC: 60 * 60 * 1000, // 1 час (список членов, стандарты)
  DYNAMIC: 5 * 60 * 1000, // 5 минут (новости, события)
  REAL_TIME: 30 * 1000, // 30 секунд (dashboard данные)
};
```

---

## 📴 Offline Support

### 1. Offline Banner

Компонент `OfflineBanner` автоматически отображается при потере соединения.

#### Функции:

- ✅ Автоматическое определение offline/online
- ✅ Уведомление о восстановлении связи
- ✅ Красный баннер при offline, зеленый при reconnect
- ✅ Auto-hide через 3 секунды после reconnect

### 2. Offline Page

Standalone страница `/offline.html` показывается Service Worker при offline навигации.

#### Функции:

- ✅ Красивый дизайн с КФА брендингом
- ✅ Кнопка "Попробовать снова"
- ✅ Автоматический reload при восстановлении связи
- ✅ Советы по устранению проблем

### 3. Service Worker Strategies

Настроенные стратегии кэширования в `vite.config.ts`:

```typescript
// Шрифты - CacheFirst, 1 год
{
  urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
  handler: 'CacheFirst',
  maxAge: 365 days,
}

// Изображения - CacheFirst, 30 дней
{
  urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
  handler: 'CacheFirst',
  maxAge: 30 days,
  maxEntries: 60,
}

// API - NetworkFirst, 5 минут
{
  urlPattern: /\/api\/.*/,
  handler: 'NetworkFirst',
  timeout: 10s,
  maxAge: 5 minutes,
}

// Навигация - Offline fallback
{
  urlPattern: navigation,
  handler: 'NetworkFirst',
  timeout: 3s,
  fallback: '/offline.html',
}
```

---

## 📥 Install Prompt

### Компонент: `PWAInstallPrompt`

Кастомный промпт для установки PWA приложения.

#### Функции:

- ✅ Автоматическое появление через 3 секунды
- ✅ Отслеживание установки (localStorage)
- ✅ Опция "Позже" (не показывать повторно)
- ✅ Список преимуществ установки
- ✅ Красивый UI с анимациями

#### События:

```typescript
// beforeinstallprompt - приложение можно установить
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Сохранить event для показа кастомного промпта
});

// appinstalled - приложение установлено
window.addEventListener('appinstalled', () => {
  localStorage.setItem('pwa-installed', 'true');
});
```

---

## 🔄 Update Notifications

### Компонент: `PWAUpdateNotification`

Уведомление о доступных обновлениях приложения.

#### Функции:

- ✅ Автоматическое определение новой версии
- ✅ One-click обновление
- ✅ Список изменений (What's New)
- ✅ Опция отложить обновление

#### Интеграция (будущая):

```typescript
import { useRegisterSW } from 'virtual:pwa-register/react';

const {
  needRefresh: [needRefresh, setNeedRefresh],
  updateServiceWorker,
} = useRegisterSW({
  onNeedRefresh() {
    // Показать уведомление
  },
  onOfflineReady() {
    // Приложение готово к offline
  },
});
```

---

## 🎯 Lighthouse CI

### Конфигурация: `lighthouserc.json`

Автоматический аудит PWA с помощью Lighthouse CI.

#### Запуск:

```bash
# 1. Установка
npm install -g @lhci/cli

# 2. Запуск аудита
lhci autorun

# Или вручную:
npm run build
npm run preview &
lhci collect
lhci assert
```

#### Минимальные требования:

| Метрика        | Минимум | Цель |
| -------------- | ------- | ---- |
| Performance    | 90%     | 95%+ |
| Accessibility  | 95%     | 100% |
| Best Practices | 95%     | 100% |
| SEO            | 95%     | 100% |
| PWA            | 90%     | 100% |

#### Core Web Vitals:

```
FCP (First Contentful Paint):  < 2s
LCP (Largest Contentful Paint): < 2.5s
CLS (Cumulative Layout Shift):  < 0.1
TBT (Total Blocking Time):      < 300ms
SI (Speed Index):                < 3s
```

---

## ✨ Best Practices

### 1. Performance

```typescript
// ✅ Lazy loading компонентов
const NewsPage = lazy(() => import('@/pages/public/News'));

// ✅ Image optimization
<img
  src="/image.jpg"
  srcSet="/image-400.jpg 400w, /image-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  alt="Description"
/>

// ✅ Code splitting
{
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-ui': ['@radix-ui/*'],
  'vendor-charts': ['recharts'],
}
```

### 2. Offline-First

```typescript
// ✅ Всегда проверяйте navigator.onLine
if (navigator.onLine) {
  fetchData();
} else {
  getCachedData();
}

// ✅ Слушайте online/offline события
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ✅ Используйте API кэш
const data = await cachedFetch(url, {
  key: 'unique-key',
  maxAge: 5 * 60 * 1000,
  staleWhileRevalidate: true,
});
```

### 3. Progressive Enhancement

```typescript
// ✅ Feature detection
if ('share' in navigator) {
  await navigator.share({ title, text, url });
} else {
  // Fallback
  copyToClipboard(url);
}

// ✅ Service Worker detection
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// ✅ IndexedDB detection
if ('indexedDB' in window) {
  apiCache.init();
}
```

### 4. Error Handling

```typescript
// ✅ Graceful degradation
try {
  const data = await fetch(url).then((r) => r.json());
  await apiCache.set('key', data, maxAge);
  return data;
} catch (error) {
  console.error('Fetch failed:', error);

  // Попытка получить из кэша
  const cached = await apiCache.get('key');
  if (cached) return cached;

  // Показать offline UI
  showOfflineMessage();
  throw error;
}
```

---

## 📦 Установка и Развертывание

### Development:

```bash
npm run dev
```

### Production Build:

```bash
# Генерация всех assets
npm run generate:all

# Сборка
npm run build

# Preview
npm run preview
```

### Lighthouse Audit:

```bash
npm run build
lhci autorun
```

---

## 🔧 Troubleshooting

### Service Worker не обновляется

```typescript
// 1. Очистить кэш
await caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))));

// 2. Unregister SW
navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((r) => r.unregister())));

// 3. Hard reload
window.location.reload();
```

### IndexedDB ошибки

```typescript
// Проверка доступности
if (!('indexedDB' in window)) {
  console.error('IndexedDB not supported');
  // Fallback на localStorage или memory cache
}

// Очистка базы
indexedDB.deleteDatabase('KFA_DB');
```

### Offline не работает

1. Проверьте Service Worker регистрацию
2. Проверьте Workbox конфигурацию
3. Проверьте `offline.html` в precache
4. Проверьте offline detection в компонентах

---

## 📚 Дополнительные Ресурсы

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Web Share API](https://web.dev/web-share/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Версия:** 2.0.0
**Дата обновления:** 2025-10-23
**Автор:** Claude Code SuperClaude Framework
