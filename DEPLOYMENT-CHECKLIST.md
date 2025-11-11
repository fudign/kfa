# ✅ Deployment Checklist - Supabase Integration

## Текущий статус: Готовимся к деплою

### ✅ Что уже сделано:

1. ✅ **Backend настроен**
   - PHP расширения pgsql включены
   - Laravel Supabase Flysystem установлен
   - config/filesystems.php настроен
   - .env настроен на прямое подключение

2. ✅ **Frontend настроен**
   - @supabase/supabase-js установлен
   - Supabase клиент создан (src/lib/supabase.ts)
   - .env настроен

3. ✅ **Supabase настроен**
   - SQL скрипт успешно выполнен
   - Storage buckets созданы (media, documents, avatars)
   - RLS policies настроены
   - PostgreSQL расширения установлены

---

## 🔄 Что нужно сделать сейчас:

### Шаг 1: Получить Service Role Key

**Где:** Supabase Dashboard → Settings → API

**Что копировать:** `service_role` key (не anon!)

**Куда добавить:**

1. Локально в `kfa-backend/kfa-api/.env`:

   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   ```

2. В Railway → Variables:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   ```

---

### Шаг 2: Проверить Storage Buckets

**Где:** Supabase Dashboard → Storage → Buckets

**Должны быть:**

- ✓ media (public)
- ✓ documents (private)
- ✓ avatars (public)

---

### Шаг 3: Проверить переменные в Railway

**Обязательные переменные для Railway:**

```env
# Database
DB_CONNECTION=pgsql
DB_HOST=db.eofneihisbhucxcydvac.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=egD.SYGb.F5Hm3r

# Supabase
SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo
SUPABASE_SERVICE_ROLE_KEY=<получить из Dashboard>
SUPABASE_STORAGE_BUCKET=media

# Filesystem
FILESYSTEM_DISK=supabase

# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kfa-production.up.railway.app
```

---

### Шаг 4: Git Commit и Push

```bash
# Проверить изменения
git status

# Добавить все файлы
git add .

# Создать коммит
git commit -m "Add Supabase integration with PostgreSQL and Storage

- Configure Laravel for Supabase PostgreSQL
- Install and configure Supabase Storage driver
- Create frontend Supabase client
- Add SQL setup scripts
- Update environment configurations for production"

# Push на удаленный репозиторий
git push origin master
```

---

### Шаг 5: Деплой на Railway

После git push:

1. **Railway автоматически задеплоит** новую версию
2. **Проверьте логи** в Railway Dashboard
3. **Дождитесь успешного деплоя** (зеленый статус)

---

### Шаг 6: Запустить миграции

**Через Railway CLI:**

```bash
# Установить Railway CLI (если еще не установлен)
npm i -g @railway/cli

# Войти
railway login

# Выбрать проект
railway link

# Запустить миграции
railway run php artisan migrate --force
```

**Или через Railway Dashboard:**

В разделе Services → Backend → Settings → Deploy:

- Custom Start Command: `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`

---

### Шаг 7: Проверить результат

#### 7.1 Проверить подключение к БД

```bash
# Через Railway CLI
railway run php artisan tinker --execute="DB::connection()->getPdo(); echo 'Connected!';"
```

Или через API:

```bash
curl https://kfa-production.up.railway.app/api/health
```

#### 7.2 Проверить таблицы в Supabase

Supabase Dashboard → Table Editor

Должны появиться таблицы:

- users
- migrations
- sessions
- cache
- jobs
- и другие из ваших миграций

#### 7.3 Проверить Storage

Попробуйте загрузить тестовый файл через API или frontend

---

### Шаг 8: Настроить RLS для таблиц (опционально)

После создания таблиц можно настроить RLS:

1. Откройте `supabase-setup.sql`
2. Раскомментируйте секцию "ENABLE ROW LEVEL SECURITY"
3. Настройте policies под ваши требования
4. Запустите в SQL Editor

---

## 🎯 Критерии успеха:

- [ ] Service Role Key получен и добавлен
- [ ] Storage buckets созданы в Supabase
- [ ] Git push выполнен
- [ ] Railway деплой успешен
- [ ] Миграции выполнены без ошибок
- [ ] БД подключение работает
- [ ] Таблицы созданы в Supabase
- [ ] Storage работает (можно загрузить файл)

---

## 🆘 Если что-то пошло не так:

### Ошибка при деплое Railway

**Проверьте:**

- Все переменные окружения установлены
- `SUPABASE_SERVICE_ROLE_KEY` добавлен
- Логи Railway: `railway logs`

### Ошибка при миграции

**Проверьте:**

- Подключение к БД работает
- Правильные credentials в Railway
- IPv6 поддерживается на Railway (должен быть)

### Storage не работает

**Проверьте:**

- Buckets созданы в Supabase
- RLS policies настроены
- `SUPABASE_KEY` и `SUPABASE_SERVICE_ROLE_KEY` правильные

---

## 📞 Полезные команды:

```bash
# Проверить логи Railway
railway logs

# Запустить команду в Railway
railway run <command>

# Открыть Railway Dashboard
railway open

# Проверить статус
railway status

# Подключиться к БД
railway run php artisan tinker
```

---

## 🎉 После успешного деплоя:

1. Протестируйте основные функции
2. Загрузите тестовые данные
3. Проверьте загрузку файлов
4. Настройте мониторинг
5. Создайте бэкап БД

**Проект готов к работе!** 🚀
