-- ============================================================================
-- Add slug field to partners table
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Add slug column to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS partners_slug_idx ON public.partners(slug);

-- Generate slug for existing partners (if any)
UPDATE public.partners
SET slug = lower(regexp_replace(
  regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
  '\s+', '-', 'g'
))
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing records
ALTER TABLE public.partners
ALTER COLUMN slug SET NOT NULL;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check the table structure:
-- \d public.partners
-- Or:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'partners' AND table_schema = 'public';

-- Check existing partners:
-- SELECT id, name, slug FROM public.partners;

-- ============================================================================
-- DONE! Now you can create partners with slug field
-- ============================================================================
