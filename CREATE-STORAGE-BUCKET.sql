-- Create Supabase Storage bucket for media files
-- Run this in Supabase SQL Editor

-- 1. Create 'media' bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,  -- Public bucket
  52428800,  -- 50MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from media bucket" ON storage.objects;

-- 4. Create policy: Anyone can read from media bucket (public read)
CREATE POLICY "Public read access for media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- 5. Create policy: Authenticated users can upload to media bucket
CREATE POLICY "Authenticated users can upload to media bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- 6. Create policy: Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update media bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- 7. Create policy: Authenticated users can delete their uploads
CREATE POLICY "Authenticated users can delete from media bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- 8. Verify bucket was created
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets
WHERE id = 'media';

-- 9. Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND (policyname LIKE '%media%' OR policyname LIKE '%Public%')
ORDER BY policyname;

-- Done! You should see:
-- 1. One row from storage.buckets showing the 'media' bucket
-- 2. Four rows from pg_policies showing the RLS policies
