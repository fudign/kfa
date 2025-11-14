-- Дать права на просмотр заявок пользователю
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- ========================================
-- ШАГ 1: Найти ваш user_id
-- ========================================

-- Вариант A: Если знаете свой email
SELECT
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'ваш_email@example.com';  -- ЗАМЕНИТЕ на ваш реальный email

-- Вариант B: Посмотреть всех пользователей
SELECT
  id as user_id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- СКОПИРУЙТЕ user_id из результата выше
-- Это UUID вида: 12345678-1234-1234-1234-123456789abc


-- ========================================
-- ШАГ 2: Дать права applications.view
-- ========================================

-- ЗАМЕНИТЕ 'ВАSH_USER_ID_ЗДЕСЬ' на реальный UUID из Шага 1
INSERT INTO user_permissions (user_id, permission, created_at)
VALUES (
  'ВАШ_USER_ID_ЗДЕСЬ',  -- ЗАМЕНИТЕ!!!
  'applications.view',
  NOW()
)
ON CONFLICT (user_id, permission) DO NOTHING;


-- ========================================
-- ШАГ 3: Проверить что права добавлены
-- ========================================

SELECT
  up.user_id,
  u.email,
  up.permission,
  up.created_at
FROM user_permissions up
JOIN auth.users u ON u.id = up.user_id
WHERE up.permission = 'applications.view';


-- ========================================
-- ГОТОВО!
-- ========================================

-- После выполнения:
-- 1. Выйдите из системы
-- 2. Войдите снова
-- 3. Откройте /dashboard/applications
-- Должно работать! ✅


-- ========================================
-- ЕСЛИ ТАБЛИЦЫ user_permissions НЕТ
-- ========================================

-- Проверить есть ли таблица:
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'user_permissions'
);

-- Если вернуло false, создайте таблицу:
CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id
ON user_permissions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_permission
ON user_permissions(permission);

-- RLS политики
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои права
CREATE POLICY "Users can view own permissions"
ON user_permissions FOR SELECT
USING (auth.uid() = user_id);

-- Только админы могут управлять правами
CREATE POLICY "Admins can manage permissions"
ON user_permissions FOR ALL
TO authenticated
USING (true);


-- ========================================
-- АЛЬТЕРНАТИВА: Дать права ВСЕМ админам
-- ========================================

-- Если хотите дать права всем пользователям с ролью admin:
INSERT INTO user_permissions (user_id, permission)
SELECT
  ur.user_id,
  'applications.view'
FROM user_roles ur
WHERE ur.role = 'admin'
ON CONFLICT (user_id, permission) DO NOTHING;
