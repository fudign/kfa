-- ============================================================================
-- TEMPORARY: Disable RLS for partners table (FOR TESTING ONLY!)
-- This will allow anyone to create partners
-- USE THIS ONLY TO TEST IF THE PROBLEM IS RLS-RELATED
-- ============================================================================

-- WARNING: This makes the table PUBLIC for writes!
-- After testing, run ENABLE-RLS-PARTNERS.sql to re-enable security

-- Disable RLS temporarily
ALTER TABLE public.partners DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '⚠️ RLS STILL ENABLED'
    ELSE '✅ RLS DISABLED (table is now PUBLIC)'
  END as rls_status
FROM pg_tables
WHERE tablename = 'partners' AND schemaname = 'public';

-- Instructions
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️';
  RAISE NOTICE 'RLS is now DISABLED for partners table';
  RAISE NOTICE 'Anyone can create/edit/delete partners!';
  RAISE NOTICE '';
  RAISE NOTICE '👉 Try creating a partner in your app now';
  RAISE NOTICE '';
  RAISE NOTICE 'If it works, the problem is RLS permissions';
  RAISE NOTICE 'If it still fails, the problem is elsewhere';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ REMEMBER TO RE-ENABLE RLS AFTER TESTING!';
  RAISE NOTICE 'Run: ENABLE-RLS-PARTNERS.sql';
END $$;
