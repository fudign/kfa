-- ============================================================================
-- Supabase Setup SQL Script (Упрощенная версия)
-- ============================================================================
-- Этот скрипт создает минимальную рабочую конфигурацию без сложных RLS policies
-- Используйте для первого запуска, затем настройте дополнительные policies
-- ============================================================================

-- 1. СОЗДАТЬ STORAGE BUCKETS
-- ============================================================================

-- Bucket для медиа (публичный доступ)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket для документов (приватный)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket для аватаров
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;


-- 2. БАЗОВЫЕ STORAGE RLS POLICIES (без владельцев)
-- ============================================================================

-- Политика для публичного чтения медиа
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Политика для загрузки медиа (только авторизованные)
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Политика для обновления медиа (все авторизованные)
CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Политика для удаления медиа (все авторизованные)
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Политики для avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Политики для documents
CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);


-- 3. POSTGRESQL РАСШИРЕНИЯ
-- ============================================================================

-- Полнотекстовый поиск
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- UUID поддержка
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- 4. ФУНКЦИЯ ДЛЯ AUTO-UPDATE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- ============================================================================
-- ЗАВЕРШЕНО!
-- ============================================================================
-- Что создано:
-- ✓ Storage buckets: media, documents, avatars
-- ✓ Базовые RLS policies (доступ для всех авторизованных)
-- ✓ PostgreSQL расширения
-- ✓ Функция для автообновления timestamps
--
-- Следующие шаги:
-- 1. Запустите Laravel миграции: php artisan migrate
-- 2. Настройте более строгие RLS policies (см. supabase-setup.sql)
-- 3. Добавьте индексы для производительности
-- ============================================================================
