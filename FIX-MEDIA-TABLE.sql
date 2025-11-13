-- ════════════════════════════════════════════════════════════════
-- FIX MEDIA TABLE - Добавить недостающую колонку 'type'
-- ════════════════════════════════════════════════════════════════
-- Скопируйте и выполните в:
-- https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- ════════════════════════════════════════════════════════════════

-- Добавить колонку 'type' если её нет
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS type VARCHAR(50);

-- Заполнить 'type' на основе mime_type для существующих записей
UPDATE public.media
SET type = CASE
  WHEN mime_type LIKE 'image/%' THEN 'image'
  WHEN mime_type LIKE 'video/%' THEN 'video'
  WHEN mime_type LIKE 'audio/%' THEN 'audio'
  WHEN mime_type LIKE 'application/pdf' THEN 'document'
  ELSE 'file'
END
WHERE type IS NULL;

-- Создать индекс для быстрого поиска по типу
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(type);

-- Проверка
SELECT
  COUNT(*) as total_records,
  COUNT(type) as records_with_type,
  COUNT(DISTINCT type) as distinct_types
FROM public.media;

-- ════════════════════════════════════════════════════════════════
-- ГОТОВО! Теперь попробуйте загрузить изображение снова
-- ════════════════════════════════════════════════════════════════
