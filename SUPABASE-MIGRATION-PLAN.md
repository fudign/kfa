# План миграции на Supabase

## Информация о подключении

### Supabase Credentials

```
PostgreSQL Connection: postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres
SUPABASE_URL: https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo
```

## Архитектура проекта

### Frontend (kfa-website)

- React + Vite + TypeScript
- API клиент через Axios
- Аутентификация через токены
- Медиа загрузка через multipart/form-data

### Backend (kfa-backend/kfa-api)

- Laravel 11
- Текущая БД: SQLite (dev)
- API с Sanctum authentication
- Система ролей и разрешений (Spatie)

## Этап 1: Настройка Backend Laravel для PostgreSQL

### 1.1 Обновить конфигурацию базы данных

**Файл**: `kfa-backend/kfa-api/.env`

```env
# База данных Supabase PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=db.eofneihisbhucxcydvac.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=egD.SYGb.F5Hm3r

# Supabase API
SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo
SUPABASE_SERVICE_ROLE_KEY=<получить из Supabase Dashboard>

# Storage
FILESYSTEM_DISK=supabase
SUPABASE_STORAGE_BUCKET=media
```

### 1.2 Установить PHP расширения для PostgreSQL

```bash
# Проверить наличие расширений
php -m | grep pdo_pgsql
php -m | grep pgsql

# Если нет, установить (Windows)
# Раскомментировать в php.ini:
extension=pdo_pgsql
extension=pgsql
```

### 1.3 Установить Supabase Storage PHP клиент

**Файл**: `kfa-backend/kfa-api/composer.json`

```bash
cd kfa-backend/kfa-api
composer require supabase/storage-php
composer require guzzlehttp/guzzle
```

### 1.4 Создать Supabase Storage драйвер

**Файл**: `kfa-backend/kfa-api/app/Services/SupabaseStorageDriver.php`

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;
use Supabase\Storage\StorageClient;

class SupabaseStorageDriver
{
    protected $client;
    protected $bucket;

    public function __construct()
    {
        $this->client = new StorageClient(
            config('services.supabase.url') . '/storage/v1',
            [
                'apiKey' => config('services.supabase.key'),
                'Authorization' => 'Bearer ' . config('services.supabase.service_role_key')
            ]
        );
        $this->bucket = config('services.supabase.bucket', 'media');
    }

    public function upload($path, $file)
    {
        return $this->client->from($this->bucket)
            ->upload($path, $file);
    }

    public function get($path)
    {
        return $this->client->from($this->bucket)
            ->download($path);
    }

    public function delete($path)
    {
        return $this->client->from($this->bucket)
            ->remove([$path]);
    }

    public function url($path)
    {
        return $this->client->from($this->bucket)
            ->getPublicUrl($path);
    }

