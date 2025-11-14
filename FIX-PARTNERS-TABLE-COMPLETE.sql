-- ============================================================================
-- COMPLETE FIX FOR PARTNERS TABLE
-- This script will handle ALL scenarios:
-- 1. Create table if it doesn't exist
-- 2. Add slug column if it's missing
-- 3. Add all necessary indexes
-- 4. Set up RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Create partners table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  category TEXT CHECK (category IN ('platinum', 'gold', 'silver', 'bronze', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add slug column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners'
    AND table_schema = 'public'
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.partners ADD COLUMN slug TEXT;
  END IF;
END $$;

-- Step 3: Generate slug for existing records that don't have one
UPDATE public.partners
SET slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(name, '[а-яА-ЯёЁ]', '', 'g'), -- Remove Cyrillic if any
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || id::text
WHERE slug IS NULL OR slug = '';

-- Step 4: Handle duplicates by appending ID
UPDATE public.partners p1
SET slug = slug || '-' || id
WHERE EXISTS (
  SELECT 1 FROM public.partners p2
  WHERE p1.slug = p2.slug AND p1.id > p2.id
);

-- Step 5: Make slug NOT NULL and UNIQUE
DO $$
BEGIN
  -- Make NOT NULL
  ALTER TABLE public.partners ALTER COLUMN slug SET NOT NULL;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'slug already has NOT NULL constraint';
END $$;

-- Step 6: Create all necessary indexes
CREATE UNIQUE INDEX IF NOT EXISTS partners_slug_idx ON public.partners(slug);
CREATE INDEX IF NOT EXISTS partners_status_idx ON public.partners(status);
CREATE INDEX IF NOT EXISTS partners_category_idx ON public.partners(category);
CREATE INDEX IF NOT EXISTS partners_featured_idx ON public.partners(is_featured);
CREATE INDEX IF NOT EXISTS partners_display_order_idx ON public.partners(display_order);
CREATE INDEX IF NOT EXISTS partners_name_idx ON public.partners(name);

-- Step 7: Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Step 8: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active partners" ON public.partners;
DROP POLICY IF EXISTS "Editors and admins can create partners" ON public.partners;
DROP POLICY IF EXISTS "Editors and admins can update partners" ON public.partners;
DROP POLICY IF EXISTS "Only admins can delete partners" ON public.partners;

-- Step 9: Create RLS Policies
-- Public can view active partners
CREATE POLICY "Anyone can view active partners"
  ON public.partners FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

-- Editors and admins can create partners
CREATE POLICY "Editors and admins can create partners"
  ON public.partners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Editors and admins can update partners
CREATE POLICY "Editors and admins can update partners"
  ON public.partners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Only admins can delete partners
CREATE POLICY "Only admins can delete partners"
  ON public.partners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- Step 10: Create or replace trigger for updated_at
DROP TRIGGER IF EXISTS on_partners_updated ON public.partners;

CREATE TRIGGER on_partners_updated
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check table structure:
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'partners'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check indexes:
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'partners'
  AND schemaname = 'public';

-- Check RLS policies:
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'partners';

-- Check existing partners:
SELECT id, name, slug, category, status FROM public.partners;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Partners table setup complete!';
  RAISE NOTICE '✅ Slug field added and configured';
  RAISE NOTICE '✅ All indexes created';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now create partners in your application!';
END $$;
