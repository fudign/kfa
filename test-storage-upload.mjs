import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'kfa-website', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testStorageUpload() {
  console.log('🔍 Testing Supabase Storage upload...\n');

  // Check if we can list buckets
  console.log('1. Checking buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError);
    return;
  }

  console.log('✅ Found buckets:', buckets?.length || 0);
  if (buckets && buckets.length > 0) {
    console.log('   Bucket names:', buckets.map(b => b.name).join(', '));
  } else {
    console.log('   No buckets found - will create "media" bucket');
  }
  const mediaBucket = buckets?.find(b => b.name === 'media');

  if (!mediaBucket) {
    console.error('❌ "media" bucket not found!');
    return;
  }

  console.log('✅ Media bucket found:', {
    name: mediaBucket.name,
    public: mediaBucket.public,
    id: mediaBucket.id
  });

  // Create a test file (1x1 pixel transparent PNG)
  const testFileName = `test-${Date.now()}.png`;
  const testFilePath = `uploads/${testFileName}`;

  // Base64 encoded 1x1 transparent PNG
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64PNG, 'base64');

  console.log('\n2. Attempting to upload test file...');
  console.log('   File:', testFilePath);
  console.log('   Size:', buffer.length, 'bytes');

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(testFilePath, buffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('❌ Upload failed!');
    console.error('   Error:', uploadError);
    console.error('   Message:', uploadError.message);
    console.error('   Status:', uploadError.statusCode);

    if (uploadError.message?.includes('row-level security')) {
      console.log('\n💡 RLS Policy Issue detected!');
      console.log('   You need to run the SQL script: FIX-STORAGE-POLICIES.sql');
      console.log('   Go to Supabase Dashboard → SQL Editor → Run the script');
    }

    return;
  }

  console.log('✅ Upload successful!');
  console.log('   Path:', uploadData.path);
  console.log('   Full path:', uploadData.fullPath);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(uploadData.path);

  console.log('   Public URL:', urlData.publicUrl);

  // Try to delete the test file
  console.log('\n3. Cleaning up test file...');
  const { error: deleteError } = await supabase.storage
    .from('media')
    .remove([uploadData.path]);

  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message);
    console.log('   File will remain at:', urlData.publicUrl);
  } else {
    console.log('✅ Test file deleted');
  }

  console.log('\n✨ Storage upload test completed successfully!');
  console.log('   Your storage is configured correctly.');
}

testStorageUpload().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
