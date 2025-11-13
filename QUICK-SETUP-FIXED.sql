-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ИСПРАВЛЕННАЯ БЫСТРАЯ НАСТРОЙКА
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- 1. Откройте: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- 2. Скопируйте ВСЁ (Ctrl+A, Ctrl+C)
-- 3. Вставьте в SQL Editor
-- 4. Нажмите Run
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ═══════════════════════════════════════════════════════════════
-- 1. NEWS TABLE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image VARCHAR(500),
  featured_image_id BIGINT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  author_id UUID,
  category VARCHAR(100),
  tags TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "public_read_news" ON public.news;
DROP POLICY IF EXISTS "auth_read_news" ON public.news;
DROP POLICY IF EXISTS "auth_insert_news" ON public.news;
DROP POLICY IF EXISTS "auth_update_news" ON public.news;
DROP POLICY IF EXISTS "auth_delete_news" ON public.news;

CREATE POLICY "public_read_news"
  ON public.news FOR SELECT
  USING (status = 'published');

CREATE POLICY "auth_read_news"
  ON public.news FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'content.view' = ANY(profiles.permissions)
    )
  );

CREATE POLICY "auth_insert_news"
  ON public.news FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'content.create' = ANY(profiles.permissions)
    )
  );

CREATE POLICY "auth_update_news"
  ON public.news FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'content.edit' = ANY(profiles.permissions)
    )
  );

CREATE POLICY "auth_delete_news"
  ON public.news FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'content.delete' = ANY(profiles.permissions)
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- 2. MEDIA TABLE
-- ═══════════════════════════════════════════════════════════════

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_collection ON public.media(collection);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "public_read_media" ON public.media;
DROP POLICY IF EXISTS "auth_insert_media" ON public.media;
DROP POLICY IF EXISTS "auth_update_media" ON public.media;
DROP POLICY IF EXISTS "auth_delete_media" ON public.media;

CREATE POLICY "public_read_media"
  ON public.media FOR SELECT
  USING (true);

CREATE POLICY "auth_insert_media"
  ON public.media FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.upload' = ANY(profiles.permissions)
    )
  );

CREATE POLICY "auth_update_media"
  ON public.media FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.edit' = ANY(profiles.permissions)
    )
  );

CREATE POLICY "auth_delete_media"
  ON public.media FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.delete' = ANY(profiles.permissions)
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- 3. GRANTS
-- ═══════════════════════════════════════════════════════════════

GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.media TO authenticated;
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.media TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.news_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.media_id_seq TO authenticated;

-- ═══════════════════════════════════════════════════════════════
-- 4. TEST DATA (only if news table is empty)
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;

  -- Insert test data only if table is empty
  IF NOT EXISTS (SELECT 1 FROM public.news LIMIT 1) THEN
    INSERT INTO public.news (title, slug, content, excerpt, status, featured, author_id, category, published_at)
    VALUES
      (
        'Добро пожаловать в систему управления новостями',
        'welcome-to-news-system',
        '<h2>Добро пожаловать!</h2><p>Это тестовая новость для проверки работы CMS системы управления контентом.</p><p><strong>Вы можете:</strong></p><ul><li>Создавать новые новости</li><li>Редактировать существующие</li><li>Публиковать и снимать с публикации</li><li>Загружать изображения</li></ul>',
        'Тестовая новость для проверки работы системы',
        'published',
        true,
        admin_id,
        'Общее',
        NOW()
      ),
      (
        'Как работать с редактором новостей',
        'how-to-use-news-editor',
        '<h2>Руководство по редактору</h2><p>Редактор новостей поддерживает:</p><ol><li><strong>Форматирование текста</strong> - жирный, курсив, подчеркивание</li><li><strong>Заголовки</strong> - разных уровней</li><li><strong>Списки</strong> - нумерованные и маркированные</li><li><strong>Изображения</strong> - загрузка и вставка</li></ol>',
        'Полное руководство по работе с редактором новостей',
        'published',
        false,
        admin_id,
        'Инструкции',
        NOW()
      ),
      (
        'Черновик новости для тестирования',
        'draft-news-example',
        '<p>Это пример черновика новости.</p><p>Черновики не отображаются на публичной странице до момента публикации.</p>',
        'Пример черновика новости',
        'draft',
        false,
        admin_id,
        'Разное',
        NULL
      );

    RAISE NOTICE 'Test news added successfully';
  ELSE
    RAISE NOTICE 'News table already has data, skipping test data';
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════════════════

SELECT 'NEWS TABLE' as check_name, COUNT(*)::text || ' records' as result FROM public.news
UNION ALL
SELECT 'MEDIA TABLE' as check_name, COUNT(*)::text || ' records' as result FROM public.media
UNION ALL
SELECT 'ADMIN PERMISSIONS' as check_name,
  CASE
    WHEN 'content.view' = ANY(permissions) AND 'media.upload' = ANY(permissions)
    THEN '✅ OK'
    ELSE '❌ MISSING'
  END as result
FROM public.profiles WHERE role = 'admin' LIMIT 1;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ГОТОВО!
-- Теперь:
-- 1. Откройте https://kfa-website.vercel.app/dashboard/news
-- 2. Выйдите и войдите снова
-- 3. Вы увидите 3 тестовые новости
-- 4. Можете создавать новости с изображениями
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
