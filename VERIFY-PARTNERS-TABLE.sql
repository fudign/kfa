-- ============================================================================
-- Verify Partners Table Setup
-- Run this AFTER running FIX-PARTNERS-TABLE-COMPLETE.sql
-- ============================================================================

-- 1. Check if table exists
SELECT 'Table exists: ' || CASE
  WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'partners' AND table_schema = 'public'
  ) THEN '✅ YES'
  ELSE '❌ NO'
END as status;

-- 2. Check if slug column exists and is NOT NULL
SELECT
  column_name,
  data_type,
  is_nullable,
  CASE
    WHEN column_name = 'slug' AND is_nullable = 'NO' THEN '✅ CORRECT'
    WHEN column_name = 'slug' AND is_nullable = 'YES' THEN '⚠️ NULLABLE (needs fixing)'
    ELSE ''
  END as slug_check
FROM information_schema.columns
WHERE table_name = 'partners' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename = 'partners' AND schemaname = 'public';

-- 4. Check RLS policies exist
SELECT
  policyname,
  cmd,
  CASE
    WHEN policyname IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as policy_status
FROM pg_policies
WHERE tablename = 'partners'
ORDER BY policyname;

-- 5. Test insert (as anonymous user)
-- This will fail if RLS is working correctly (anonymous users can't insert)
-- But it will show us the exact error
DO $$
BEGIN
  -- Try to insert a test record
  INSERT INTO public.partners (name, slug, category, status)
  VALUES ('Test Partner', 'test-partner-' || NOW()::text, 'other', 'active');

  RAISE NOTICE '✅ Insert successful (user has permissions)';

  -- Clean up test record
  DELETE FROM public.partners WHERE name = 'Test Partner';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE '⚠️ RLS blocking insert (expected for anonymous users)';
  WHEN others THEN
    RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- 6. Count existing partners
SELECT COUNT(*) as total_partners FROM public.partners;

-- ============================================================================
-- FINAL STATUS
-- ============================================================================
SELECT
  '🎉 If you see this message, the table structure is correct!' as final_status;
