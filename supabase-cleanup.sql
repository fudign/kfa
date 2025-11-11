-- ============================================================================
-- Supabase Cleanup Script
-- ============================================================================
-- Используйте этот скрипт, чтобы очистить существующие policies
-- перед повторным запуском setup скрипта
-- ============================================================================

-- Удалить существующие Storage policies
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media files" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Buckets не удаляем, так как в них могут быть файлы
-- Если нужно удалить buckets:
-- DELETE FROM storage.buckets WHERE id IN ('media', 'documents', 'avatars');

-- Функция уже существует, не удаляем

-- Готово!
SELECT 'Cleanup completed! Now you can run supabase-setup-simple.sql again.' AS message;
