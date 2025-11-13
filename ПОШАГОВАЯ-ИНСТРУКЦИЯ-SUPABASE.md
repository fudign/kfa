# 🔧 ПОШАГОВАЯ ИНСТРУКЦИЯ: Настройка доступа к новостям через Supabase

## Проблема

После логина в dashboard не видно раздела "Управление контентом" → "Новости"

## Решение через Supabase Dashboard

### ШАГ 1: Открыть Supabase SQL Editor

1. Перейди по ссылке:

   ```
   https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql
   ```

2. Должен открыться SQL Editor с возможностью выполнения запросов

---

### ШАГ 2: Проверить существующих пользователей

**Скопируй и выполни** (Ctrl+Enter):

```sql
-- Проверяем пользователей в auth.users
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY email;
```

**Должны увидеть:**

- Список всех зарегистрированных пользователей
- Их email адреса
- Даты создания

📝 **Запиши email администратора** (например: admin@kfa.kg)

---

### ШАГ 3: Проверить таблицу profiles

**Скопируй и выполни**:

```sql
-- Проверяем таблицу profiles
SELECT
  id,
  email,
  role,
  permissions
FROM public.profiles
ORDER BY email;
```

**Возможные результаты:**

✅ **Если таблица существует и есть записи:**

```
email           | role  | permissions
----------------|-------|-------------
admin@kfa.kg    | admin | NULL или []
```

❌ **Если таблица не существует:**

```
ERROR: relation "public.profiles" does not exist
```

→ Переходи к **ШАГ 4A**

⚠️ **Если таблица пустая:**

```
(0 rows)
```

→ Переходи к **ШАГ 4B**

---

### ШАГ 4A: Создать таблицу profiles (если не существует)

**Скопируй ВЕСЬ блок и выполни**:

```sql
-- Создаем таблицу profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  roles TEXT[] DEFAULT ARRAY['user'],
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут читать свой профиль
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Политика: пользователи могут обновлять свой профиль
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Создаем триггер для автоматического создания профиля
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, roles)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user',
    ARRAY['user']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Привязываем триггер к auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Создаем профили для существующих пользователей
INSERT INTO public.profiles (id, email, name, role, roles)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', email),
  'user',
  ARRAY['user']
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

**Проверка:**

```sql
SELECT * FROM public.profiles;
```

Должна появиться таблица с пользователями ✅

---

### ШАГ 4B: Синхронизировать profiles с auth.users (если таблица пустая)

**Скопируй и выполни**:

```sql
-- Создаем профили для всех пользователей из auth.users
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'user',
  ARRAY['user'],
  ARRAY[]::TEXT[]
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Проверяем результат
SELECT email, role, permissions FROM public.profiles;
```

---

### ШАГ 5: Добавить permissions администратору

**Скопируй и выполни** (замени `admin@kfa.kg` на свой email):

```sql
-- Обновляем роль и права администратора
UPDATE public.profiles
SET
  role = 'admin',
  roles = ARRAY['admin'],
  permissions = ARRAY[
    'content.view',
    'content.create',
    'content.edit',
    'content.delete',
    'content.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'media.delete',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'members.view',
    'members.edit',
    'partners.view',
    'partners.create',
    'partners.edit',
    'partners.delete',
    'settings.view',
    'settings.edit',
    'analytics.view',
    'users.view',
    'users.manage'
  ],
  updated_at = NOW()
WHERE email = 'admin@kfa.kg';  -- ← ЗАМЕНИ НА СВОЙ EMAIL!

-- Проверяем результат
SELECT
  email,
  role,
  array_length(permissions, 1) as permission_count,
  permissions[1:5] as first_5_permissions
FROM public.profiles
WHERE email = 'admin@kfa.kg';  -- ← ЗАМЕНИ НА СВОЙ EMAIL!
```

**Должно показать:**

```
email         | role  | permission_count | first_5_permissions
--------------|-------|------------------|--------------------
admin@kfa.kg  | admin | 24               | {content.view, content.create, ...}
```

✅ **Если видишь 24 permissions - всё готово!**

---

### ШАГ 6: ВАЖНО! Обновить токен авторизации

После обновления permissions в базе, нужно **перелогиниться**:

1. **Открой сайт**: https://kfa-website.vercel.app

2. **Если уже залогинен - выйди:**
   - Кликни на свой профиль в дашборде
   - Нажми "Выйти"

3. **Войди заново:**

   ```
   Email: admin@kfa.kg  (или твой email)
   Password: твой пароль
   ```

4. **Проверь дашборд:**
   - Открой /dashboard
   - В левом сайдбаре должен появиться раздел:
     ```
     УПРАВЛЕНИЕ КОНТЕНТОМ
     📰 Новости        ← Должно быть видно!
     📅 События
     👥 Участники
     🖼️ Медиафайлы
     ```

---

## Проверка в браузере

Открой консоль (F12) и выполни:

```javascript
// Проверяем сохраненный токен
const token = localStorage.getItem('auth_token');
console.log('Token exists:', !!token);

