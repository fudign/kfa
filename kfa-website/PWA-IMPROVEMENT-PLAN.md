# 🚀 План доработки PWA и Favicon для KFA Website

**Дата создания:** 2025-10-23
**Статус:** В разработке
**Приоритет:** Высокий

---

## 📋 Оглавление

1. [Текущее состояние](#текущее-состояние)
2. [Цели доработки](#цели-доработки)
3. [Этап 1: Генерация Favicon](#этап-1-генерация-favicon)
4. [Этап 2: Улучшение PWA Манифеста](#этап-2-улучшение-pwa-манифеста)
5. [Этап 3: Meta-теги и SEO](#этап-3-meta-теги-и-seo)
6. [Этап 4: Offline поддержка](#этап-4-offline-поддержка)
7. [Этап 5: Service Worker оптимизация](#этап-5-service-worker-оптимизация)
8. [Тестирование](#тестирование)
9. [Метрики успеха](#метрики-успеха)

---

## 🔍 Текущее состояние

### Что есть:
- ✅ VitePWA плагин подключен
- ✅ Базовый манифест в vite.config.ts
- ✅ SVG логотип: `public/kfaICON.svg`
- ✅ Некоторые meta-теги в index.html
- ✅ Theme color установлен

### Что отсутствует:
- ❌ Favicon файлы (ico, png)
- ❌ PWA иконки (192x192, 512x512)
- ❌ Apple touch icons
- ❌ Полный набор meta-тегов (Twitter, Open Graph)
- ❌ Offline fallback страница
- ❌ App shortcuts в манифесте
- ❌ Categories и related_applications
- ❌ Кастомная стратегия кэширования

---

## 🎯 Цели доработки

1. **100% PWA совместимость** - пройти Lighthouse PWA аудит
2. **Брендинг** - единообразные иконки на всех платформах
3. **Offline-first** - работа без интернета
4. **SEO оптимизация** - полные meta-теги для соцсетей
5. **Производительность** - оптимизированное кэширование

---

## 📦 Этап 1: Генерация Favicon

### 1.1. Необходимые форматы

#### Стандартные Favicon:
```
public/
├── favicon.ico             # 16x16, 32x32, 48x48 (multi-size ICO)
├── favicon-16x16.png       # Legacy браузеры
├── favicon-32x32.png       # Современные браузеры
├── favicon-96x96.png       # Desktop shortcut
└── favicon.svg             # Современные браузеры (vector)
```

#### Apple Touch Icons:
```
public/
├── apple-touch-icon.png              # 180x180 (iOS Safari)
├── apple-touch-icon-precomposed.png  # 180x180 (старые iOS)
├── apple-touch-icon-57x57.png        # iPhone (legacy)
├── apple-touch-icon-60x60.png        # iPhone @2x
├── apple-touch-icon-72x72.png        # iPad
├── apple-touch-icon-76x76.png        # iPad @2x
├── apple-touch-icon-114x114.png      # iPhone @3x
├── apple-touch-icon-120x120.png      # iPhone 6
├── apple-touch-icon-144x144.png      # iPad Retina
└── apple-touch-icon-152x152.png      # iPad Pro
```

#### PWA Icons (Android/Desktop):
```
public/
├── pwa-192x192.png         # Android homescreen
├── pwa-512x512.png         # Android splash screen
├── pwa-maskable-192x192.png # Adaptive icons (Android 8+)
└── pwa-maskable-512x512.png # Adaptive icons (Android 8+)
```

#### Windows Metro Tiles:
```
public/
├── mstile-70x70.png        # Small tile
├── mstile-144x144.png      # Medium tile
├── mstile-150x150.png      # Wide tile
└── mstile-310x310.png      # Large tile
```

### 1.2. Технические требования

**Цветовая схема:**
- **Primary:** `#1A3A6B` (Темно-синий)
- **Accent:** `#D4AF37` (Золотой)
- **Background:** `#FFFFFF` (Белый)

**Размеры и форматы:**
- **ICO:** Multi-resolution (16, 32, 48)
- **PNG:** 24-bit с альфа-каналом
- **SVG:** Optimized, без лишних метаданных
- **Maskable icons:** Safe zone 40% от размера

**Оптимизация:**
- PNG: pngquant для сжатия
- SVG: SVGO для минификации
- ICO: Конвертация через sharp или imagemagick

### 1.3. Инструменты генерации

**Вариант А: PWA Asset Generator (рекомендуется)**
```bash
npm install -g pwa-asset-generator
pwa-asset-generator public/kfaICON.svg public/ \
  --background "#1A3A6B" \
  --favicon \
  --mstile \
  --maskable true \
  --padding "20%"
```

**Вариант Б: Realfavicongenerator.net**
- Онлайн сервис для генерации всех форматов
- Поддержка browserconfig.xml
- Автоматическая генерация HTML кода

**Вариант В: Sharp (Node.js)**
```javascript
// scripts/generate-icons.js
const sharp = require('sharp');
const sizes = [16, 32, 48, 96, 180, 192, 512];

async function generateIcons() {
  const svg = await sharp('public/kfaICON.svg');

  for (const size of sizes) {
    await svg
      .resize(size, size)
      .png()
      .toFile(`public/icon-${size}x${size}.png`);
  }
}
```

---

## 🎨 Этап 2: Улучшение PWA Манифеста

### 2.1. Расширенный manifest.webmanifest

```json
{
  "name": "Кыргызский Финансовый Альянс",
  "short_name": "КФА",
  "description": "Саморегулируемая организация профессиональных участников рынка ценных бумаг Кыргызской Республики",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "display_override": ["window-controls-overlay", "standalone"],
  "orientation": "portrait-primary",
  "theme_color": "#1A3A6B",
  "background_color": "#FFFFFF",

  "icons": [
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/favicon-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],

  "shortcuts": [
    {
      "name": "Новости",
      "short_name": "Новости",
      "description": "Последние новости КФА",
      "url": "/news",
      "icons": [{ "src": "/icons/news.png", "sizes": "96x96" }]
    },
    {
      "name": "События",
      "short_name": "События",
      "description": "Предстоящие мероприятия",
      "url": "/events",
      "icons": [{ "src": "/icons/events.png", "sizes": "96x96" }]
    },
    {
      "name": "Членство",
      "short_name": "Членство",
      "description": "Вступить в КФА",
      "url": "/membership/join",
      "icons": [{ "src": "/icons/join.png", "sizes": "96x96" }]
    },
    {
      "name": "Личный кабинет",
      "short_name": "Кабинет",
      "description": "Войти в систему",
      "url": "/login",
      "icons": [{ "src": "/icons/login.png", "sizes": "96x96" }]
    }
  ],

  "categories": ["finance", "business", "productivity"],
  "lang": "ru-KG",
  "dir": "ltr",

  "screenshots": [
    {
      "src": "/screenshots/desktop-home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Главная страница КФА"
    },
    {
      "src": "/screenshots/mobile-home.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Мобильная версия"
    }
  ],

  "related_applications": [],
  "prefer_related_applications": false,

  "iarc_rating_id": "e12345",

  "protocol_handlers": [
    {
      "protocol": "mailto",
      "url": "/contact?email=%s"
    }
  ]
}
```

### 2.2. Обновление vite.config.ts

```typescript
VitePWA({
  registerType: 'prompt', // Спрашивать пользователя об обновлении
  includeAssets: [
    'favicon.ico',
    'favicon.svg',
    'apple-touch-icon.png',
    'robots.txt',
    'sitemap.xml'
  ],

  manifest: {
    // ... конфигурация из 2.1
  },

  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365
          }
        }
      },
      {
        urlPattern: /^https:\/\/images\.unsplash\.com/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'unsplash-images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
          }
        }
      },
      {
        urlPattern: /\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 5 // 5 минут
          }
        }
      }
    ],
    navigateFallback: '/offline.html',
    navigateFallbackDenylist: [/^\/api/, /^\/auth/]
  },

  devOptions: {
    enabled: true, // Включить PWA в dev режиме
    type: 'module'
  }
})
```

---

## 🏷️ Этап 3: Meta-теги и SEO

### 3.1. Обновление index.html

```html
<!doctype html>
<html lang="ru-KG">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

    <!-- Primary Meta Tags -->
    <title>Кыргызский Финансовый Альянс - КФА</title>
    <meta name="title" content="Кыргызский Финансовый Альянс - КФА" />
    <meta name="description" content="Саморегулируемая организация профессиональных участников рынка ценных бумаг Кыргызской Республики. Регулирование, сертификация, развитие фондового рынка." />
    <meta name="keywords" content="КФА, фондовый рынок, ценные бумаги, Кыргызстан, биржа, финансы, инвестиции, брокеры, дилеры" />
    <meta name="author" content="Кыргызский Финансовый Альянс" />
    <meta name="robots" content="index, follow" />

    <!-- Theme Color -->
    <meta name="theme-color" content="#1A3A6B" />
    <meta name="msapplication-TileColor" content="#1A3A6B" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="shortcut icon" href="/favicon.ico" />

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />

    <!-- iOS Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="КФА" />

    <!-- Microsoft Tiles -->
    <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
    <meta name="msapplication-config" content="/browserconfig.xml" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://kfa.kg/" />
    <meta property="og:title" content="Кыргызский Финансовый Альянс - КФА" />
    <meta property="og:description" content="Устойчивое развитие фондового рынка через объединение усилий профессионалов и государства" />
    <meta property="og:image" content="https://kfa.kg/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="ru_KG" />
    <meta property="og:site_name" content="Кыргызский Финансовый Альянс" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://kfa.kg/" />
    <meta property="twitter:title" content="Кыргызский Финансовый Альянс - КФА" />
    <meta property="twitter:description" content="Устойчивое развитие фондового рынка через объединение усилий профессионалов и государства" />
    <meta property="twitter:image" content="https://kfa.kg/twitter-image.png" />

    <!-- PWA -->
    <link rel="manifest" href="/manifest.webmanifest" />

    <!-- Canonical -->
    <link rel="canonical" href="https://kfa.kg/" />

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

    <!-- Security -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="referrer" content="no-referrer-when-downgrade" />

    <!-- Language Alternatives -->
    <link rel="alternate" hreflang="ru" href="https://kfa.kg/ru" />
    <link rel="alternate" hreflang="en" href="https://kfa.kg/en" />
    <link rel="alternate" hreflang="ky" href="https://kfa.kg/ky" />
    <link rel="alternate" hreflang="x-default" href="https://kfa.kg/" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/main.tsx"></script>
  </body>
</html>
```

### 3.2. browserconfig.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/mstile-70x70.png"/>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#1A3A6B</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```

### 3.3. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

Sitemap: https://kfa.kg/sitemap.xml
```

---

## 📴 Этап 4: Offline поддержка

### 4.1. Offline страница

**Файл:** `public/offline.html`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Нет подключения - КФА</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1A3A6B 0%, #0F2847 100%);
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      text-align: center;
      max-width: 500px;
    }

    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .logo svg {
      width: 80px;
      height: 80px;
      fill: #D4AF37;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 15px;
      font-weight: 700;
    }

    p {
      font-size: 18px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 30px;
    }

    .retry-btn {
      background: #D4AF37;
      color: #1A3A6B;
      padding: 15px 40px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .retry-btn:hover {
      background: #E8C659;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }

    .offline-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      opacity: 0.6;
    }

    @media (max-width: 480px) {
      h1 { font-size: 24px; }
      p { font-size: 16px; }
      .logo { width: 100px; height: 100px; }
      .logo svg { width: 60px; height: 60px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <svg viewBox="0 0 24.14 24.14">
        <path fill="currentColor" d="M10.67 14.15l-0.02 -1.14 -0.34 0.6 0.36 0.54zm1.47 0.39l1.06 -0.03c-0.08,-0.28 -0.13,-0.58 -0.14,-0.88l-1.8 0.04 0 3.14 0.86 0 0.01 -2.26z"/>
      </svg>
    </div>

    <svg class="offline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728M7.05 7.05L19.778 19.778M3 12a9 9 0 0118 0 9 9 0 01-18 0z"/>
    </svg>

    <h1>Нет подключения к интернету</h1>
    <p>Проверьте ваше интернет-соединение и попробуйте снова.</p>

    <button class="retry-btn" onclick="window.location.reload()">
      Обновить страницу
    </button>
  </div>

  <script>
    // Автоматическая проверка подключения
    window.addEventListener('online', () => {
      window.location.reload();
    });
  </script>
</body>
</html>
```

### 4.2. React Offline компонент

**Файл:** `src/components/offline/OfflineBanner.tsx`

```typescript
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 px-4 py-3 text-center text-white">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-5 w-5" />
        <span className="text-sm font-medium">
          Нет подключения к интернету. Некоторые функции могут быть недоступны.
        </span>
      </div>
    </div>
  );
}
```

---

## ⚙️ Этап 5: Service Worker оптимизация

### 5.1. Custom Service Worker

**Файл:** `src/sw-custom.ts`

```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// Precache файлы сборки
precacheAndRoute(self.__WB_MANIFEST);

// Стратегии кэширования

// 1. Изображения - CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  })
);

// 2. Стили и скрипты - StaleWhileRevalidate
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// 3. API запросы - NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 минут
      }),
    ],
  })
);

// 4. Шрифты Google - CacheFirst
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 год
      }),
    ],
  })
);

// 5. Unsplash изображения - CacheFirst
registerRoute(
  ({ url }) => url.origin === 'https://images.unsplash.com',
  new CacheFirst({
    cacheName: 'unsplash-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  })
);

// Background Sync для отправки форм
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-sync') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  // Логика синхронизации данных форм
  console.log('Syncing form data...');
}

// Push уведомления
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title || 'Уведомление КФА', {
      body: data.body || 'Новое уведомление',
      icon: '/pwa-192x192.png',
      badge: '/badge-72x72.png',
      data: data.url,
    })
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data || '/')
  );
});
```

### 5.2. PWA Update Prompt

**Файл:** `src/components/pwa/UpdatePrompt.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download } from 'lucide-react';

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const update = () => {
    updateServiceWorker(true);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-white p-4 shadow-xl dark:bg-neutral-800">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 flex-shrink-0 text-primary-600" />
        <div className="flex-1">
          <h3 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">
            Доступно обновление
          </h3>
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            Новая версия приложения готова к установке
          </p>
          <div className="flex gap-2">
            <button
              onClick={update}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Обновить
            </button>
            <button
              onClick={close}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Тестирование

### 6.1. Lighthouse PWA Audit

**Критерии успеха:**
- ✅ Installable
- ✅ PWA Optimized
- ✅ Performance > 90
- ✅ Accessibility > 95
- ✅ Best Practices > 95
- ✅ SEO > 95

**Команда:**
```bash
npm run build
npm run preview
lighthouse http://localhost:4173 --view --only-categories=pwa,performance
```

### 6.2. Ручное тестирование

**Desktop (Chrome):**
1. Открыть DevTools → Application → Manifest
2. Проверить все поля манифеста
3. Проверить Service Worker регистрацию
4. Протестировать offline режим
5. Установить PWA через адресную строку

**Mobile (Android Chrome):**
1. Открыть сайт
2. "Add to Home Screen"
3. Проверить отображение иконки
4. Запустить из launcher
5. Проверить splash screen
6. Протестировать offline

**iOS Safari:**
1. Share → Add to Home Screen
2. Проверить Apple Touch Icon
3. Запустить из домашнего экрана
4. Проверить status bar

### 6.3. Автоматические тесты

**Файл:** `e2e/pwa.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test('should have valid manifest', async ({ page }) => {
    await page.goto('/');

    const manifest = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return fetch(link!.getAttribute('href')!).then(r => r.json());
    });

    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('should register service worker', async ({ page }) => {
    await page.goto('/');

    const swRegistered = await page.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'serviceWorker' in navigator &&
             (await navigator.serviceWorker.getRegistration()) !== undefined;
    });

    expect(swRegistered).toBe(true);
  });

  test('should work offline', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Включить offline режим
    await context.setOffline(true);

    // Перезагрузить страницу
    await page.reload();

    // Проверить что страница загрузилась
    await expect(page.locator('body')).toBeVisible();
  });
});
```

---

## 📊 Метрики успеха

### 7.1. KPI

| Метрика | Текущее | Цель | Статус |
|---------|---------|------|--------|
| Lighthouse PWA Score | 0 | 100 | 🔴 |
| Installation Rate | 0% | 15% | 🔴 |
| Offline Success Rate | 0% | 95% | 🔴 |
| Cache Hit Ratio | 0% | 80% | 🔴 |
| First Load (3G) | 4.5s | <3s | 🔴 |
| Repeat Load | 3.2s | <1s | 🔴 |

### 7.2. Мониторинг

**Google Analytics Events:**
```javascript
// PWA Install
gtag('event', 'pwa_install', {
  event_category: 'PWA',
  event_label: 'Install Prompt Shown'
});

// Offline Usage
gtag('event', 'offline_usage', {
  event_category: 'PWA',
  event_label: 'App Used Offline'
});

// Update Prompt
gtag('event', 'update_prompt', {
  event_category: 'PWA',
  event_label: 'Update Accepted'
});
```

---

## 📅 Roadmap

### Неделя 1: Favicon & Manifest
- [x] Генерация всех favicon форматов
- [x] Обновление манифеста
- [x] Обновление index.html
- [ ] Тестирование на устройствах

### Неделя 2: Offline Support
- [ ] Создание offline страницы
- [ ] Настройка Service Worker
- [ ] Кастомные стратегии кэширования
- [ ] Тестирование offline режима

### Неделя 3: Advanced Features
- [ ] PWA Shortcuts
- [ ] Push уведомления (опционально)
- [ ] Background Sync
- [ ] Web Share API

### Неделя 4: Optimization & Testing
- [ ] Performance аудит
- [ ] Lighthouse тесты
- [ ] Кросс-браузерное тестирование
- [ ] Production deploy

---

## 📚 Ресурсы

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Favicon Generator](https://realfavicongenerator.net/)
- [Maskable Icon Editor](https://maskable.app/editor)

---

**Документ обновлен:** 2025-10-23
**Ответственный:** Development Team
**Статус:** Ready for Implementation
