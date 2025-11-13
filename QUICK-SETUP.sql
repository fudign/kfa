-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- БЫСТРАЯ НАСТРОЙКА - СКОПИРУЙТЕ И ВСТАВЬТЕ ЭТО В SUPABASE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- 1. Откройте: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- 2. Ctrl+A (выделить всё)
-- 3. Ctrl+C (скопировать)
-- 4. Вставить в SQL Editor
-- 5. Нажать Run
--
-- Займёт 30 секунд!
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 1. NEWS TABLE
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

CREATE POLICY "public_read" ON public.news FOR SELECT USING (status = 'published');
CREATE POLICY "auth_all" ON public.news FOR ALL TO authenticated USING (true);

-- 2. MEDIA TABLE
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

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_media" ON public.media FOR SELECT USING (true);
CREATE POLICY "auth_all_media" ON public.media FOR ALL TO authenticated USING (true);

-- 3. TEST DATA
INSERT INTO public.news (title, slug, content, excerpt, status, featured, category, published_at)
SELECT * FROM (VALUES
  ('Добро пожаловать', 'welcome', '<p>Тестовая новость</p>', 'Тест', 'published', true, 'Общее', NOW()),
  ('Инструкция', 'how-to', '<p>Как использовать</p>', 'Гайд', 'published', false, 'Помощь', NOW()),
  ('Черновик', 'draft', '<p>Черновик</p>', 'Драфт', 'draft', false, 'Разное', NULL)
) AS v(title, slug, content, excerpt, status, featured, category, published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.news LIMIT 1);

-- 4. GRANT
GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.media TO authenticated;
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.media TO anon;
GRANT USAGE ON SEQUENCE public.news_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.media_id_seq TO authenticated;

-- DONE! Теперь откройте https://kfa-website.vercel.app/dashboard/news
