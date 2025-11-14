-- ============================================================================
-- Check Current User Authentication and Permissions
-- ============================================================================

-- 1. Check if you're logged in
SELECT
  auth.uid() as current_user_id,
  CASE
    WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN'
    ELSE '✅ LOGGED IN'
  END as auth_status;

-- 2. Check current user profile
SELECT
  id,
  email,
  name,
  role,
  roles,
  permissions
FROM public.profiles
WHERE id = auth.uid();

-- 3. Check if user has admin or editor role
SELECT
  CASE
    WHEN 'admin' = ANY(roles) THEN '✅ User is ADMIN'
    WHEN 'editor' = ANY(roles) THEN '✅ User is EDITOR'
    ELSE '❌ User is NOT admin or editor (role: ' || role || ')'
  END as permission_check
FROM public.profiles
WHERE id = auth.uid();

-- 4. Check all users in the system
SELECT
  email,
  role,
  roles,
  array_length(permissions, 1) as permission_count
FROM public.profiles
ORDER BY email;

-- 5. Grant admin permissions to your user (CHANGE EMAIL!)
-- Uncomment and change email to YOUR email:
/*
UPDATE public.profiles
SET
  role = 'admin',
  roles = ARRAY['admin', 'editor', 'moderator', 'member'],
  permissions = ARRAY[
    'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
    'media.view', 'media.upload', 'media.edit', 'media.delete',
    'events.view', 'events.create', 'events.edit', 'events.delete',
    'members.view', 'members.edit',
    'partners.view', 'partners.create', 'partners.edit', 'partners.delete',
    'settings.view', 'settings.edit',
    'analytics.view',
    'users.view', 'users.manage'
  ]
WHERE email = 'YOUR_EMAIL@example.com';  -- CHANGE THIS!
*/
