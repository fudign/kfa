import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'kfa-website', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createTestUser() {
  console.log('🔍 Checking/Creating test user...\n');

  const testEmail = 'test@kfa.local';
  const testPassword = 'TestKFA2025!';

  console.log('📧 Test credentials:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log('');

  // Пробуем войти
  console.log('1. Trying to sign in with existing credentials...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (!signInError && signInData.user) {
    console.log('✅ Test user already exists and can sign in!');
    console.log(`   User ID: ${signInData.user.id}`);
    console.log(`   Email: ${signInData.user.email}`);

    // Тестируем загрузку
    await testUpload(signInData.session);
    return;
  }

  console.log('   User does not exist, creating...\n');

  // Создаем пользователя
  console.log('2. Creating new test user...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (signUpError) {
    console.error('❌ Error creating user:', signUpError.message);
    console.log('\n💡 You need to create a user manually:');
    console.log('   1. Go to Supabase Dashboard → Authentication → Users');
    console.log('   2. Click "Add user" → "Create new user"');
    console.log(`   3. Email: ${testEmail}`);
    console.log(`   4. Password: ${testPassword}`);
    console.log('   5. Enable "Auto Confirm User"');
    return;
  }

  if (signUpData.user) {
    console.log('✅ Test user created successfully!');
    console.log(`   User ID: ${signUpData.user.id}`);
    console.log(`   Email: ${signUpData.user.email}`);

    if (signUpData.session) {
      console.log('   Session: Active');
      await testUpload(signUpData.session);
    } else {
      console.log('   ⚠️ Email confirmation may be required');
      console.log('   Check Supabase Dashboard → Authentication → Users');
    }
  }
}

async function testUpload(session) {
  console.log('\n3. Testing upload with authenticated user...');

  // Создаем простой тестовый файл (1x1 PNG)
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64PNG, 'base64');

  const fileName = `test-${Date.now()}.png`;
  const filePath = `uploads/${fileName}`;

  console.log(`   File: ${filePath}`);
  console.log(`   User: ${session.user.email}`);
  console.log(`   Access Token: ${session.access_token.substring(0, 20)}...`);

  // Создаем новый клиент с токеном пользователя
  const authedSupabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    }
  );

  const { data, error } = await authedSupabase.storage
    .from('media')
    .upload(filePath, buffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('\n❌ Upload FAILED!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Status: ${error.statusCode}`);

    if (error.message.includes('row-level security')) {
      console.log('\n💡 RLS Policy Issue!');
      console.log('   The policy needs to allow "authenticated" role');
      console.log('\n   Run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log('   DROP POLICY IF EXISTS "Allow authenticated uploads to media" ON storage.objects;');
      console.log('');
      console.log('   CREATE POLICY "Allow authenticated uploads to media"');
      console.log('   ON storage.objects');
      console.log('   FOR INSERT');
      console.log('   TO authenticated');
      console.log("   WITH CHECK (bucket_id = 'media');");
      console.log('');
    }

    return false;
  }

  console.log('\n✅ Upload SUCCESS!');
  console.log(`   Path: ${data.path}`);

  const { data: urlData } = authedSupabase.storage
    .from('media')
    .getPublicUrl(data.path);

  console.log(`   URL: ${urlData.publicUrl}`);

  // Удаляем тестовый файл
  await authedSupabase.storage.from('media').remove([data.path]);
  console.log('   Cleaned up test file');

  console.log('\n🎉 Everything works! Image upload is configured correctly!');
  return true;
}

createTestUser().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
