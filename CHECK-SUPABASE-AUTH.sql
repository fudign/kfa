-- ============================================
-- CHECK SUPABASE AUTH USERS
-- Execute this first to see what users exist
-- ============================================

-- Step 1: Check auth.users table (Supabase Auth)
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY email;

-- Step 2: Check profiles table (if exists)
SELECT
  id,
  email,
  name,
  role,
  roles,
  permissions,
  created_at
FROM public.profiles
ORDER BY email;

-- Step 3: Check if profiles are linked to auth.users
SELECT
  a.email as auth_email,
  p.email as profile_email,
  p.role,
  p.permissions,
  CASE
    WHEN p.id IS NULL THEN '❌ No profile'
    WHEN p.permissions IS NULL THEN '⚠️ No permissions'
    WHEN array_length(p.permissions, 1) = 0 THEN '⚠️ Empty permissions'
    ELSE '✅ Has permissions'
  END as status
FROM auth.users a
LEFT JOIN public.profiles p ON a.id = p.id
ORDER BY a.email;

-- Step 4: Find admin users without permissions
SELECT
  email,
  role,
  permissions,
  'Missing permissions!' as issue
FROM public.profiles
WHERE role = 'admin'
  AND (permissions IS NULL OR array_length(permissions, 1) = 0 OR NOT 'content.view' = ANY(permissions));
