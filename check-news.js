/**
 * Скрипт для проверки и добавления тестовых новостей в Supabase
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

async function checkNews() {
  console.log('🔍 Проверка новостей в базе данных...\n');

  try {
    // Получаем все новости
    const { data, error, count } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Ошибка при получении новостей:', error.message);
      return;
    }

    console.log(`✅ Найдено новостей: ${count || 0}\n`);

    if (data && data.length > 0) {
      console.log('📰 Список новостей:');
      data.forEach((news, index) => {
        console.log(`\n${index + 1}. ${news.title}`);
        console.log(`   ID: ${news.id}`);
        console.log(`   Slug: ${news.slug}`);
        console.log(`   Статус: ${news.status}`);
        console.log(`   Избранное: ${news.featured ? 'Да' : 'Нет'}`);
        console.log(`   Изображение: ${news.image || 'Нет'}`);
        console.log(`   Дата создания: ${new Date(news.created_at).toLocaleString('ru-RU')}`);
      });
    } else {
      console.log('⚠️  В базе данных нет новостей');
      console.log('\n💡 Хотите добавить тестовые новости? Запустите: node add-test-news.js');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

checkNews();
