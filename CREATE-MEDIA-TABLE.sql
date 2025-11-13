-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CREATE MEDIA TABLE IN SUPABASE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- Инструкция:
-- 1. Откройте Supabase Dashboard: https://supabase.com/dashboard
-- 2. Выберите проект
-- 3. Перейдите в SQL Editor
-- 4. Вставьте весь этот код
-- 5. Нажмите "Run"
--
-- После выполнения SQL создайте Storage bucket (инструкция ниже)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 1. DROP TABLE IF EXISTS (uncomment if you want to recreate)
-- DROP TABLE IF EXISTS public.media CASCADE;

-- 2. Create media table
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
  uploader_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_collection ON public.media(collection);
CREATE INDEX IF NOT EXISTS idx_media_uploader_id ON public.media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at);

-- 4. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_media_updated_at_trigger ON public.media;
CREATE TRIGGER update_media_updated_at_trigger
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at();

-- 5. Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read media" ON public.media;
DROP POLICY IF EXISTS "Authenticated users with media.view can read all" ON public.media;
DROP POLICY IF EXISTS "Authenticated users with media.upload can insert" ON public.media;
DROP POLICY IF EXISTS "Authenticated users with media.edit can update" ON public.media;
DROP POLICY IF EXISTS "Authenticated users with media.delete can delete" ON public.media;

-- 7. Create RLS Policies

-- Policy: Public can read all media
CREATE POLICY "Anyone can read media"
  ON public.media
  FOR SELECT
  USING (true);

-- Policy: Authenticated users with media.view can read all
CREATE POLICY "Authenticated users with media.view can read all"
  ON public.media
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.view' = ANY(profiles.permissions)
    )
  );

-- Policy: Authenticated users with media.upload can insert
CREATE POLICY "Authenticated users with media.upload can insert"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.upload' = ANY(profiles.permissions)
    )
  );

-- Policy: Authenticated users with media.edit can update
CREATE POLICY "Authenticated users with media.edit can update"
  ON public.media
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.edit' = ANY(profiles.permissions)
    )
  );

-- Policy: Authenticated users with media.delete can delete
CREATE POLICY "Authenticated users with media.delete can delete"
  ON public.media
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND 'media.delete' = ANY(profiles.permissions)
    )
  );

-- 8. Insert test/placeholder data (optional)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM public.profiles
  WHERE role = 'admin'
  LIMIT 1;

  -- Check if media table is empty
  IF NOT EXISTS (SELECT 1 FROM public.media LIMIT 1) THEN
    -- Insert a placeholder/test media entry
    INSERT INTO public.media (
      filename,
      original_filename,
      path,
      url,
      mime_type,
      size,
      width,
      height,
      alt_text,
      description,
      collection,
      uploader_id
    )
    VALUES
      (
        'placeholder-image.jpg',
        'placeholder-image.jpg',
        'test/placeholder-image.jpg',
        'https://via.placeholder.com/800x600.png?text=Test+Image',
        'image/jpeg',
        102400,
        800,
        600,
        'Тестовое изображение',
        'Placeholder изображение для тестирования системы медиа',
        'test',
        admin_user_id
      );

    RAISE NOTICE 'Test media data inserted successfully';
  ELSE
    RAISE NOTICE 'Media table already contains data, skipping test data insertion';
  END IF;
END $$;

-- 9. Grant permissions
GRANT ALL ON public.media TO authenticated;
GRANT SELECT ON public.media TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.media_id_seq TO authenticated;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check created table
SELECT
  id,
  filename,
  original_filename,
  mime_type,
  size,
  collection,
  created_at
FROM public.media
ORDER BY created_at DESC;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- IMPORTANT: CREATE STORAGE BUCKET
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- После выполнения этого SQL ОБЯЗАТЕЛЬНО создайте Storage Bucket:
--
-- 1. В Supabase Dashboard перейдите в Storage (слева в меню)
-- 2. Нажмите "New bucket"
-- 3. Введите имя: media
-- 4. Выберите "Public bucket" (чтобы изображения были доступны публично)
-- 5. Нажмите "Create bucket"
--
-- Затем настройте RLS политики для bucket:
-- 6. Нажмите на bucket "media"
-- 7. Перейдите в "Policies"
-- 8. Добавьте политику для upload:
--    - Policy name: "Authenticated users can upload"
--    - Target roles: authenticated
--    - Policy definition: INSERT
--    - USING expression: (auth.role() = 'authenticated')
--
-- 9. Добавьте политику для public read:
--    - Policy name: "Public can read files"
--    - Target roles: anon, authenticated
--    - Policy definition: SELECT
--    - USING expression: true
--
-- ИЛИ выполните этот SQL для создания политик (если есть доступ):
--
-- CREATE POLICY "Authenticated users can upload to media bucket"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'media');
--
-- CREATE POLICY "Anyone can read from media bucket"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'media');
--
-- CREATE POLICY "Authenticated users can update their files"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'media' AND auth.uid() = owner)
-- WITH CHECK (bucket_id = 'media' AND auth.uid() = owner);
--
-- CREATE POLICY "Authenticated users can delete their files"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'media' AND auth.uid() = owner);
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DONE!
-- После создания bucket вы сможете загружать изображения в новости
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
