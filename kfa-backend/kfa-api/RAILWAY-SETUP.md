# Railway Deployment Setup for KFA API

## Проблемы, которые были исправлены:

1. ✅ **502 Bad Gateway** - заменили `php artisan serve` на Nginx + PHP-FPM
2. ✅ **SQLite в продакшене** - настроили PostgreSQL
3. ✅ **Production-ready конфигурация** - добавили кэширование и оптимизацию

## Шаги для деплоя на Railway:

### 1. Создайте PostgreSQL базу данных в Railway

В вашем проекте на Railway:

1. Нажмите **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway автоматически создаст переменную `DATABASE_URL`

### 2. Настройте переменные окружения

В Railway Dashboard → Settings → Variables, добавьте:

```bash
# Основные настройки
APP_NAME=KFA-API
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kfa-production.up.railway.app

# ВАЖНО: Сгенерируйте новый ключ!
APP_KEY=base64:your-generated-key-here

# База данных (Railway автоматически установит DATABASE_URL)
# Добавьте это для парсинга DATABASE_URL:
DB_CONNECTION=pgsql

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache
CACHE_STORE=database

# Queue
QUEUE_CONNECTION=database

# CORS (разрешить ваш фронтенд)
CORS_ALLOWED_ORIGINS=https://kfa-website.vercel.app,https://kfa-website-git-master-yourusername.vercel.app

# Mail (опционально, для уведомлений)
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@kfa.kg
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Сгенерируйте APP_KEY

Локально выполните:

```bash
cd kfa-backend/kfa-api
php artisan key:generate --show
```

Скопируйте полученный ключ (с префиксом `base64:`) и добавьте в переменные Railway.

### 4. Обновите CORS в Laravel

Файл `config/cors.php` должен содержать:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '*')),
'allowed_origins_patterns' => ['/\.vercel\.app$/'],
```

### 5. Push изменения в Git

```bash
git add .
git commit -m "Fix Railway deployment: Add Nginx, PostgreSQL, production config"
git push
```

Railway автоматически задеплоит ваше приложение.

### 6. Проверьте деплой

После успешного деплоя проверьте:

```bash
# Health check
curl https://kfa-production.up.railway.app/api/health

# Register endpoint
curl https://kfa-production.up.railway.app/api/auth/register
```

## Структура файлов

- `nixpacks.toml` - конфигурация Nixpacks для Railway
- `railway.json` - настройки деплоя
- `start.sh` - скрипт запуска с Nginx + PHP-FPM
- `Procfile` - команда запуска для Railway

## Отладка проблем

### Просмотр логов

В Railway Dashboard → Deployments → View Logs

### Частые ошибки

1. **"No application encryption key has been specified"**
   - Решение: Добавьте `APP_KEY` в переменные окружения

2. **"SQLSTATE[HY000] [2002] Connection refused"**
   - Решение: Убедитесь, что PostgreSQL база создана и `DATABASE_URL` установлен

3. **"502 Bad Gateway"**
   - Проверьте логи: возможно PHP-FPM не запустился
   - Убедитесь, что `PORT` переменная используется в Nginx конфигурации

### Проверка переменных окружения

```bash
# В Railway CLI
railway run env
```

## Миграция с SQLite на PostgreSQL

Данные из локальной SQLite базы НЕ переносятся автоматически.

При первом деплое:

1. Выполнятся миграции (`php artisan migrate --force`)
2. Создадутся роли и права (`php artisan db:seed --force --class=RoleSeeder`)

Тестовые пользователи НЕ создаются в продакшене (только роли).

## Производительность

Скрипт `start.sh` автоматически выполняет:

- ✅ Кэширование конфигурации
- ✅ Кэширование роутов
- ✅ Кэширование view
- ✅ Оптимизация autoloader

## Безопасность

- ✅ `APP_DEBUG=false` в продакшене
- ✅ Безопасные заголовки в Nginx
- ✅ Ограничение размера запросов (50MB)
- ✅ Защита от доступа к скрытым файлам

## Поддержка

Если возникли проблемы:

1. Проверьте логи в Railway Dashboard
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что PostgreSQL база подключена к проекту
