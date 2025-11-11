# Supabase Migration - Следующие шаги

## ✅ Что уже сделано:

### Backend (Laravel)

- ✅ PHP расширения `pgsql` и `pdo_pgsql` включены
- ✅ Установлен пакет `quix-labs/laravel-supabase-flysystem` для Storage
- ✅ Настроен `config/filesystems.php` для Supabase Storage
- ✅ Обновлен `.env` с учетными данными Supabase

### Frontend (React + Vite)

- ✅ Установлен `@supabase/supabase-js`
- ✅ Создан Supabase клиент в `src/lib/supabase.ts`
- ✅ Настроен `.env` с URL и ключами Supabase

### Документация

- ✅ Создан SQL скрипт `supabase-setup.sql` для настройки БД
- ✅ Существует подробный план миграции `SUPABASE-MIGRATION-PLAN.md`

---

## ⚠️ ВАЖНО: Локальная разработка

### Текущая ситуация

PostgreSQL настроен на **прямое подключение** через порт 5432:

```
postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres
```

**Это подключение работает на production** (Railway/Vercel поддерживают IPv6), но **не работает локально** на Windows из-за отсутствия поддержки IPv6.

### Решения для локальной разработки

**Вариант 1: Использовать SQLite локально (Рекомендуется)**

```env
# В kfa-backend/kfa-api/.env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

**Вариант 2: Тестировать напрямую на staging/production**

- Supabase Storage работает из любой точки (через HTTPS)
- Деплойте изменения на Railway для тестирования БД

**Вариант 3: Docker с локальным PostgreSQL**

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

---

## 📋 Следующие шаги

### Шаг 1: Получить Service Role Key

1. Зайдите в **Settings → API**
2. Скопируйте **service_role key** (⚠️ НЕ публикуйте этот ключ!)
3. Добавьте в `kfa-backend/kfa-api/.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=вставьте_ключ_здесь
   ```

---

### Шаг 2: Настроить Supabase Storage

1. Зайдите в **Storage → Buckets**
2. Создайте buckets или запустите SQL скрипт `supabase-setup.sql`
3. Перейдите в **SQL Editor**
4. Скопируйте и запустите содержимое файла `supabase-setup.sql`

Это создаст:

- ✅ Storage buckets (media, documents, avatars)
- ✅ RLS policies для Storage
- ✅ PostgreSQL расширения
- ✅ Функции и триггеры

---

### Шаг 3: Запустить миграции базы данных

После успешного подключения к БД:

```bash
cd kfa-backend/kfa-api

# Запустить миграции
php artisan migrate

# Или создать новую БД с нуля
php artisan migrate:fresh

# Запустить сиды (если есть)
php artisan db:seed
```

---

### Шаг 4: Настроить RLS для таблиц

После создания таблиц Laravel, откройте `supabase-setup.sql` и:

1. Раскомментируйте секции RLS policies для таблиц
2. Настройте policies под ваши требования
3. Запустите SQL в Supabase Dashboard → SQL Editor

---

### Шаг 5: Протестировать подключения

#### 5.1 Тест БД подключения

```bash
cd kfa-backend/kfa-api
php test-laravel-db.php
```

Ожидаемый результат:

```
✓ Laravel DB connection successful!
PostgreSQL Version: PostgreSQL 15.x...
```

#### 5.2 Тест Storage

```bash
php artisan tinker
>>> Storage::disk('supabase')->put('test.txt', 'Hello Supabase!');
>>> Storage::disk('supabase')->exists('test.txt');
>>> Storage::disk('supabase')->get('test.txt');
>>> Storage::disk('supabase')->delete('test.txt');
```

---

### Шаг 6: Обновить MediaController (опционально)

Если у вас есть MediaController, обновите его для работы с Supabase Storage.

**Пример:**

```php
use Illuminate\Support\Facades\Storage;

public function upload(Request $request)
{
    $file = $request->file('file');
    $path = 'media/' . time() . '_' . $file->getClientOriginalName();

    // Загрузить в Supabase Storage
    Storage::disk('supabase')->put($path, file_get_contents($file));

    // Получить публичный URL
    $url = Storage::disk('supabase')->url($path);

    return response()->json([
        'success' => true,
        'path' => $path,
        'url' => $url
    ]);
}
```

---

### Шаг 7: Использовать Supabase на Frontend

**Пример загрузки файла:**

```typescript
import { uploadFile, getPublicUrl } from '@/lib/supabase';

// Загрузить файл
const file = event.target.files[0];
const path = `news/${Date.now()}_${file.name}`;

const result = await uploadFile(file, path, 'media');

if (result.success) {
  console.log('File uploaded:', result.data.url);
}
```

**Пример получения публичного URL:**

```typescript
import { getPublicUrl } from '@/lib/supabase';

const imageUrl = getPublicUrl('news/image.jpg', 'media');
```

---

## 🚀 Деплой на Production

### Railway (Backend)

Обновите переменные окружения:

```env
DB_HOST=[правильный pooler host]
DB_PORT=6543
DB_USERNAME=postgres.eofneihisbhucxcydvac
DB_PASSWORD=egD.SYGb.F5Hm3r
SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
FILESYSTEM_DISK=supabase
```

### Vercel (Frontend)

Переменные уже настроены в `kfa-website/.env` ✓

---

## 📚 Дополнительные ресурсы

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Laravel Flysystem Docs](https://laravel.com/docs/filesystem)

---

## 🆘 Troubleshooting

### Проблема: "could not translate host name"

**Решение:** Используйте Connection Pooler (см. Шаг 1.1)

### Проблема: "Network is unreachable" с IPv6

**Решение:** IPv6 не поддерживается. Используйте pooler или деплойте на production

### Проблема: "Tenant or user not found"

**Решение:** Проверьте формат username: должен быть `postgres.eofneihisbhucxcydvac`

### Проблема: Storage не работает

**Решение:**

1. Проверьте, что buckets созданы
2. Проверьте RLS policies для Storage
3. Проверьте `SUPABASE_KEY` в `.env`

---

## ✅ Checklist для завершения миграции

- [ ] Получить SUPABASE_SERVICE_ROLE_KEY из Supabase Dashboard
- [ ] Добавить SUPABASE_SERVICE_ROLE_KEY в Railway переменные
- [ ] Запустить `supabase-setup.sql` в Supabase Dashboard
- [ ] Git push для деплоя на Railway
- [ ] Запустить `php artisan migrate --force` на Railway
- [ ] Протестировать подключение к БД на production
- [ ] Протестировать Storage через API
- [ ] Настроить RLS policies для таблиц (после миграций)
- [ ] Протестировать загрузку файлов через фронтенд
- [ ] Настроить мониторинг и бэкапы

---

**Удачи с миграцией! 🎉**

Если возникнут вопросы, обратитесь к подробному плану в `SUPABASE-MIGRATION-PLAN.md`