    public function exists($path)
    {
        try {
            $this->get($path);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
```

### 1.5 Настроить конфигурацию сервисов

**Файл**: `kfa-backend/kfa-api/config/services.php`

```php
return [
    // ... existing services

    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'key' => env('SUPABASE_KEY'),
        'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),
        'bucket' => env('SUPABASE_STORAGE_BUCKET', 'media'),
    ],
];
```

### 1.6 Обновить filesystems.php

**Файл**: `kfa-backend/kfa-api/config/filesystems.php`

```php
'disks' => [
    // ... existing disks

    'supabase' => [
        'driver' => 'supabase',
        'bucket' => env('SUPABASE_STORAGE_BUCKET', 'media'),
        'url' => env('SUPABASE_URL'),
        'visibility' => 'public',
    ],
],
```

## Этап 2: Настройка Supabase

### 2.1 Создать Storage Bucket в Supabase

Зайти в Supabase Dashboard → Storage → Create Bucket:

```
Bucket name: media
Public: true (для публичного доступа к изображениям)
File size limit: 10MB
Allowed MIME types: image/*, application/pdf, video/*
```

### 2.2 Настроить Storage Policies (RLS)

```sql
-- Политика для публичного чтения
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Политика для загрузки (только авторизованные)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Политика для обновления (только владельцы)
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Политика для удаления (только владельцы)
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.uid()::text = owner);
```

### 2.3 Создать дополнительные Buckets

```
Buckets:
- media (публичные медиафайлы: новости, события, аватары)
- documents (приватные документы: договоры, заявки)
- avatars (аватары пользователей)
```

## Этап 3: Миграция схемы базы данных

### 3.1 Запустить миграции в Supabase

```bash
cd kfa-backend/kfa-api

# Создать бэкап текущей БД (если есть данные)
php artisan db:backup

# Запустить миграции на Supabase PostgreSQL
php artisan migrate:fresh --force

# Запустить сиды
php artisan db:seed
```

### 3.2 Настроить Row Level Security (RLS) для таблиц

```sql
-- Включить RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Политики для users (пример)
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Политики для news (публичное чтение)
CREATE POLICY "Anyone can view published news"
ON news FOR SELECT
USING (status = 'published');

CREATE POLICY "Authenticated users can create news"
ON news FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Политики для media
CREATE POLICY "Anyone can view public media"
ON media FOR SELECT
USING (is_public = true);

CREATE POLICY "Authenticated users can upload media"
ON media FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### 3.3 Создать индексы для производительности

```sql
-- Индексы для поиска
CREATE INDEX idx_news_title ON news USING gin(to_tsvector('russian', title));
CREATE INDEX idx_news_content ON news USING gin(to_tsvector('russian', content));

-- Индексы для фильтрации
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Составные индексы
CREATE INDEX idx_news_status_created ON news(status, created_at DESC);
CREATE INDEX idx_members_type_status ON members(member_type, status);
```

## Этап 4: Обновление Media API

### 4.1 Обновить MediaController

**Файл**: `kfa-backend/kfa-api/app/Http/Controllers/API/MediaController.php`

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\SupabaseStorageDriver;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    protected $storage;

    public function __construct(SupabaseStorageDriver $storage)
    {
        $this->storage = $storage;
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'collection' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $collection = $request->input('collection', 'general');

        // Генерировать уникальное имя файла
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $collection . '/' . $filename;

        // Загрузить в Supabase Storage
        $this->storage->upload($path, file_get_contents($file));

        // Получить публичный URL
        $url = $this->storage->url($path);

        // Сохранить в БД
        $media = Media::create([
            'filename' => $filename,
            'path' => $path,
            'url' => $url,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'collection' => $collection,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'data' => $media,
            'message' => 'File uploaded successfully'
        ], 201);
    }

    public function delete($id)
    {
        $media = Media::findOrFail($id);

        // Удалить из Supabase Storage
        $this->storage->delete($media->path);

        // Удалить из БД
        $media->delete();

        return response()->json([
            'message' => 'File deleted successfully'
        ]);
    }
}
```

### 4.2 Добавить поля в таблицу media

```bash
php artisan make:migration add_supabase_fields_to_media_table
```

**Миграция**:

```php
public function up()
{
    Schema::table('media', function (Blueprint $table) {
        $table->string('bucket')->default('media')->after('collection');
        $table->string('storage_path')->nullable()->after('path');
        $table->boolean('is_public')->default(true)->after('mime_type');
    });
}
```

## Этап 5: Обновление Frontend

### 5.1 Обновить .env для frontend

**Файл**: `kfa-website/.env`

```env
# API Configuration
VITE_API_URL=https://kfa-production.up.railway.app/api

# Supabase Configuration
VITE_SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzI5NjksImV4cCI6MjA3ODQ0ODk2OX0.9jHkxmjfWQRu6DbFOiqaYH9URxKGHiH7q64HVMYt1eo

# Storage
VITE_STORAGE_URL=https://eofneihisbhucxcydvac.supabase.co/storage/v1/object/public/media
```

### 5.2 Установить Supabase клиент (опционально)

```bash
cd kfa-website
npm install @supabase/supabase-js
```

### 5.3 Создать Supabase клиент (если нужен прямой доступ)

**Файл**: `kfa-website/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper для получения публичного URL
export const getPublicUrl = (path: string, bucket = 'media') => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper для загрузки файлов напрямую в Supabase (обход backend)
export const uploadFile = async (file: File, path: string, bucket = 'media') => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);

  if (error) throw error;
  return data;
};
```

### 5.4 Обновить компонент загрузки медиа

**Файл**: `kfa-website/src/components/MediaUpload.tsx`

```typescript
import { useState } from 'react'
import { mediaAPI } from '@/services/api'
import { getPublicUrl } from '@/lib/supabase'

export const MediaUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)

      // Вариант 1: Загрузка через Laravel API
      const response = await mediaAPI.upload(file, 'news')
      setUploadedUrl(response.data.url)

      // Вариант 2: Прямая загрузка в Supabase (быстрее)
      // const path = `news/${Date.now()}_${file.name}`
      // await uploadFile(file, path)
      // const url = getPublicUrl(path)
      // setUploadedUrl(url)

    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploadedUrl && <img src={uploadedUrl} alt="Uploaded" />}
    </div>
  )
}
```

## Этап 6: Тестирование

### 6.1 Тесты подключения к БД

```bash
cd kfa-backend/kfa-api

# Проверить подключение
php artisan tinker
>>> DB::connection()->getPdo();

# Проверить таблицы
>>> DB::select('SELECT * FROM users LIMIT 1');

# Запустить тесты
php artisan test
```

### 6.2 Тесты Storage

```bash
# Создать тестовый контроллер
php artisan tinker
>>> Storage::disk('supabase')->put('test.txt', 'Hello Supabase!');
>>> Storage::disk('supabase')->exists('test.txt');
>>> Storage::disk('supabase')->get('test.txt');
>>> Storage::disk('supabase')->delete('test.txt');
```

### 6.3 Тесты API

```bash
# Тест загрузки медиа
curl -X POST http://localhost:8000/api/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.jpg" \
  -F "collection=news"

# Тест получения медиа
curl http://localhost:8000/api/media
```

## Этап 7: Миграция данных

### 7.1 Экспорт данных из SQLite

```bash
cd kfa-backend/kfa-api

# Экспорт в SQL
sqlite3 database/database.sqlite .dump > backup.sql

# Или через Laravel
php artisan db:backup
```

### 7.2 Импорт в PostgreSQL

```bash
# Преобразовать SQLite SQL в PostgreSQL формат
# (заменить AUTOINCREMENT на SERIAL, и т.д.)

# Импорт через psql
psql "postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres" < backup.sql

# Или через Laravel seeder
php artisan db:seed --class=DataMigrationSeeder
```

### 7.3 Миграция медиафайлов

```bash
# Создать команду для миграции
php artisan make:command MigrateMediaToSupabase
```

**Файл**: `app/Console/Commands/MigrateMediaToSupabase.php`

```php
<?php

namespace App\Console\Commands;

use App\Models\Media;
use App\Services\SupabaseStorageDriver;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateMediaToSupabase extends Command
{
    protected $signature = 'media:migrate-to-supabase';
    protected $description = 'Migrate media files from local storage to Supabase Storage';

    public function handle(SupabaseStorageDriver $storage)
    {
        $media = Media::all();
        $this->info("Migrating {$media->count()} media files...");

        $bar = $this->output->createProgressBar($media->count());

        foreach ($media as $item) {
            try {
                // Получить файл из локального storage
                $file = Storage::disk('local')->get($item->path);

                // Загрузить в Supabase
                $storage->upload($item->path, $file);

                // Обновить URL
                $item->url = $storage->url($item->path);
                $item->save();

                $bar->advance();
            } catch (\Exception $e) {
                $this->error("Failed to migrate {$item->filename}: {$e->getMessage()}");
            }
        }

        $bar->finish();
        $this->info("\nMigration completed!");
    }
}
```

```bash
# Запустить миграцию медиа
php artisan media:migrate-to-supabase
```

## Этап 8: Настройка Production

### 8.1 Обновить переменные окружения на Railway

```bash
# В Railway Dashboard добавить:
DB_CONNECTION=pgsql
DB_HOST=db.eofneihisbhucxcydvac.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=egD.SYGb.F5Hm3r

SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
SUPABASE_STORAGE_BUCKET=media

FILESYSTEM_DISK=supabase
```

### 8.2 Обновить Vercel переменные

```bash
# В Vercel Dashboard добавить:
VITE_SUPABASE_URL=https://eofneihisbhucxcydvac.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STORAGE_URL=https://eofneihisbhucxcydvac.supabase.co/storage/v1/object/public/media
```

### 8.3 Запустить миграции на production

```bash
# Через Railway CLI
railway run php artisan migrate --force

# Или через Railway Dashboard → Deploy
```

## Этап 9: Оптимизация и мониторинг

### 9.1 Настроить кэширование

```php
// config/cache.php
'stores' => [
    'supabase' => [
        'driver' => 'database',
        'table' => 'cache',
        'connection' => 'pgsql',
    ],
],
```

### 9.2 Настроить очереди

```php
// config/queue.php
'connections' => [
    'supabase' => [
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
        'connection' => 'pgsql',
    ],
],
```

### 9.3 Мониторинг производительности

```sql
-- В Supabase Dashboard → SQL Editor
-- Мониторинг медленных запросов
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Размер таблиц
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Контрольный чеклист

- [ ] Backend настроен на PostgreSQL Supabase
- [ ] PHP расширения pdo_pgsql установлены
- [ ] Supabase Storage драйвер создан и настроен
- [ ] Storage buckets созданы (media, documents, avatars)
- [ ] RLS политики настроены для storage
- [ ] Миграции базы данных выполнены
- [ ] RLS политики настроены для таблиц
- [ ] Индексы созданы
- [ ] MediaController обновлен для Supabase Storage
- [ ] Frontend .env обновлен
- [ ] Supabase клиент установлен (опционально)
- [ ] Тесты подключения выполнены
- [ ] Тесты Storage выполнены
- [ ] Тесты API выполнены
- [ ] Данные мигрированы из старой БД
- [ ] Медиафайлы мигрированы
- [ ] Production переменные обновлены (Railway)
- [ ] Production переменные обновлены (Vercel)
- [ ] Миграции выполнены на production
- [ ] Кэширование настроено
- [ ] Очереди настроены
- [ ] Мониторинг настроен

## Полезные ссылки

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Laravel PostgreSQL Docs](https://laravel.com/docs/database#postgresql)
- [Supabase PHP Client](https://github.com/supabase/storage-php)

## Примерное время выполнения

- Этап 1 (Backend setup): 1-2 часа
- Этап 2 (Supabase setup): 30 минут
- Этап 3 (Database migration): 1 час
- Этап 4 (Media API update): 1-2 часа
- Этап 5 (Frontend update): 1 час
- Этап 6 (Testing): 1-2 часа
- Этап 7 (Data migration): 2-3 часа
- Этап 8 (Production setup): 1 час
- Этап 9 (Optimization): 1 час

**Итого**: ~12-15 часов
