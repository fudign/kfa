-- ============================================================================
-- Supabase News Table for KFA Project
-- ============================================================================
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql
-- This mirrors the Laravel news table schema for direct Supabase access

-- ============================================================================
-- 1. Create news table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'submitted', 'pending', 'approved', 'rejected', 'published', 'unpublished', 'archived')),
  featured BOOLEAN DEFAULT false,
  category TEXT,
  featured_image_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS news_slug_idx ON public.news(slug);
CREATE INDEX IF NOT EXISTS news_status_idx ON public.news(status);
CREATE INDEX IF NOT EXISTS news_featured_idx ON public.news(featured);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON public.news(published_at);
CREATE INDEX IF NOT EXISTS news_author_id_idx ON public.news(author_id);

-- ============================================================================
-- 2. Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. RLS Policies for news table
-- ============================================================================

-- Policy: Anyone can view published news
CREATE POLICY "Public news are viewable by everyone"
  ON public.news FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Policy: Authenticated users with content.create can insert
CREATE POLICY "Users with content.create can insert news"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.create' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

-- Policy: Authenticated users with content.edit can update
CREATE POLICY "Users with content.edit can update news"
  ON public.news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.edit' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.edit' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

-- Policy: Authenticated users with content.delete can delete
CREATE POLICY "Users with content.delete can delete news"
  ON public.news FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.delete' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

-- ============================================================================
-- 4. Function to update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. Trigger to update updated_at on news changes
-- ============================================================================
DROP TRIGGER IF EXISTS on_news_updated ON public.news;

CREATE TRIGGER on_news_updated
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_news_updated_at();

-- ============================================================================
-- 6. Seed some sample news (optional)
-- ============================================================================
INSERT INTO public.news (title, slug, content, excerpt, image, status, featured, category, published_at)
VALUES
  (
    'Добро пожаловать в КФА',
    'dobro-pozhalovat-v-kfa',
    'Кыргызский Финансовый Альянс рад приветствовать вас! Мы являемся саморегулируемой организацией профессиональных участников рынка ценных бумаг Кыргызской Республики.',
    'Кыргызский Финансовый Альянс - профессиональное объединение участников рынка ценных бумаг.',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    'published',
    true,
    'regulation',
    NOW()
  ),
  (
    'Новые стандарты профессиональной деятельности',
    'novye-standarty-professionalnoj-deyatelnosti',
    'КФА объявляет о внедрении новых стандартов профессиональной деятельности для участников рынка ценных бумаг.',
    'Внедрение новых стандартов для повышения качества услуг на рынке.',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    'published',
    true,
    'events',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Аналитический отчет: Рынок ценных бумаг Кыргызстана в 2025',
    'analiticheskij-otchet-rynok-cennyh-bumag-kyrgyzstana-2025',
    'Представляем вашему вниманию комплексный анализ состояния и перспектив развития рынка ценных бумаг Кыргызской Республики.',
    'Комплексный анализ рынка ценных бумаг за 2025 год.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'published',
    false,
    'analytics',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check if news table exists:
-- SELECT * FROM public.news;

-- Check RLS policies:
-- SELECT * FROM pg_policies WHERE tablename = 'news';

-- Get all published news:
-- SELECT id, title, status, featured, published_at FROM public.news WHERE status = 'published' ORDER BY published_at DESC;

-- Count news by status:
-- SELECT status, COUNT(*) FROM public.news GROUP BY status;
