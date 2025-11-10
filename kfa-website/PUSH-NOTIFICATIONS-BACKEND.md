# 🔔 Push Notifications Backend Setup Guide

Полное руководство по настройке backend для push уведомлений КФА.

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Генерация VAPID ключей](#генерация-vapid-ключей)
3. [Node.js + Express Backend](#nodejs--express-backend)
4. [База данных для подписок](#база-данных-для-подписок)
5. [Отправка уведомлений](#отправка-уведомлений)
6. [API Endpoints](#api-endpoints)
7. [Безопасность](#безопасность)
8. [Production Deployment](#production-deployment)
9. [Мониторинг и аналитика](#мониторинг-и-аналитика)

---

## 🏗️ Обзор архитектуры

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│   Backend    │─────▶│  Push Server │
│   (React)    │      │  (Node.js)   │      │  (Browser)   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     │                      │
       ▼                     ▼                      ▼
  Service Worker      PostgreSQL/MongoDB     Notification API
```

### Компоненты системы:

1. **Frontend (React + PWA)**
   - Компонент `PushNotificationManager`
   - Service Worker (`sw-push.js`)
   - Утилиты (`pushNotifications.ts`)

2. **Backend (Node.js + Express)**
   - API для регистрации подписок
   - Система отправки уведомлений
   - Управление VAPID ключами

3. **База данных**
   - Хранение подписок пользователей
   - История отправленных уведомлений
   - Настройки пользователей

4. **Push Service**
   - FCM (Firebase Cloud Messaging)
   - Browser native push services
   - VAPID authentication

---

## 🔑 Генерация VAPID ключей

VAPID (Voluntary Application Server Identification) ключи используются для аутентификации вашего сервера.

### Установка web-push:

```bash
npm install -g web-push
```

### Генерация ключей:

```bash
npx web-push generate-vapid-keys
```

Вывод:

```
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls
=======================================
```

### Хранение ключей:

Создайте `.env` файл:

```bash
VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U
VAPID_PRIVATE_KEY=UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls
VAPID_SUBJECT=mailto:contact@kfa.kg
```

**⚠️ ВАЖНО**: Никогда не коммитьте `.env` файл в git!

---

## 🚀 Node.js + Express Backend

### 1. Инициализация проекта:

```bash
mkdir kfa-push-server
cd kfa-push-server
npm init -y
```

### 2. Установка зависимостей:

```bash
npm install express web-push dotenv cors body-parser mongoose
npm install --save-dev nodemon typescript @types/node @types/express
```

### 3. Структура проекта:

```
kfa-push-server/
├── src/
│   ├── config/
│   │   └── vapid.ts           # VAPID конфигурация
│   ├── models/
│   │   └── Subscription.ts    # Модель подписки
│   ├── routes/
│   │   └── push.ts            # Push API routes
│   ├── services/
│   │   ├── pushService.ts     # Сервис отправки
│   │   └── notificationService.ts
│   └── server.ts              # Основной файл сервера
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

### 4. Основной сервер (`src/server.ts`):

```typescript
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import pushRoutes from './routes/push';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(bodyParser.json());

// Routes
app.use('/api/push', pushRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Запуск сервера
async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Push server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
```

### 5. VAPID конфигурация (`src/config/vapid.ts`):

```typescript
import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  subject: process.env.VAPID_SUBJECT!,
};

// Валидация ключей
if (!vapidKeys.publicKey || !vapidKeys.privateKey || !vapidKeys.subject) {
  throw new Error('VAPID keys are not configured. Check your .env file.');
}

// Настройка web-push
webPush.setVapidDetails(vapidKeys.subject, vapidKeys.publicKey, vapidKeys.privateKey);

export { vapidKeys, webPush };
```

---

## 💾 База данных для подписок

### MongoDB модель (`src/models/Subscription.ts`):

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId?: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
    userAgent: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
```

### PostgreSQL схема (альтернатива):

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_endpoint ON subscriptions(endpoint);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);
```

---

## 📤 Отправка уведомлений

### Push Service (`src/services/pushService.ts`):

```typescript
import { webPush } from '../config/vapid';
import Subscription from '../models/Subscription';

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  data?: any;
}

class PushService {
  /**
   * Отправить уведомление одному подписчику
   */
  async sendToSubscription(subscription: any, payload: PushPayload): Promise<boolean> {
    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload));
      return true;
    } catch (error: any) {
      console.error('Push send failed:', error);

      // Если подписка истекла (410 Gone), деактивировать
      if (error.statusCode === 410) {
        await this.deactivateSubscription(subscription.endpoint);
      }

      return false;
    }
  }

  /**
   * Отправить уведомление всем активным подписчикам
   */
  async sendToAll(payload: PushPayload): Promise<{
    success: number;
    failed: number;
  }> {
    const subscriptions = await Subscription.find({ isActive: true });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        this.sendToSubscription(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          payload,
        ),
      ),
    );

    const success = results.filter((r) => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - success;

    return { success, failed };
  }

  /**
   * Отправить уведомление конкретному пользователю
   */
  async sendToUser(userId: string, payload: PushPayload): Promise<boolean> {
    const subscriptions = await Subscription.find({
      userId,
      isActive: true,
    });

    if (subscriptions.length === 0) {
      return false;
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        this.sendToSubscription(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          payload,
        ),
      ),
    );

    return results.some((r) => r.status === 'fulfilled' && r.value);
  }

  /**
   * Деактивировать подписку
   */
  async deactivateSubscription(endpoint: string): Promise<void> {
    await Subscription.findOneAndUpdate({ endpoint }, { isActive: false });
  }
}

export default new PushService();
```

### Notification Service (`src/services/notificationService.ts`):

```typescript
import pushService, { PushPayload } from './pushService';

class NotificationService {
  /**
   * Отправить новость
   */
  async sendNews(newsId: string, title: string, preview: string) {
    const payload: PushPayload = {
      title: `📰 ${title}`,
      body: preview,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      url: `/news/${newsId}`,
      tag: `news-${newsId}`,
      requireInteraction: false,
      actions: [
        { action: 'open', title: 'Читать' },
        { action: 'close', title: 'Закрыть' },
      ],
      data: {
        type: 'news',
        id: newsId,
      },
    };

    return await pushService.sendToAll(payload);
  }

  /**
   * Отправить уведомление о событии
   */
  async sendEvent(eventId: string, title: string, date: string) {
    const payload: PushPayload = {
      title: `📅 ${title}`,
      body: `Событие запланировано на ${date}`,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      url: `/events/${eventId}`,
      tag: `event-${eventId}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'Подробнее' },
        { action: 'dismiss', title: 'Отклонить' },
      ],
      data: {
        type: 'event',
        id: eventId,
      },
    };

    return await pushService.sendToAll(payload);
  }

  /**
   * Отправить напоминание пользователю
   */
  async sendReminder(userId: string, title: string, time: string, url: string) {
    const payload: PushPayload = {
      title: `⏰ Напоминание: ${title}`,
      body: `Событие начнется через ${time}`,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      url,
      tag: `reminder-${Date.now()}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'Перейти' },
        { action: 'snooze', title: 'Отложить' },
      ],
      data: {
        type: 'reminder',
      },
    };

    return await pushService.sendToUser(userId, payload);
  }
}

export default new NotificationService();
```

---

## 🔌 API Endpoints

### Push Routes (`src/routes/push.ts`):

```typescript
import express from 'express';
import Subscription from '../models/Subscription';
import pushService from '../services/pushService';
import notificationService from '../services/notificationService';
import { vapidKeys } from '../config/vapid';

const router = express.Router();

/**
 * GET /api/push/vapid-public-key
 * Получить публичный VAPID ключ
 */
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

/**
 * POST /api/push/subscribe
 * Зарегистрировать новую подписку
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { endpoint, keys, userId, userAgent } = req.body;

    // Валидация
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({
        error: 'Invalid subscription data',
      });
    }

    // Проверка существующей подписки
    let subscription = await Subscription.findOne({ endpoint });

    if (subscription) {
      // Обновить существующую
      subscription.keys = keys;
      subscription.userId = userId;
      subscription.userAgent = userAgent;
      subscription.isActive = true;
      await subscription.save();
    } else {
      // Создать новую
      subscription = await Subscription.create({
        endpoint,
        keys,
        userId,
        userAgent,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Subscription registered',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to register subscription' });
  }
});

/**
 * DELETE /api/push/subscribe
 * Отписаться от уведомлений
 */
router.delete('/subscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    await Subscription.findOneAndUpdate({ endpoint }, { isActive: false });

    res.json({
      success: true,
      message: 'Subscription removed',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

/**
 * POST /api/push/send
 * Отправить тестовое уведомление (требует авторизации)
 */
router.post('/send', async (req, res) => {
  try {
    // TODO: Добавить проверку авторизации админа

    const { title, body, url, userId } = req.body;

    const payload = {
      title,
      body,
      url,
      icon: '/android-chrome-192x192.png',
    };

    let result;
    if (userId) {
      result = await pushService.sendToUser(userId, payload);
    } else {
      result = await pushService.sendToAll(payload);
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

/**
 * GET /api/push/stats
 * Получить статистику подписок
 */
router.get('/stats', async (req, res) => {
  try {
    const total = await Subscription.countDocuments();
    const active = await Subscription.countDocuments({ isActive: true });
    const inactive = total - active;

    res.json({
      total,
      active,
      inactive,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
```

---

## 🔒 Безопасность

### 1. Защита VAPID ключей:

```typescript
// ✅ Правильно - используем переменные окружения
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

// ❌ Неправильно - хардкод в коде
const vapidPrivateKey = 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls';
```

### 2. Валидация подписок:

```typescript
function validateSubscription(subscription: any): boolean {
  return !!(
    subscription &&
    subscription.endpoint &&
    subscription.keys &&
    subscription.keys.p256dh &&
    subscription.keys.auth &&
    typeof subscription.endpoint === 'string' &&
    subscription.endpoint.startsWith('https://')
  );
}
```

### 3. Rate Limiting:

```typescript
import rateLimit from 'express-rate-limit';

const pushLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // макс 100 запросов
  message: 'Too many requests, please try again later',
});

router.post('/subscribe', pushLimiter, async (req, res) => {
  // ...
});
```

### 4. CORS настройка:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
```

---

## 🚢 Production Deployment

### 1. Docker (`Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 2. Docker Compose (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  push-server:
    build: .
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
      - VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
      - VAPID_SUBJECT=${VAPID_SUBJECT}
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

volumes:
  mongo-data:
```

### 3. PM2 Process Manager:

```bash
npm install -g pm2

pm2 start dist/server.js --name kfa-push-server
pm2 save
pm2 startup
```

---

## 📊 Мониторинг и аналитика

### 1. Логирование с Winston:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Логирование отправки
logger.info('Push notification sent', {
  userId,
  type: 'news',
  success: true,
  timestamp: new Date(),
});
```

### 2. Метрики с Prometheus:

```typescript
import promClient from 'prom-client';

const pushCounter = new promClient.Counter({
  name: 'push_notifications_total',
  help: 'Total push notifications sent',
  labelNames: ['type', 'status'],
});

// Инкремент при отправке
pushCounter.inc({ type: 'news', status: 'success' });
```

---

## 📚 Полезные ссылки

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push npm package](https://github.com/web-push-libs/web-push)
- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

---

**Версия:** 1.0.0
**Дата обновления:** 2025-10-23
**Автор:** Claude Code SuperClaude Framework
