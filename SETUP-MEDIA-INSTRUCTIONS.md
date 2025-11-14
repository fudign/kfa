# Инструкция по настройке медиафайлов и Storage

## Проблема

При попытке загрузить изображение в новость появляется ошибка **"Не авторизован"**.

## Причины

1. Не создана таблица `media` в базе данных
2. Не создан bucket `media` в Supabase Storage
3. Не настроены политики доступа для storage
4. Пользователь не авторизован

## Решение

### Шаг 1: Создайте таблицу media в базе данных

1. Откройте **Supabase Dashboard** → https://supabase.com/dashboard
2. Войдите в проект: `eofneihisbhucxcydvac`
3. Откройте **SQL Editor** (в левом меню)
4. Создайте новый запрос (New Query)
5. Скопируйте содержимое файла `setup-media-storage.sql`
6. Вставьте в SQL Editor
7. Нажмите **RUN** или Ctrl+Enter

Вы должны увидеть сообщение: `"Таблица media успешно создана!"`

### Шаг 2: Создайте Storage Bucket

**ВАЖНО:** Bucket нельзя создать через SQL. Нужно использовать Dashboard.

1. В Supabase Dashboard перейдите в раздел **Storage** (в левом меню)
2. Нажмите кнопку **New bucket**
3. Заполните форму:
   - **Name:** `media`
   - **Public bucket:** ✅ **Включите** (чтобы файлы были доступны публично)
   - **File size limit:** Оставьте по умолчанию или установите 5 MB
4. Нажмите **Create bucket**

### Шаг 3: Настройте политики доступа для Storage

После создания bucket настройте политики:

1. В списке buckets найдите `media` и нажмите на него
2. Перейдите на вкладку **Policies**
3. Нажмите **New Policy**

#### Политика 1: Публичное чтение (SELECT)

```
Name: Public Read Access
Target roles: public
Allowed operations: SELECT
Policy definition: bucket_id = 'media'
```

Или через SQL в SQL Editor:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

#### Политика 2: Аутентифицированные могут загружать (INSERT)

```
Name: Authenticated Upload
Target roles: authenticated
Allowed operations: INSERT
Policy definition: bucket_id = 'media'
```

Или через SQL:

```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');
```

#### Политика 3: Обновление своих файлов (UPDATE)

```
Name: Users Update Own Files
Target roles: authenticated
Allowed operations: UPDATE
Policy definition: bucket_id = 'media' AND (storage.foldername(name))[1] = 'news'
```

Или через SQL:

```sql
CREATE POLICY "Users Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');
```

#### Политика 4: Удаление своих файлов (DELETE)

```
Name: Users Delete Own Files
Target roles: authenticated
Allowed operations: DELETE
Policy definition: bucket_id = 'media' AND (storage.foldername(name))[1] = 'news'
```

Или через SQL:

```sql
CREATE POLICY "Users Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
```

### Шаг 4: Проверьте авторизацию

Убедитесь, что вы авторизованы:

1. Откройте http://localhost:3000/auth/login
2. Войдите в систему с учетными данными администратора
3. После входа перейдите на http://localhost:3000/dashboard/news

### Шаг 5: Проверьте загрузку изображений

1. На странице **Dashboard → News** нажмите **"Добавить новость"**
2. Заполните основные поля (заголовок, контент)
3. Попробуйте загрузить изображение:
   - Перетащите файл в зону загрузки
   - Или нажмите на зону и выберите файл

Если все настроено правильно, изображение успешно загрузится!

## Проверка созданных объектов

### Проверить таблицу media:

```sql
SELECT * FROM public.media LIMIT 10;
```

### Проверить bucket:

1. Supabase Dashboard → Storage
2. Должен быть bucket с именем `media`

### Проверить политики storage:

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'media';
```

## Альтернативный метод (если не работает)

Если у вас все еще возникают проблемы с авторизацией, можно временно упростить политики:

```sql
-- Разрешить всем загружать файлы (только для разработки!)
CREATE POLICY "Allow all uploads (dev only)"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- Разрешить всем обновлять (только для разработки!)
CREATE POLICY "Allow all updates (dev only)"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'media');
```

**ВНИМАНИЕ:** Эти политики небезопасны для продакшена! Используйте только для тестирования.

## Устранение проблем

### Ошибка: "Bucket does not exist"

→ Создайте bucket `media` через Dashboard (Шаг 2)

### Ошибка: "Не авторизован"

→ Войдите в систему через /auth/login

### Ошибка: "new row violates row-level security policy"

→ Проверьте политики таблицы media (Шаг 1)

### Ошибка: "Policy violation"

→ Настройте политики storage (Шаг 3)

## После настройки

После успешной настройки вы сможете:

- ✅ Загружать изображения для новостей
- ✅ Просматривать загруженные изображения
- ✅ Использовать медиатеку для выбора изображений
- ✅ Удалять ненужные изображения

## Дополнительная информация

Документация Supabase Storage:

- https://supabase.com/docs/guides/storage
- https://supabase.com/docs/guides/storage/security/access-control
