-- ============================================================================
-- Re-enable RLS for partners table
-- Run this AFTER testing with TEMP-DISABLE-RLS-PARTNERS.sql
-- ============================================================================

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ RLS ENABLED (security restored)'
    ELSE '❌ RLS STILL DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename = 'partners' AND schemaname = 'public';

-- Verify policies exist
SELECT
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ All policies in place'
    ELSE '⚠️ Missing policies'
  END as policy_status
FROM pg_policies
WHERE tablename = 'partners';

DO $$
BEGIN
  RAISE NOTICE '✅ RLS re-enabled for partners table';
  RAISE NOTICE '🔒 Table is now secure again';
END $$;
