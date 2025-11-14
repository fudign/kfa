#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './kfa-website/.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🔍 Проверка структуры таблицы membership_applications...\n');

// Попробуем вставить минимальную запись чтобы увидеть какие поля обязательны
const { data, error } = await supabase
  .from('membership_applications')
  .insert({
    membership_type: 'individual',
    first_name: 'Test',
    last_name: 'User',
    position: 'Test Position',
    email: 'test@example.com',
    phone: '+996555123456',
    experience: 'Test experience',
    motivation: 'Test motivation',
  })
  .select()
  .single();

if (error) {
  console.error('❌ Ошибка:', error.message);
  console.error('Детали:', error);
} else {
  console.log('✅ Успешно создана тестовая запись!');
  console.log('Структура данных:', Object.keys(data));
  console.log('\nДанные:', data);

  // Удалим тестовую запись
  await supabase
    .from('membership_applications')
    .delete()
    .eq('id', data.id);

  console.log('\n✅ Тестовая запись удалена');
}
