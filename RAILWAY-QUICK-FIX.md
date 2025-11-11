# Исправление 502 Bad Gateway на Railway

## Что было не так?

1. ❌ `php artisan serve` - это только для локальной разработки
2. ❌ SQLite база - Railway удаляет данные при перезапуске
3. ❌ Нет production-ready веб-сервера

## Что исправлено?

1. ✅ Добавлен **Nginx + PHP-FPM** для продакшена
2. ✅ Настроен **PostgreSQL** вместо SQLite
3. ✅ Добавлено кэширование и оптимизации
4. ✅ Обновлена CORS конфигурация для Vercel

## Быстрый старт

### 1. В Railway Dashboard:

**Добавьте PostgreSQL базу:**

- New → Database → Add PostgreSQL

**Добавьте переменные окружения** (Settings → Variables):

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kfa-production.up.railway.app
DB_CONNECTION=pgsql
CORS_ALLOWED_ORIGINS=https://kfa-website.vercel.app
```

**Сгенерируйте APP_KEY:**

```bash
cd kfa-backend/kfa-api
php artisan key:generate --show
```

Скопируйте результат и добавьте в Railway как `APP_KEY`

### 2. Задеплойте изменения:

```bash
git add .
git commit -m "Fix Railway 502: Add Nginx, PostgreSQL, production config"
git push
```

Railway автоматически задеплоит с новой конфигурацией.

### 3. Проверьте работу:

```bash
curl https://kfa-production.up.railway.app/api/health
```

## Подробная документация

См. `kfa-backend/kfa-api/RAILWAY-SETUP.md` для детальной инструкции.

## Новые файлы

- `kfa-backend/kfa-api/nixpacks.toml` - конфигурация билда
- `kfa-backend/kfa-api/railway.json` - настройки деплоя
- `kfa-backend/kfa-api/start.sh` - скрипт запуска с Nginx
- `kfa-backend/kfa-api/.env.railway.example` - пример переменных окружения
- `kfa-backend/kfa-api/RAILWAY-SETUP.md` - подробная документация
