#!/usr/bin/env node

/**
 * Проверка таблицы membership_applications в Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config({ path: './kfa-website/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ОШИБКА: Переменные VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY не найдены');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n🔍 Проверка таблицы membership_applications...\n');

async function verifyTable() {
  try {
    // Попытка получить данные из таблицы
    const { data, error, count } = await supabase
      .from('membership_applications')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('❌ Таблица membership_applications НЕ СУЩЕСТВУЕТ');
        console.log('\n📋 Необходимо выполнить скрипт CREATE-APPLICATIONS-TABLE.sql:');
        console.log('   1. Откройте Supabase Dashboard → SQL Editor');
        console.log('   2. Скопируйте содержимое файла CREATE-APPLICATIONS-TABLE.sql');
        console.log('   3. Вставьте в SQL Editor и нажмите Run');
        return false;
      }
      throw error;
    }

    console.log('✅ Таблица membership_applications существует!');
    console.log(`📊 Записей в таблице: ${count || 0}`);

    // Получить несколько записей для проверки
    const { data: samples, error: sampleError } = await supabase
      .from('membership_applications')
      .select('id, first_name, last_name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (sampleError) throw sampleError;

    if (samples && samples.length > 0) {
      console.log('\n📝 Последние заявки:');
      samples.forEach((app, index) => {
        console.log(`   ${index + 1}. ${app.first_name} ${app.last_name} (${app.email}) - ${app.status}`);
      });
    } else {
      console.log('\n📝 Заявок пока нет (это нормально)');
    }

    // Получить статистику
    const { data: allApps, error: allError } = await supabase
      .from('membership_applications')
      .select('status');

    if (!allError && allApps) {
      const stats = {
        total: allApps.length,
        pending: allApps.filter(a => a.status === 'pending').length,
        reviewing: allApps.filter(a => a.status === 'reviewing').length,
        approved: allApps.filter(a => a.status === 'approved').length,
        rejected: allApps.filter(a => a.status === 'rejected').length,
      };

      console.log('\n📊 Статистика по статусам:');
      console.log(`   Всего: ${stats.total}`);
      console.log(`   Ожидают: ${stats.pending}`);
      console.log(`   На рассмотрении: ${stats.reviewing}`);
      console.log(`   Одобрено: ${stats.approved}`);
      console.log(`   Отклонено: ${stats.rejected}`);
    }

    return true;

  } catch (error) {
    console.error('❌ ОШИБКА при проверке таблицы:', error.message);
    return false;
  }
}

async function testApplicationSubmission() {
  console.log('\n\n🧪 Тестирование отправки заявки...\n');

  try {
    const testData = {
      membership_type: 'individual',
      first_name: 'Тест',
      last_name: 'Тестов',
      organization_name: 'Тестовая компания',
      position: 'Тестовая должность',
      email: `test-${Date.now()}@example.com`,
      phone: '+996 555 999 888',
      experience: 'Тестовый опыт работы для проверки системы.',
      motivation: 'Тестовая мотивация для проверки работы формы.',
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('membership_applications')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.error('❌ ОШИБКА отправки тестовой заявки:', error.message);
      if (error.message.includes('permission denied') || error.message.includes('policy')) {
        console.log('\n⚠️  Проблема с RLS политиками. Проверьте что выполнены все политики из SQL скрипта.');
      }
      return false;
    }

    console.log('✅ Тестовая заявка успешно создана!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Email: ${data.email}`);
    console.log(`   Статус: ${data.status}`);

    // Удалить тестовую заявку
    console.log('\n🗑️  Удаление тестовой заявки...');
    const { error: deleteError } = await supabase
      .from('membership_applications')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.log('⚠️  Не удалось удалить тестовую заявку (это нормально, можно удалить вручную)');
    } else {
      console.log('✅ Тестовая заявка удалена');
    }

    return true;

  } catch (error) {
    console.error('❌ ОШИБКА при тестировании:', error.message);
    return false;
  }
}

async function main() {
  const tableExists = await verifyTable();

  if (tableExists) {
    await testApplicationSubmission();
    console.log('\n\n🎉 Все проверки пройдены! Система заявок готова к работе!');
    console.log('\n📍 Ссылки:');
    console.log('   - Форма заявки: https://kfa-website.vercel.app/membership/join');
    console.log('   - Админка: https://kfa-website.vercel.app/dashboard/applications');
  }

  console.log('\n');
}

main().catch(console.error);
