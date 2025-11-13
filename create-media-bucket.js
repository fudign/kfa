/**
 * Скрипт для создания bucket "media" в Supabase Storage
 * и настройки политик доступа
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './kfa-website/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMediaBucket() {
  console.log('🪣 Создание bucket "media" в Supabase Storage...\n');

  try {
    // Проверяем существует ли bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Ошибка при получении списка buckets:', listError.message);
      console.log('\n⚠️  Скорее всего у вас нет прав для создания buckets через API.');
      console.log('📝 Создайте bucket вручную через Dashboard:');
      console.log('   1. Откройте https://supabase.com/dashboard');
      console.log('   2. Перейдите в Storage');
      console.log('   3. Нажмите "New bucket"');
      console.log('   4. Имя: media');
      console.log('   5. Public bucket: ✅ Включено');
      console.log('   6. Нажмите "Create"');
      return;
    }

    // Проверяем существует ли bucket media
    const mediaExists = buckets?.some((b) => b.name === 'media');

    if (mediaExists) {
      console.log('✅ Bucket "media" уже существует!');
      console.log('   ID:', buckets.find((b) => b.name === 'media')?.id);
      console.log('   Public:', buckets.find((b) => b.name === 'media')?.public ? 'Да' : 'Нет');
    } else {
      // Создаем bucket
      const { data, error } = await supabase.storage.createBucket('media', {
        public: true, // Публичный доступ для чтения
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
      });

      if (error) {
        console.error('❌ Ошибка при создании bucket:', error.message);
        console.log('\n⚠️  Возможно у вас недостаточно прав.');
        console.log('📝 Создайте bucket вручную через Dashboard (см. инструкции выше)');
        return;
      }

      console.log('✅ Bucket "media" успешно создан!');
      console.log('   ID:', data);
    }

    console.log('\n📊 Проверка bucket...');

    // Получаем информацию о bucket
    const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('media');

    if (bucketError) {
      console.error('❌ Ошибка при получении информации о bucket:', bucketError.message);
    } else {
      console.log('   Имя:', bucketInfo.name);
      console.log('   ID:', bucketInfo.id);
      console.log('   Public:', bucketInfo.public ? 'Да' : 'Нет');
      console.log('   Создан:', new Date(bucketInfo.created_at).toLocaleString('ru-RU'));
    }

    console.log('\n📝 Следующие шаги:');
    console.log('   1. Выполните SQL скрипт setup-media-storage.sql для создания таблицы media');
    console.log('   2. Настройте политики доступа в Dashboard → Storage → media → Policies');
    console.log('   3. Войдите в систему: http://localhost:3000/auth/login');
    console.log('   4. Попробуйте загрузить изображение в новость');
    console.log('\n✨ Готово!');
  } catch (error) {
    console.error('❌ Общая ошибка:', error);
  }
}

createMediaBucket();
