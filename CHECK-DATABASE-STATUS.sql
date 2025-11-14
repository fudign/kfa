-- ============================================================================
-- Quick Database Status Check
-- Run this to see current state of partners table
-- ============================================================================

-- Check if partners table exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'partners' AND table_schema = 'public'
    ) THEN '✅ Table EXISTS'
    ELSE '❌ Table DOES NOT EXIST'
  END as table_status;

-- Check if slug column exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'partners'
        AND table_schema = 'public'
        AND column_name = 'slug'
    ) THEN '✅ Slug column EXISTS'
    ELSE '❌ Slug column MISSING'
  END as slug_status;

-- Show all columns in partners table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'partners'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'partners'
  AND schemaname = 'public';

-- Count existing partners
SELECT COUNT(*) as partner_count FROM public.partners;

-- Show RLS status
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename = 'partners' AND schemaname = 'public';

-- Show RLS policies
SELECT
  policyname,
  cmd as command,
  permissive,
  roles
FROM pg_policies
WHERE tablename = 'partners';
