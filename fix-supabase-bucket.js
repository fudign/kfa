/**
 * Скрипт для проверки и исправления настроек Supabase Storage bucket
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './kfa-backend/kfa-api/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Проверка Supabase Storage...\n');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✅ Найден' : '❌ Отсутствует');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ ОШИБКА: Supabase credentials не найдены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAndFixBucket() {
  console.log('\n=== Шаг 1: Проверка bucket "media" ===\n');

  // Получить список buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error('❌ Ошибка получения buckets:', bucketsError);
    return;
  }

  console.log('📦 Найдено buckets:', buckets.length);
  buckets.forEach(b => {
    console.log(`  - ${b.name} (public: ${b.public})`);
  });

  const mediaBucket = buckets.find(b => b.name === 'media');

  if (!mediaBucket) {
    console.log('\n❌ Bucket "media" не найден!');
    console.log('Создаём bucket...');

    const { data, error } = await supabase.storage.createBucket('media', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    });

    if (error) {
      console.error('❌ Ошибка создания bucket:', error);
      return;
    }

    console.log('✅ Bucket создан:', data);
  } else {
    console.log(`\n📦 Bucket "media" найден`);
    console.log(`   Public: ${mediaBucket.public}`);

    if (!mediaBucket.public) {
      console.log('\n⚠️  Bucket НЕ публичный! Делаем его публичным...');

      const { data, error } = await supabase.storage.updateBucket('media', {
        public: true
      });

      if (error) {
        console.error('❌ Ошибка обновления bucket:', error);
      } else {
        console.log('✅ Bucket теперь публичный!');
      }
    } else {
      console.log('✅ Bucket уже публичный');
    }
  }

  console.log('\n=== Шаг 2: Проверка доступа к файлу ===\n');

  const testUrl = 'https://eofneihisbhucxcydvac.supabase.co/object/public/media/2025/11/12/Szzou9rRevw9FGk5ThQCXuy2uJy7PnsDpovu4mEX.png';
  console.log('Тестируем URL:', testUrl);

  try {
    const response = await fetch(testUrl);
    console.log('HTTP Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    if (response.status === 200) {
      console.log('✅ Файл доступен!');
    } else if (response.status === 404) {
      console.log('❌ Файл не найден (404)');
    } else if (response.status === 403) {
      console.log('❌ Доступ запрещён (403) - проблема с политиками доступа');
    } else {
      console.log('⚠️  Неожиданный статус');
    }
  } catch (err) {
    console.error('❌ Ошибка при запросе:', err.message);
  }

  console.log('\n=== Шаг 3: Список файлов в bucket ===\n');

  const { data: files, error: filesError } = await supabase.storage
    .from('media')
    .list('2025/11/12', {
      limit: 10
    });

  if (filesError) {
    console.error('❌ Ошибка получения файлов:', filesError);
  } else {
    console.log('📁 Файлы в папке 2025/11/12:');
    if (files.length === 0) {
      console.log('  (пусто)');
    } else {
      files.forEach(f => {
        console.log(`  - ${f.name} (${f.metadata?.size || 0} bytes)`);
        const publicUrl = supabase.storage.from('media').getPublicUrl(`2025/11/12/${f.name}`);
        console.log(`    URL: ${publicUrl.data.publicUrl}`);
      });
    }
  }
}

checkAndFixBucket()
  .then(() => {
    console.log('\n✅ Проверка завершена!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Ошибка:', err);
    process.exit(1);
  });
