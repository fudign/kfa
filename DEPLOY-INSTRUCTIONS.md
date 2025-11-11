# Инструкции по деплою на Production

## ⚠️ Важно: Локальная разработка

**PostgreSQL подключение не работает локально** из-за отсутствия поддержки IPv6 в Windows/XAMPP.
Это **не проблема** - на production (Railway/Vercel) IPv6 полностью поддерживается.

### Варианты для локальной разработки:

1. **Использовать SQLite локально** (рекомендуется для быстрой разработки)
2. **Использовать Docker** с PostgreSQL локально
3. **Разрабатывать напрямую на staging/production**

---

## 🚀 Деплой на Railway (Backend)

### 1. Обновить переменные окружения

В Railway Dashboard → Variables добавьте:

```env
# Database - Supabase PostgreSQL (прямое подключение)
DB_CONNECTION=pgsql
DB_HOST=db.eofneihisbhucxcydvac.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=egD.SYGb.F5Hm3r

# Supabase
SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo
SUPABASE_SERVICE_ROLE_KEY=<получить из Supabase Dashboard → Settings → API>
SUPABASE_STORAGE_BUCKET=media

# Filesystem
FILESYSTEM_DISK=supabase

# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kfa-production.up.railway.app
```

### 2. Запустить миграции

После деплоя, выполните через Railway CLI или Dashboard:

```bash
php artisan migrate --force
php artisan db:seed --force  # если есть сиды
```

---

## 🎨 Деплой на Vercel (Frontend)

### Переменные окружения

В Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://kfa-production.up.railway.app/api
VITE_SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo
VITE_STORAGE_URL=https://eofneihisbhucxcydvac.supabase.co/storage/v1/object/public/media
VITE_ENV=production
```

---

## 🗄️ Настройка Supabase Database

### 1. Запустить SQL скрипт

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите проект `eofneihisbhucxcydvac`
3. Перейдите в **SQL Editor**
4. Создайте новый запрос
5. Скопируйте содержимое файла `supabase-setup.sql`
6. Нажмите **Run**

Это создаст:

- ✅ Storage buckets (media, documents, avatars)
- ✅ RLS policies для Storage
- ✅ PostgreSQL расширения (pg_trgm, uuid-ossp)
- ✅ Функции и триггеры

### 2. Проверить buckets

После выполнения SQL:

1. Перейдите в **Storage → Buckets**
2. Убедитесь, что созданы:
   - `media` (public)
   - `documents` (private)
   - `avatars` (public)

### 3. Проверить RLS policies

1. Перейдите в **Storage → Policies**
2. Убедитесь, что созданы policies для:
   - Public read access
   - Authenticated upload
   - Owner update/delete

---

## 📊 После деплоя - Настройка RLS для таблиц

После того, как Laravel создаст таблицы на production:

1. Откройте `supabase-setup.sql`
2. Раскомментируйте секцию **"1. ENABLE ROW LEVEL SECURITY"**
3. Настройте policies под ваши требования
4. Запустите в SQL Editor

Пример для news:

```sql
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
ON news FOR SELECT
USING (status = 'published');

CREATE POLICY "Authenticated users can create news"
ON news FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

---

## 🧪 Проверка после деплоя

### Backend (Railway)

```bash
# Проверить статус
curl https://kfa-production.up.railway.app/api/health

# Проверить подключение к БД
curl https://kfa-production.up.railway.app/api/ping
```

### Frontend (Vercel)

```bash
# Открыть в браузере
https://kfa-website.vercel.app

# Проверить загрузку данных
# Откройте DevTools → Network
```

### Database

В Supabase Dashboard:

1. **Table Editor** - проверьте таблицы созданы
2. **Storage** - проверьте buckets
3. **Database → Connection info** - проверьте активные подключения

---

## 🔧 Troubleshooting на Production

### Ошибка: "SQLSTATE[08006] connection failed"

**Проверьте:**

1. Правильность `DB_HOST` и `DB_PASSWORD` в Railway
2. Firewall правила в Supabase (обычно все разрешено)
3. Логи Railway: `railway logs`

### Ошибка: Storage не работает

**Проверьте:**

1. `SUPABASE_KEY` установлен
2. `SUPABASE_SERVICE_ROLE_KEY` установлен (для backend)
3. Buckets созданы в Supabase
4. RLS policies настроены

### Ошибка: 500 Internal Server Error

**Проверьте:**

1. Railway logs: `railway logs`
2. Laravel logs в Dashboard
3. `APP_DEBUG=false` и `APP_ENV=production`
4. Миграции выполнены

---

## 📝 Checklist перед деплоем

### Backend (Railway)

- [ ] Все переменные окружения установлены
- [ ] `SUPABASE_SERVICE_ROLE_KEY` получен и добавлен
- [ ] `FILESYSTEM_DISK=supabase`
- [ ] Git push выполнен

### Frontend (Vercel)

- [ ] Все переменные окружения установлены
- [ ] `VITE_API_URL` указывает на Railway
- [ ] Git push выполнен
- [ ] Build успешно прошел

### Supabase

- [ ] SQL скрипт выполнен
- [ ] Buckets созданы
- [ ] Storage RLS policies настроены
- [ ] Миграции выполнены на production
- [ ] Table RLS policies настроены (после миграций)

---

## 🎉 После успешного деплоя

1. **Создайте первого пользователя** через Supabase Auth или Laravel Tinker
2. **Протестируйте загрузку файлов** через интерфейс
3. **Проверьте все основные функции:**
   - Регистрация/вход
   - CRUD операции
   - Загрузка медиа
   - Публичные/приватные страницы

4. **Настройте мониторинг:**
   - Railway: встроенный мониторинг
   - Supabase: Dashboard → Reports
   - Vercel: Analytics

---

## 🆘 Поддержка

Если что-то не работает:

1. Проверьте логи в Railway/Vercel/Supabase
2. Сравните с локальной конфигурацией
3. Обратитесь к `SUPABASE-MIGRATION-PLAN.md` для деталей

**Connection String для справки:**

```
postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres
```

Удачи с деплоем! 🚀