// Проверяем данные пользователя
const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
console.log('User:', authData.state?.user);
console.log('Permissions:', authData.state?.user?.permissions);
```

**Должно показать:**

```javascript
Token exists: true
User: {email: "admin@kfa.kg", role: "admin", permissions: Array(24), ...}
Permissions: ["content.view", "content.create", ...]
```

---

## Решение проблем

### ❌ "relation public.profiles does not exist"

**Решение:** Выполни **ШАГ 4A** полностью

### ❌ "No rows updated" при ШАГ 5

**Причина:** Неправильный email

**Решение:**

1. Проверь точный email:
   ```sql
   SELECT email FROM auth.users;
   ```
2. Скопируй email точно как есть
3. Повтори ШАГ 5 с правильным email

### ❌ Раздел "Управление контентом" не появился

**Причина:** Токен в браузере устаревший

**Решение:**

1. Очисти localStorage:
   ```javascript
   localStorage.clear();
   ```
2. Перезагрузи страницу (F5)
3. Войди заново

### ❌ Показывает "У вас нет доступа"

**Причина:** Permissions не применились к токену

**Решение:**

1. Проверь permissions в базе:
   ```sql
   SELECT email, permissions FROM public.profiles WHERE email = 'твой@email.com';
   ```
2. Если permissions есть (24 штуки) - значит проблема в токене
3. Выйди и войди заново (обязательно!)

---

## Быстрая проверка (всё в одном)

**Скопируй и выполни в Supabase SQL Editor:**

```sql
-- 1. Проверяем auth.users
SELECT '=== AUTH USERS ===' as step;
SELECT id, email, email_confirmed_at FROM auth.users;

-- 2. Проверяем profiles
SELECT '=== PROFILES ===' as step;
SELECT email, role, array_length(permissions, 1) as perm_count FROM public.profiles;

-- 3. Ищем админа
SELECT '=== ADMIN CHECK ===' as step;
SELECT
  email,
  role,
  CASE
    WHEN 'content.view' = ANY(permissions) THEN '✅ Has content.view'
    ELSE '❌ Missing content.view'
  END as status,
  array_length(permissions, 1) as total_permissions
FROM public.profiles
WHERE role = 'admin' OR email LIKE '%admin%';
```

**Если в последнем запросе видишь:**

```
✅ Has content.view | 24 permissions
```

→ **Permissions настроены правильно!** Осталось только перелогиниться.

**Если видишь:**

```
❌ Missing content.view | 0 permissions
```

→ **Выполни ШАГ 5** заново

---

## Альтернатива: Создать нового админа через UI

Если не можешь найти существующего админа:

1. **Открой Supabase Auth Users:**

   ```
   https://supabase.com/dashboard/project/eofneihisbhucxcydvac/auth/users
   ```

2. **Нажми "Add user"**

3. **Заполни форму:**

   ```
   Email: admin@kfa.kg
   Password: (твой надежный пароль)
   Auto Confirm User: ✅ YES
   ```

4. **Нажми "Create user"**

5. **Вернись в SQL Editor и выполни:**

   ```sql
   -- Сразу даем админу все права
   UPDATE public.profiles
   SET
     role = 'admin',
     roles = ARRAY['admin'],
     permissions = ARRAY[
       'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
       'media.view', 'media.upload', 'media.edit', 'media.delete',
       'events.view', 'events.create', 'events.edit', 'events.delete',
       'members.view', 'members.edit',
       'partners.view', 'partners.create', 'partners.edit', 'partners.delete',
       'settings.view', 'settings.edit',
       'analytics.view', 'users.view', 'users.manage'
     ]
   WHERE email = 'admin@kfa.kg';
   ```

6. **Войди на сайт** с новым admin@kfa.kg

---

## Что дальше?

После успешной настройки:

✅ Войди на https://kfa-website.vercel.app
✅ Открой /dashboard
✅ Кликни "Новости" в сайдбаре
✅ Нажми "Добавить новость"
✅ Создай первую тестовую новость!

---

## Файлы для быстрого доступа

Создал готовые SQL скрипты:

1. **CHECK-SUPABASE-AUTH.sql** - Проверка текущего состояния
2. **FIX-PERMISSIONS-IN-SUPABASE.sql** - Исправление permissions
3. **CREATE-ADMIN-USER-SUPABASE.sql** - Создание нового админа

Просто открой файл, скопируй содержимое и выполни в Supabase SQL Editor!

---

**Нужна помощь?** Покажи мне результат выполнения:

```sql
SELECT email, role, array_length(permissions, 1) FROM public.profiles;
```
