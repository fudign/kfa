# Как исправить ошибку 403 - Доступ запрещен

## Проблема
При открытии `/dashboard/applications` видите:
```
403 Доступ запрещен
У вас недостаточно прав для доступа к этой странице
```

## Причина
У вашего пользователя нет права `applications.view`

---

## ✅ Решение (2 минуты)

### Шаг 1: Открыть Supabase SQL Editor

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект KFA
3. Слева в меню: **SQL Editor**
4. Нажмите **New query**

### Шаг 2: Выполнить скрипт

Скопируйте и выполните файл:
**`SHOW-ALL-USERS-AND-FIX-PERMISSIONS.sql`**

Или скопируйте код ниже:

```sql
-- 1. Показать всех пользователей
SELECT
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

**Нажмите RUN** ▶️

**Скопируйте свой `user_id`** из результата (это UUID вида: 12345678-1234-1234-1234-123456789abc)

---

### Шаг 3: Дать права

Выполните следующий SQL (замените `ВАШ_USER_ID` на скопированный UUID):

```sql
-- Создать таблицу если её нет
CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- Включить RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Политика для чтения
CREATE POLICY IF NOT EXISTS "Authenticated users can view all permissions"
ON user_permissions FOR SELECT
TO authenticated
USING (true);

-- Дать права (ЗАМЕНИТЕ ВАШ_USER_ID!!!)
INSERT INTO user_permissions (user_id, permission)
VALUES (
  'ВАШ_USER_ID_ЗДЕСЬ',  -- <-- ВСТАВЬТЕ свой UUID
  'applications.view'
)
ON CONFLICT (user_id, permission) DO NOTHING;
```

**Нажмите RUN** ▶️

---

### Шаг 4: Проверить

```sql
-- Посмотреть кому дали права
SELECT
  up.user_id,
  u.email,
  up.permission
FROM user_permissions up
JOIN auth.users u ON u.id = up.user_id
WHERE up.permission = 'applications.view';
```

Должны увидеть свой email в списке! ✅

---

### Шаг 5: Обновить страницу

1. Выйдите из системы на сайте
2. Войдите снова
3. Откройте https://kfa-website.vercel.app/dashboard/applications
4. Должно работать! 🎉

---

## 🚀 Быстрый вариант: Дать права ВСЕМ пользователям

Если хотите дать права всем пользователям сразу:

```sql
INSERT INTO user_permissions (user_id, permission)
SELECT
  id,
  'applications.view'
FROM auth.users
ON CONFLICT (user_id, permission) DO NOTHING;
```

---

## 💡 Дополнительные права (опционально)

Чтобы дать полные права админа:

```sql
-- ЗАМЕНИТЕ ВАШ_USER_ID
INSERT INTO user_permissions (user_id, permission)
VALUES
  ('ВАШ_USER_ID', 'applications.view'),
  ('ВАШ_USER_ID', 'applications.manage'),
  ('ВАШ_USER_ID', 'content.view'),
  ('ВАШ_USER_ID', 'content.manage'),
  ('ВАШ_USER_ID', 'events.view'),
  ('ВАШ_USER_ID', 'events.manage'),
  ('ВАШ_USER_ID', 'members.view'),
  ('ВАШ_USER_ID', 'members.manage'),
  ('ВАШ_USER_ID', 'media.view'),
  ('ВАШ_USER_ID', 'media.manage'),
  ('ВАШ_USER_ID', 'partners.view'),
  ('ВАШ_USER_ID', 'partners.manage'),
  ('ВАШ_USER_ID', 'settings.view'),
  ('ВАШ_USER_ID', 'settings.manage')
ON CONFLICT (user_id, permission) DO NOTHING;
```

---

## ✅ Готово!

После этого вы сможете:
- ✅ Просматривать заявки на `/dashboard/applications`
- ✅ Одобрять/отклонять заявки
- ✅ Видеть статистику
- ✅ Использовать поиск и фильтры

---

**Нужна помощь?** Напишите сообщение с ошибкой.
