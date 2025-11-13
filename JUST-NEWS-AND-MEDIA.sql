-- ════════════════════════════════════════════════════════════════
-- ТОЛЬКО НОВОСТИ И МЕДИА - НИЧЕГО ЛИШНЕГО
-- ════════════════════════════════════════════════════════════════
-- Скопируйте ВСЁ и запустите в:
-- https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- ════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. NEWS TABLE
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image VARCHAR(500),
  featured_image_id BIGINT,
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  author_id UUID,
  category VARCHAR(100),
  tags TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_public_read" ON public.news;
DROP POLICY IF EXISTS "news_auth_all" ON public.news;

CREATE POLICY "news_public_read" ON public.news FOR SELECT USING (status = 'published');
CREATE POLICY "news_auth_all" ON public.news FOR ALL TO authenticated USING (true);

GRANT ALL ON public.news TO authenticated;
GRANT SELECT ON public.news TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.news_id_seq TO authenticated;

-- ─────────────────────────────────────────────────────────────────
-- 2. MEDIA TABLE
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.media (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(255),
  description TEXT,
  collection VARCHAR(100),
  uploader_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_public_read" ON public.media;
DROP POLICY IF EXISTS "media_auth_all" ON public.media;

CREATE POLICY "media_public_read" ON public.media FOR SELECT USING (true);
CREATE POLICY "media_auth_all" ON public.media FOR ALL TO authenticated USING (true);

GRANT ALL ON public.media TO authenticated;
GRANT SELECT ON public.media TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.media_id_seq TO authenticated;

-- ─────────────────────────────────────────────────────────────────
-- 3. TEST DATA
-- ─────────────────────────────────────────────────────────────────

INSERT INTO public.news (title, slug, content, excerpt, status, featured, category, published_at)
SELECT * FROM (VALUES
  ('Тестовая новость 1', 'test-1', '<p>Содержимое новости 1</p>', 'Тест 1', 'published', true, 'Общее', NOW()),
  ('Тестовая новость 2', 'test-2', '<p>Содержимое новости 2</p>', 'Тест 2', 'published', false, 'Общее', NOW()),
  ('Черновик', 'draft-1', '<p>Черновик</p>', 'Драфт', 'draft', false, 'Разное', NULL)
) AS v(title, slug, content, excerpt, status, featured, category, published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.news LIMIT 1);

-- ─────────────────────────────────────────────────────────────────
-- ПРОВЕРКА
-- ─────────────────────────────────────────────────────────────────

SELECT COUNT(*) as news_count FROM public.news;
SELECT COUNT(*) as media_count FROM public.media;

-- ════════════════════════════════════════════════════════════════
-- ГОТОВО! Теперь откройте:
-- https://kfa-website.vercel.app/dashboard/news
-- (выйдите и войдите снова)
-- ════════════════════════════════════════════════════════════════
