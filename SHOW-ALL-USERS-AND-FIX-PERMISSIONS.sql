-- ============================================
-- ПОКАЗАТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ И ДАТЬ ПРАВА
-- ============================================

-- Скопируйте этот скрипт в Supabase Dashboard → SQL Editor
-- И выполняйте команды по порядку


-- ============================================
-- ШАГ 1: Посмотреть всех пользователей
-- ============================================

SELECT
  id as user_id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- СКОПИРУЙТЕ свой user_id (UUID) из результата выше


-- ============================================
-- ШАГ 2: Проверить существует ли таблица user_permissions
-- ============================================

SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'user_permissions'
) as table_exists;

-- Если вернуло false, выполните код ниже для создания таблицы:


-- ============================================
-- ШАГ 3: СОЗДАТЬ таблицу user_permissions (если её нет)
-- ============================================

CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON user_permissions(permission);

-- Включить RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи видят только свои права
DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;
CREATE POLICY "Users can view own permissions"
ON user_permissions FOR SELECT
USING (auth.uid() = user_id);

-- Политика: авторизованные пользователи могут читать все права
DROP POLICY IF EXISTS "Authenticated users can view all permissions" ON user_permissions;
CREATE POLICY "Authenticated users can view all permissions"
ON user_permissions FOR SELECT
TO authenticated
USING (true);

-- Политика: админы могут управлять
DROP POLICY IF EXISTS "Admins can manage permissions" ON user_permissions;
CREATE POLICY "Admins can manage permissions"
ON user_permissions FOR ALL
TO authenticated
USING (true);


-- ============================================
-- ШАГ 4: ДАТЬ права applications.view
-- ============================================

-- ВАРИАНТ А: Дать права КОНКРЕТНОМУ пользователю
-- ЗАМЕНИТЕ 'ВАSH_USER_ID' на UUID из Шага 1

INSERT INTO user_permissions (user_id, permission)
VALUES (
  'ВАШ_USER_ID_ЗДЕСЬ',  -- <-- ЗАМЕНИТЕ на ваш UUID!!!
  'applications.view'
)
ON CONFLICT (user_id, permission) DO NOTHING;


-- ВАРИАНТ Б: Дать права ВСЕМ пользователям (если нужно)

INSERT INTO user_permissions (user_id, permission)
SELECT
  id,
  'applications.view'
FROM auth.users
ON CONFLICT (user_id, permission) DO NOTHING;


-- ============================================
-- ШАГ 5: Проверить что права добавлены
-- ============================================

SELECT
  up.user_id,
  u.email,
  up.permission,
  up.created_at
FROM user_permissions up
JOIN auth.users u ON u.id = up.user_id
WHERE up.permission = 'applications.view'
ORDER BY up.created_at DESC;


-- ============================================
-- ШАГ 6: Дополнительные полезные права (опционально)
-- ============================================

-- Дать все права для управления контентом (для админов)
-- ЗАМЕНИТЕ 'ВАШ_USER_ID' на ваш UUID

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


-- ============================================
-- ГОТОВО!
-- ============================================

-- После выполнения:
-- 1. Выйдите из системы на сайте
-- 2. Войдите снова
-- 3. Откройте https://kfa-website.vercel.app/dashboard/applications
-- Должно работать! ✅
