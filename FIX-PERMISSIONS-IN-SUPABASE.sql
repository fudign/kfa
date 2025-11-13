-- ============================================
-- FIX ADMIN PERMISSIONS IN SUPABASE
-- Execute this in Supabase SQL Editor
-- ============================================

-- Step 1: Check if profiles table exists and view current state
SELECT
  id,
  email,
  role,
  roles,
  permissions
FROM public.profiles
ORDER BY email;

-- Step 2: Define permissions for each role
-- We'll use CASE to assign permissions based on role

-- Update admin users with full permissions
UPDATE public.profiles
SET
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
WHERE role = 'admin';

-- Update editor users
UPDATE public.profiles
SET
  permissions = ARRAY[
    'content.view',
    'content.create',
    'content.edit',
    'content.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'events.view',
    'events.create',
    'events.edit'
  ],
  updated_at = NOW()
WHERE role = 'editor';

-- Update moderator users
UPDATE public.profiles
SET
  permissions = ARRAY[
    'content.view',
    'content.edit',
    'media.view',
    'events.view',
    'members.view'
  ],
  updated_at = NOW()
WHERE role = 'moderator';

-- Update member users
UPDATE public.profiles
SET
  permissions = ARRAY[
    'content.view'
  ],
  updated_at = NOW()
WHERE role = 'member';

-- Step 3: Verify the updates
SELECT
  email,
  role,
  array_length(permissions, 1) as permission_count,
  permissions
FROM public.profiles
ORDER BY email;

-- Step 4: Show summary
SELECT
  role,
  COUNT(*) as user_count,
  array_length(permissions, 1) as permissions_per_role
FROM public.profiles
GROUP BY role, permissions
ORDER BY role;
