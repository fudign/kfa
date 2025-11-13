-- ════════════════════════════════════════════════════════════════
-- ПОЛНОЕ ИСПРАВЛЕНИЕ ТАБЛИЦЫ MEDIA
-- ════════════════════════════════════════════════════════════════
-- Скопируйте ВСЁ и выполните в:
-- https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- ════════════════════════════════════════════════════════════════

-- Добавить недостающие колонки
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS type VARCHAR(50),
ADD COLUMN IF NOT EXISTS disk VARCHAR(50) DEFAULT 'supabase',
ADD COLUMN IF NOT EXISTS human_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS is_image BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pdf BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_document BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS uploaded_by INTEGER,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Переименовать uploader_id в uploaded_by если нужно
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'media'
    AND column_name = 'uploader_id'
    AND table_schema = 'public'
  ) THEN
    -- Копируем данные из uploader_id в uploaded_by
    UPDATE public.media SET uploaded_by = uploader_id::text::integer WHERE uploaded_by IS NULL;
  END IF;
END $$;

-- Заполнить type на основе mime_type
UPDATE public.media
SET type = CASE
  WHEN mime_type LIKE 'image/%' THEN 'image'
  WHEN mime_type LIKE 'video/%' THEN 'video'
  WHEN mime_type LIKE 'audio/%' THEN 'audio'
  WHEN mime_type LIKE 'application/pdf' THEN 'document'
  ELSE 'file'
END
WHERE type IS NULL;

-- Заполнить human_size
UPDATE public.media
SET human_size = CASE
  WHEN size < 1024 THEN size || ' B'
  WHEN size < 1048576 THEN ROUND(size::numeric / 1024, 2) || ' KB'
  WHEN size < 1073741824 THEN ROUND(size::numeric / 1048576, 2) || ' MB'
  ELSE ROUND(size::numeric / 1073741824, 2) || ' GB'
END
WHERE human_size IS NULL;

-- Заполнить is_image, is_pdf, is_document
UPDATE public.media
SET
  is_image = (mime_type LIKE 'image/%'),
  is_pdf = (mime_type = 'application/pdf'),
  is_document = (mime_type LIKE 'application/%')
WHERE is_image = false AND is_pdf = false AND is_document = false;

-- Заполнить metadata
UPDATE public.media
SET metadata = jsonb_build_object(
  'collection', collection,
  'alt_text', alt_text,
  'description', description
)
WHERE metadata IS NULL;

-- Создать индексы
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(type);
CREATE INDEX IF NOT EXISTS idx_media_disk ON public.media(disk);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_is_image ON public.media(is_image);

-- Создать функцию для автоматического обновления полей при INSERT
CREATE OR REPLACE FUNCTION update_media_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Автоматически определяем type
  IF NEW.type IS NULL THEN
    NEW.type := CASE
      WHEN NEW.mime_type LIKE 'image/%' THEN 'image'
      WHEN NEW.mime_type LIKE 'video/%' THEN 'video'
      WHEN NEW.mime_type LIKE 'audio/%' THEN 'audio'
      WHEN NEW.mime_type LIKE 'application/pdf' THEN 'document'
      ELSE 'file'
    END;
  END IF;

  -- Автоматически определяем human_size
  IF NEW.human_size IS NULL THEN
    NEW.human_size := CASE
      WHEN NEW.size < 1024 THEN NEW.size || ' B'
      WHEN NEW.size < 1048576 THEN ROUND(NEW.size::numeric / 1024, 2) || ' KB'
      WHEN NEW.size < 1073741824 THEN ROUND(NEW.size::numeric / 1048576, 2) || ' MB'
      ELSE ROUND(NEW.size::numeric / 1073741824, 2) || ' GB'
    END;
  END IF;

  -- Автоматически определяем is_image, is_pdf, is_document
  NEW.is_image := (NEW.mime_type LIKE 'image/%');
  NEW.is_pdf := (NEW.mime_type = 'application/pdf');
  NEW.is_document := (NEW.mime_type LIKE 'application/%');

  -- Устанавливаем disk по умолчанию
  IF NEW.disk IS NULL THEN
    NEW.disk := 'supabase';
  END IF;

  -- Создаем metadata если его нет
  IF NEW.metadata IS NULL THEN
    NEW.metadata := jsonb_build_object(
      'collection', NEW.collection,
      'alt_text', NEW.alt_text,
      'description', NEW.description
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создать триггер для автообновления полей
DROP TRIGGER IF EXISTS media_auto_update ON public.media;
CREATE TRIGGER media_auto_update
  BEFORE INSERT OR UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION update_media_fields();

-- Проверка
SELECT
  COUNT(*) as total_records,
  COUNT(type) as has_type,
  COUNT(disk) as has_disk,
  COUNT(human_size) as has_human_size,
  COUNT(CASE WHEN is_image = true THEN 1 END) as images
FROM public.media;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'media'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ════════════════════════════════════════════════════════════════
-- ГОТОВО! Таблица media полностью соответствует TypeScript типу
-- Попробуйте загрузить изображение снова!
-- ════════════════════════════════════════════════════════════════
