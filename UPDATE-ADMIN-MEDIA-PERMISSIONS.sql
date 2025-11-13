-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- UPDATE ADMIN PERMISSIONS - ADD MEDIA PERMISSIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- Этот скрипт добавляет права для работы с медиа админу
-- Выполните ПОСЛЕ создания таблицы media
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Обновить права админа - добавить все права для медиа
UPDATE public.profiles
SET permissions = ARRAY[
  -- Content permissions
  'content.view',
  'content.create',
  'content.edit',
  'content.delete',
  'content.publish',

  -- Media permissions (НОВЫЕ!)
  'media.view',
  'media.upload',
  'media.edit',
  'media.delete',

  -- Events permissions
  'events.view',
  'events.create',
  'events.edit',
  'events.delete',

  -- Members permissions
  'members.view',
  'members.edit',

  -- Partners permissions
  'partners.view',
  'partners.create',
  'partners.edit',
  'partners.delete',

  -- Settings permissions
  'settings.view',
  'settings.edit',

  -- Analytics and users
  'analytics.view',
  'users.view',
  'users.manage'
],
updated_at = NOW()
WHERE role = 'admin';

-- Проверка
SELECT
  email,
  role,
  CASE
    WHEN 'media.view' = ANY(permissions) THEN '✅'
    ELSE '❌'
  END as media_view,
  CASE
    WHEN 'media.upload' = ANY(permissions) THEN '✅'
    ELSE '❌'
  END as media_upload,
  CASE
    WHEN 'media.edit' = ANY(permissions) THEN '✅'
    ELSE '❌'
  END as media_edit,
  CASE
    WHEN 'media.delete' = ANY(permissions) THEN '✅'
    ELSE '❌'
  END as media_delete,
  array_length(permissions, 1) as total_permissions
FROM public.profiles
WHERE role = 'admin';

-- Должно показать все ✅
