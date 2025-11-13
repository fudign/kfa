# Инструкция по настройке Supabase для KFA

## Шаг 1: Создание таблицы profiles

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект `eofneihisbhucxcydvac`
3. Перейдите в **SQL Editor**
4. Скопируйте и выполните содержимое файла `EXECUTE-THIS-IN-SUPABASE.sql`

## Шаг 2: Создание таблиц CMS

1. В том же **SQL Editor**
2. Скопируйте и выполните содержимое файла `supabase-cms-tables.sql`

Этот скрипт создаст следующие таблицы:

- `news` - таблица новостей
- `media` - таблица медиафайлов
- `events` - таблица событий
- `event_registrations` - таблица регистраций на события
- `partners` - таблица партнёров

## Шаг 3: Создание Storage Bucket для медиафайлов

1. Перейдите в **Storage** в левом меню
2. Нажмите **Create a new bucket**
3. Введите имя: `media`
4. Установите **Public bucket**: `true` (включить)
5. Установите **File size limit**: `10 MB`
6. Нажмите **Create bucket**

### Настройка политик доступа к Storage

После создания bucket `media`, добавьте следующие политики:

```sql
-- Политика: Все могут читать файлы
CREATE POLICY "Anyone can view media files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Политика: Аутентифицированные пользователи могут загружать файлы
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Политика: Пользователи могут удалять свои файлы
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Шаг 4: Создание тестовых пользователей

Выполните в SQL Editor:

```sql
-- Создание тестовых пользователей (если не созданы через интерфейс)
-- Эти пользователи уже должны существовать в auth.users
-- Если нет, создайте их через Supabase Auth UI

-- Обновление профилей с правами доступа
UPDATE public.profiles
SET role = 'admin', roles = ARRAY['admin', 'editor', 'moderator', 'member']
WHERE email = 'admin@kfa.kg';

UPDATE public.profiles
SET role = 'editor', roles = ARRAY['editor', 'member']
WHERE email = 'editor@kfa.kg';

UPDATE public.profiles
SET role = 'moderator', roles = ARRAY['moderator', 'member']
WHERE email = 'moderator@kfa.kg';

UPDATE public.profiles
SET role = 'member', roles = ARRAY['member']
WHERE email = 'member@kfa.kg';
```

## Шаг 5: Проверка установки

Выполните следующие запросы для проверки:

```sql
-- Проверка таблиц
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Проверка пользователей
SELECT email, role, roles
FROM public.profiles
ORDER BY email;

-- Проверка новостей (должны быть 2 тестовые записи)
SELECT id, title, status, featured
FROM public.news;

-- Проверка bucket
SELECT name, public, file_size_limit
FROM storage.buckets
WHERE id = 'media';
```

## Шаг 6: Тестирование в приложении

1. Запустите локальное приложение: `npm run dev`
2. Войдите как администратор:
   - Email: `admin@kfa.kg`
   - Password: `password`
3. Перейдите в `/dashboard/news`
4. Попробуйте создать новость
5. Попробуйте загрузить изображение

## Возможные проблемы и решения

### 1. Ошибка: "relation does not exist"

**Причина**: Таблицы не созданы или созданы в другой схеме

**Решение**: Проверьте, что SQL скрипты выполнены без ошибок

### 2. Ошибка: "permission denied"

**Причина**: RLS (Row Level Security) блокирует доступ

**Решение**: Проверьте политики RLS:

```sql
SELECT * FROM pg_policies WHERE tablename = 'news';
```

### 3. Ошибка: "bucket not found"

**Причина**: Storage bucket не создан

**Решение**: Создайте bucket `media` через UI или выполните:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 10485760);
```

### 4. Изображения не загружаются

**Причина**: Нет политик доступа к Storage

**Решение**: Выполните SQL политики из Шага 3

## Учётные данные для тестирования

| Email            | Password | Роль      | Доступ                             |
| ---------------- | -------- | --------- | ---------------------------------- |
| admin@kfa.kg     | password | admin     | Полный доступ                      |
| editor@kfa.kg    | password | editor    | Создание и редактирование контента |
| moderator@kfa.kg | password | moderator | Модерация контента                 |
| member@kfa.kg    | password | member    | Только просмотр                    |

## Полезные ссылки

- [Supabase Dashboard](https://supabase.com/dashboard/project/eofneihisbhucxcydvac)
- [SQL Editor](https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql)
- [Authentication](https://supabase.com/dashboard/project/eofneihisbhucxcydvac/auth/users)
- [Storage](https://supabase.com/dashboard/project/eofneihisbhucxcydvac/storage/buckets)
- [Table Editor](https://supabase.com/dashboard/project/eofneihisbhucxcydvac/editor)
