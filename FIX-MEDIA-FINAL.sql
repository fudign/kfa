-- ════════════════════════════════════════════════════════════════
-- ОКОНЧАТЕЛЬНОЕ ИСПРАВЛЕНИЕ ТАБЛИЦЫ MEDIA
-- ════════════════════════════════════════════════════════════════
-- Скопируйте ВСЁ и выполните в:
-- https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
-- ════════════════════════════════════════════════════════════════

-- 1. Добавить недостающие колонки с правильными типами
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS type VARCHAR(50),
ADD COLUMN IF NOT EXISTS disk VARCHAR(50) DEFAULT 'supabase',
ADD COLUMN IF NOT EXISTS human_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS is_image BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pdf BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_document BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS uploaded_by UUID,  -- UUID, не INTEGER!
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 2. Скопировать данные из uploader_id в uploaded_by (оба UUID)
UPDATE public.media
SET uploaded_by = uploader_id
WHERE uploaded_by IS NULL AND uploader_id IS NOT NULL;

-- 3. Заполнить type на основе mime_type
UPDATE public.media
SET type = CASE
  WHEN mime_type LIKE 'image/%' THEN 'image'
  WHEN mime_type LIKE 'video/%' THEN 'video'
  WHEN mime_type LIKE 'audio/%' THEN 'audio'
  WHEN mime_type LIKE 'application/pdf' THEN 'document'
  ELSE 'file'
END
WHERE type IS NULL;

-- 4. Заполнить human_size
UPDATE public.media
SET human_size = CASE
  WHEN size < 1024 THEN size || ' B'
  WHEN size < 1048576 THEN ROUND(size::numeric / 1024, 2) || ' KB'
  WHEN size < 1073741824 THEN ROUND(size::numeric / 1048576, 2) || ' MB'
  ELSE ROUND(size::numeric / 1073741824, 2) || ' GB'
END
WHERE human_size IS NULL;

-- 5. Заполнить is_image, is_pdf, is_document
UPDATE public.media
SET
  is_image = (mime_type LIKE 'image/%'),
  is_pdf = (mime_type = 'application/pdf'),
  is_document = (mime_type LIKE 'application/%')
WHERE is_image = false;

-- 6. Заполнить metadata
UPDATE public.media
SET metadata = jsonb_build_object(
  'collection', COALESCE(collection, ''),
  'alt_text', COALESCE(alt_text, ''),
  'description', COALESCE(description, '')
)
WHERE metadata IS NULL;

-- 7. Создать индексы
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(type);
CREATE INDEX IF NOT EXISTS idx_media_disk ON public.media(disk);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_is_image ON public.media(is_image);

-- 8. Создать функцию для автоматического заполнения полей при INSERT/UPDATE
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

  -- Копируем uploader_id в uploaded_by если uploaded_by пустой
  IF NEW.uploaded_by IS NULL AND NEW.uploader_id IS NOT NULL THEN
    NEW.uploaded_by := NEW.uploader_id;
  END IF;

  -- Создаем metadata если его нет
  IF NEW.metadata IS NULL THEN
    NEW.metadata := jsonb_build_object(
      'collection', COALESCE(NEW.collection, ''),
      'alt_text', COALESCE(NEW.alt_text, ''),
      'description', COALESCE(NEW.description, '')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Создать триггер для автообновления полей
DROP TRIGGER IF EXISTS media_auto_update ON public.media;
CREATE TRIGGER media_auto_update
  BEFORE INSERT OR UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION update_media_fields();

-- 10. Проверка структуры таблицы
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'media'
AND table_schema = 'public'
AND column_name IN ('type', 'disk', 'human_size', 'is_image', 'uploaded_by', 'uploader_id', 'metadata')
ORDER BY column_name;

-- 11. Проверка данных
SELECT
  COUNT(*) as total_records,
  COUNT(type) as has_type,
  COUNT(disk) as has_disk,
  COUNT(human_size) as has_human_size,
  COUNT(uploaded_by) as has_uploaded_by,
  COUNT(metadata) as has_metadata,
  COUNT(CASE WHEN is_image = true THEN 1 END) as images_count
FROM public.media;

-- ════════════════════════════════════════════════════════════════
-- ГОТОВО!
--
-- Что исправлено:
-- ✅ uploaded_by теперь UUID (не INTEGER)
-- ✅ Все поля заполняются автоматически при загрузке
-- ✅ Триггер работает при каждой вставке
--
-- Попробуйте загрузить изображение снова!
-- ════════════════════════════════════════════════════════════════
