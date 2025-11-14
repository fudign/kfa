# Простая инструкция по созданию Storage политик

## Вариант 1: Через UI (рекомендуется)

### Шаг 1: Открыть Policies

1. Supabase Dashboard → Storage
2. Нажать на bucket **media**
3. Вкладка **Policies** (или **Configuration** → **Policies**)

### Шаг 2: Создать первую политику (для загрузки)

Нажмите **New Policy** (зеленая кнопка) или **Create a policy**

Если видите шаблоны - пропустите их, найдите **"Create a custom policy"** или **"From scratch"**

**Заполните форму:**

```
Policy name: Allow authenticated uploads

Policy command: INSERT (выберите из dropdown)

Target roles: authenticated

USING expression:
bucket_id = 'media'

WITH CHECK expression:
bucket_id = 'media'
```

Нажмите **Review** и потом **Save policy**

### Шаг 3: Создать вторую политику (для чтения)

Еще раз **New Policy** → **Custom policy**

```
Policy name: Public read access

Policy command: SELECT

Target roles: public (или оставьте пустым)

USING expression:
bucket_id = 'media'
```

**Save policy**

---

## Вариант 2: Через SQL (если UI не работает)

Если в Supabase UI возникают проблемы, попробуйте через SQL Editor:

### Для SERVICE ROLE ключа (если есть доступ):

1. Settings → API → Copy `service_role` key
2. SQL Editor → New query
3. Вставьте и выполните:

```sql
-- Включить RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Политика для чтения
CREATE POLICY "public_read_media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media');

-- Политика для загрузки
CREATE POLICY "authenticated_upload_media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');
```

---

## Вариант 3: Временное решение (отключить RLS)

⚠️ **ТОЛЬКО ДЛЯ ТЕСТИРОВАНИЯ!** Не для production!

SQL Editor:

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

Это отключит все проверки безопасности. После проверки что загрузка работает, ОБЯЗАТЕЛЬНО включите обратно:

```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

И создайте правильные политики.

---

## Проверка что политики созданы

SQL Editor:

```sql
SELECT
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%media%';
```

Должны увидеть минимум 2 строки:
- одна для SELECT
- одна для INSERT

---

## Что делать если ничего не помогает

Напишите в поддержку Supabase или попробуйте:

1. Удалить bucket `media`
2. Создать заново через UI
3. При создании включить **Public bucket** ✅
4. После создания Supabase может автоматически создать базовые политики
