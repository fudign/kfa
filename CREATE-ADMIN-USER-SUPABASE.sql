-- ============================================
-- CREATE ADMIN USER IN SUPABASE (if not exists)
-- Execute this if no admin user exists
-- ============================================

-- Step 1: Check if admin user exists
SELECT
  email,
  role,
  permissions
FROM public.profiles
WHERE email LIKE '%admin%' OR role = 'admin';

-- Step 2: If no admin exists, we need to create via Supabase Auth UI first
-- Go to: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/auth/users
-- Click "Add user" and create:
--   Email: admin@kfa.kg
--   Password: (your secure password)
--   Email Confirm: YES

-- Step 3: After creating user in Supabase Auth UI, run this to add profile
-- Replace 'USER_ID_FROM_AUTH' with actual UUID from auth.users

-- First, get the user ID
SELECT id, email FROM auth.users WHERE email = 'admin@kfa.kg';

-- Then insert/update profile (replace <user-id> with actual ID)
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  roles,
  permissions,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'Administrator',
  'admin',
  ARRAY['admin'],
  ARRAY[
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
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@kfa.kg'
ON CONFLICT (id)
DO UPDATE SET
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
  updated_at = NOW();

-- Step 4: Verify the admin user
SELECT
  email,
  role,
  array_length(permissions, 1) as permission_count,
  permissions
FROM public.profiles
WHERE email = 'admin@kfa.kg';
