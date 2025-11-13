-- ════════════════════════════════════════════════════════════════
-- ПРОВЕРКА ОПУБЛИКОВАННЫХ НОВОСТЕЙ
-- ════════════════════════════════════════════════════════════════
-- Скопируйте и выполните в Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════

-- Показать все новости с их статусами
SELECT
  id,
  title,
  slug,
  status,
  featured,
  image,
  published_at,
  created_at
FROM public.news
ORDER BY created_at DESC;

-- Показать только опубликованные новости
SELECT
  id,
  title,
  slug,
  status,
  featured,
  published_at
FROM public.news
WHERE status = 'published'
ORDER BY published_at DESC;

-- Статистика по статусам
SELECT
  status,
  COUNT(*) as count
FROM public.news
GROUP BY status;

-- ════════════════════════════════════════════════════════════════
-- ЕСЛИ НОВОСТИ ЕСТЬ, НО НЕ ОПУБЛИКОВАНЫ - ОПУБЛИКУЙТЕ ИХ:
-- ════════════════════════════════════════════════════════════════

UPDATE public.news
SET
  status = 'published',
  published_at = NOW()
WHERE status = 'draft'
AND published_at IS NULL;

-- После этого снова проверьте опубликованные новости:
SELECT id, title, status, published_at
FROM public.news
WHERE status = 'published';
