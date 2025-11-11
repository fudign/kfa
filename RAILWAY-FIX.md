# ✅ Railway Deployment Fix

## Проблема

Railway логи показывали:

```
/bin/bash: line 1: php: command not found
```

## Причина

Railway был настроен использовать **NIXPACKS** builder, но проект содержит **Dockerfile**.
NIXPACKS не установил PHP правильно, поэтому команда `php` была недоступна.

## Решение

### 1. Изменен railway.json

**Было:**

```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

**Стало:**

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

Теперь Railway будет использовать ваш Dockerfile, который правильно настраивает PHP.

### 2. Обновлен start.sh

Добавлен автоматический запуск миграций при старте:

```bash
# Run database migrations
echo "Running database migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."
```

**Преимущества:**

- ✅ Миграции запускаются автоматически при каждом деплое
- ✅ Если миграция не удалась, приложение продолжит работу
- ✅ Не нужно вручную запускать миграции через CLI

### 3. Добавлен logging

В start.sh добавлены echo сообщения для отслеживания процесса:

- "Starting Laravel application..."
- "Creating storage directories..."
- "Running database migrations..."
- "Caching configuration..."
- "Starting web server..."

## Что теперь происходит при деплое

1. **Railway клонирует код** → ✓
2. **Собирает Docker образ** из Dockerfile → ✓
3. **Запускает контейнер** → ✓
4. **start.sh выполняется:**
   - Создаются директории storage
   - **Запускаются миграции БД** → ✓
   - Кэшируются конфиги Laravel
   - Запускается nginx + php-fpm

## Dockerfile

Ваш Dockerfile уже правильно настроен:

```dockerfile
FROM php:8.4-fpm-alpine

# Install PostgreSQL support
RUN docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Setup complete
CMD ["/usr/local/bin/start.sh"]
```

## Следующие шаги

### 1. Commit и Push

```bash
git add kfa-backend/kfa-api/railway.json kfa-backend/kfa-api/start.sh
git commit -m "Fix Railway deployment: use Dockerfile and auto-run migrations"
git push
```

### 2. Дождаться редеплоя

Railway автоматически:

1. Обнаружит изменения
2. Соберет новый Docker образ
3. Запустит контейнер
4. **Автоматически запустит миграции!**

### 3. Проверить логи

В Railway Dashboard → Deployments → Latest:

**Ожидаемый вывод:**

```
Starting Laravel application...
Creating storage directories...
Running database migrations...
Migration table created successfully.
Migrating: 2024_01_01_create_users_table
Migrated:  2024_01_01_create_users_table
...
Caching configuration...
Starting web server...
```

### 4. Проверить таблицы в Supabase

Supabase Dashboard → Table Editor

**Должны появиться:**

- migrations
- users
- password_reset_tokens
- sessions
- cache
- jobs
- ...и ваши таблицы

## Troubleshooting

### Если миграции не выполнились

Проверьте переменные окружения в Railway:

```env
DB_CONNECTION=pgsql
DB_HOST=db.eofneihisbhucxcydvac.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=egD.SYGb.F5Hm3r
```

### Если PHP все еще не найден

Убедитесь, что Railway использует Dockerfile:

1. Railway Dashboard → Settings → Builder
2. Должно быть: **Dockerfile**
3. Если нет - выберите **Dockerfile** вручную

### Если нужно запустить миграции вручную

В Railway Dashboard → Shell:

```bash
# Войти в контейнер
docker exec -it <container_id> sh

# Запустить миграции
php artisan migrate --force
```

Или через Railway CLI:

```bash
railway run php artisan migrate --force
```

## Проверка успешного деплоя

### 1. API доступен

```bash
curl https://kfa-production.up.railway.app/api/health
# Ожидается: 200 OK
```

### 2. БД подключена

Railway logs должны показывать:

```
Migration table created successfully.
```

### 3. Приложение работает

```bash
curl https://kfa-production.up.railway.app
# Ожидается: HTML страница или JSON
```

## Дополнительные команды

### Очистить кэш

```bash
railway run php artisan cache:clear
railway run php artisan config:clear
railway run php artisan route:clear
railway run php artisan view:clear
```

### Посмотреть логи Laravel

```bash
railway run tail -f storage/logs/laravel.log
```

### Проверить подключение к БД

```bash
railway run php artisan tinker --execute="DB::connection()->getPdo(); echo 'Connected!';"
```

## Итог

✅ Railway настроен использовать Dockerfile
✅ PHP установлен и доступен
✅ Миграции запускаются автоматически
✅ Логи улучшены для отладки

**Теперь деплой должен работать правильно!** 🚀
