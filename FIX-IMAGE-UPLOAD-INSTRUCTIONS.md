# Исправление загрузки изображений для партнеров

## Проблема

При попытке загрузить изображение через MediaPicker возникает ошибка:
```
Ошибка загрузки медиафайлов. Вы можете ввести URL изображения вручную.
```

**Причина**: Bucket "media" не создан в Supabase Storage.

## Решение

### Шаг 1: Открыть Supabase Dashboard

1. Перейдите на https://supabase.com/dashboard
2. Войдите в свой аккаунт
3. Выберите проект KFA

### Шаг 2: Открыть SQL Editor

1. В левом меню нажмите **SQL Editor**
2. Нажмите **New Query** (или используйте существующий редактор)

### Шаг 3: Выполнить SQL скрипт

1. Скопируйте содержимое файла `CREATE-STORAGE-BUCKET.sql`
2. Вставьте в SQL Editor
3. Нажмите **Run** (или Ctrl+Enter / Cmd+Enter)

**Ожидаемый результат:**

После выполнения вы увидите два результата:

1. **Bucket информация** (1 строка):
   ```
   id    | name  | public | file_size_limit | ...
   media | media | true   | 52428800        | ...
   ```

2. **RLS Policies** (4 строки):
   - Public read access for media bucket
   - Authenticated users can upload to media bucket
   - Authenticated users can update media bucket
   - Authenticated users can delete from media bucket

### Шаг 4: Проверить bucket в Storage

1. В левом меню нажмите **Storage**
2. Вы должны увидеть bucket **media**
3. Bucket должен быть помечен как **Public**

### Шаг 5: Проверить загрузку

Запустите тестовый скрипт:

```bash
node test-storage-upload.mjs
```

**Ожидаемый вывод:**
```
🔍 Testing Supabase Storage upload...

1. Checking buckets...
✅ Found buckets: 1
   Bucket names: media
✅ Media bucket found: { name: 'media', public: true, id: 'media' }

2. Attempting to upload test file...
   File: uploads/test-1234567890.png
   Size: 68 bytes
✅ Upload successful!
   Path: uploads/test-1234567890.png
   Public URL: https://...

3. Cleaning up test file...
✅ Test file deleted

✨ Storage upload test completed successfully!
   Your storage is configured correctly.
```

### Шаг 6: Проверить в дашборде

1. Откройте https://kfa-website.vercel.app/dashboard/partners
2. Нажмите **Добавить партнера**
3. В поле "Логотип партнера" нажмите **Выбрать из библиотеки**
4. В модальном окне нажмите **Загрузить файлы**
5. Выберите изображение с вашего компьютера
6. Файл должен успешно загрузиться!

## Альтернативный способ (если SQL не работает)

Если выполнение SQL скрипта не помогло, создайте bucket вручную:

### Через Supabase Dashboard UI:

1. Перейдите в **Storage**
2. Нажмите **New Bucket**
3. Заполните форму:
   - **Name**: `media`
   - **Public bucket**: ✅ (включить)
   - **File size limit**: `50 MB` (52428800 bytes)
   - **Allowed MIME types**:
     ```
     image/jpeg, image/png, image/gif, image/webp, image/svg+xml, application/pdf
     ```
4. Нажмите **Create bucket**

### Настроить RLS политики:

После создания bucket вручную, все равно нужно выполнить часть SQL скрипта с политиками:

```sql
-- Скопируйте и выполните только эту часть в SQL Editor

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from media bucket" ON storage.objects;

CREATE POLICY "Public read access for media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload to media bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update media bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can delete from media bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
```

## Частые проблемы

### Ошибка: "new row violates row-level security policy"

**Причина**: RLS политики не настроены или пользователь не авторизован.

**Решение**:
1. Убедитесь, что вы вошли в систему (dashboard/partners требует авторизации)
2. Проверьте, что RLS политики созданы (выполните SQL скрипт)

### Ошибка: "Permission denied for storage bucket"

**Причина**: Bucket не является публичным или политики неправильно настроены.

**Решение**:
1. Откройте Storage в Supabase Dashboard
2. Выберите bucket "media"
3. Убедитесь, что "Public" включен
4. Перезапустите SQL скрипт с политиками

### Bucket уже существует

Если вы видите ошибку `duplicate key value violates unique constraint`:

**Решение**: Bucket уже создан, нужно только обновить политики:
```sql
-- Обновить существующий bucket
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']
WHERE id = 'media';

-- Затем создать политики (см. выше)
```

## Проверка конфигурации

Выполните в SQL Editor для проверки:

```sql
-- Проверить bucket
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id = 'media';

-- Проверить политики
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%media%';
```

**Ожидается:**
- 1 bucket 'media' с public = true
- 4 политики для SELECT, INSERT, UPDATE, DELETE

## Поддержка

Если проблема не решается:
1. Проверьте консоль браузера (F12) для подробных ошибок
2. Проверьте логи в Supabase Dashboard → Logs
3. Убедитесь, что вы авторизованы в системе
