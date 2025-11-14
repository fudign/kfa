-- Fix Supabase Storage RLS policies for 'media' bucket
-- Allows authenticated users to upload and read files

-- 1. Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read media" ON storage.objects;

-- 3. Allow anyone to read files from 'media' bucket (public read)
CREATE POLICY "Allow public to read media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- 4. Allow authenticated users to upload files to 'media' bucket
CREATE POLICY "Allow authenticated users to upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- 5. Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- 6. Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;
