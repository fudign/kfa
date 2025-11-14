#!/usr/bin/env node

/**
 * Проверка текущего пользователя и его прав
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './kfa-website/.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('\n🔍 Проверка пользователя и прав доступа\n');
console.log('='.repeat(60));

async function checkUser() {
  try {
    // Попросить пользователя ввести email и пароль
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const email = await new Promise(resolve => {
      rl.question('Email: ', answer => resolve(answer));
    });

    const password = await new Promise(resolve => {
      rl.question('Password: ', answer => resolve(answer));
    });

    rl.close();

    console.log('\n🔐 Авторизация...\n');

    // Войти
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (authError) {
      console.error('❌ Ошибка авторизации:', authError.message);
      return;
    }

    const user = authData.user;
    console.log('✅ Успешная авторизация!');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}\n`);

    // Проверить роли
    console.log('👤 Проверка ролей...\n');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.log('⚠️  Таблица user_roles не найдена или ошибка:', rolesError.message);
    } else if (roles && roles.length > 0) {
      console.log('✅ Роли:');
      roles.forEach(r => console.log(`   - ${r.role}`));
    } else {
      console.log('⚠️  Роли не назначены');
    }

    // Проверить права
    console.log('\n🔑 Проверка прав доступа...\n');
    const { data: permissions, error: permsError } = await supabase
      .from('user_permissions')
      .select('permission')
      .eq('user_id', user.id);

    if (permsError) {
      console.log('⚠️  Таблица user_permissions не найдена или ошибка:', permsError.message);
      console.log('\n📝 Возможно, таблица не создана. Выполните SQL из GRANT-APPLICATIONS-PERMISSION.sql');
    } else if (permissions && permissions.length > 0) {
      console.log('✅ Права доступа:');
      permissions.forEach(p => console.log(`   - ${p.permission}`));

      const hasApplicationsView = permissions.some(p => p.permission === 'applications.view');
      console.log('\n📋 Доступ к заявкам:', hasApplicationsView ? '✅ ЕСТЬ' : '❌ НЕТ');

      if (!hasApplicationsView) {
        console.log('\n💡 Чтобы получить доступ к заявкам:');
        console.log('   1. Откройте Supabase Dashboard → SQL Editor');
        console.log('   2. Выполните скрипт GRANT-APPLICATIONS-PERMISSION.sql');
        console.log('   3. Используйте ваш User ID:', user.id);
      }
    } else {
      console.log('⚠️  Права не назначены');
      console.log('\n💡 Чтобы получить доступ к заявкам:');
      console.log('   1. Откройте Supabase Dashboard → SQL Editor');
      console.log('   2. Выполните скрипт GRANT-APPLICATIONS-PERMISSION.sql');
      console.log('   3. Используйте ваш User ID:', user.id);
    }

    // Проверить доступ к заявкам
    console.log('\n📊 Проверка доступа к заявкам...\n');
    const { data: apps, error: appsError } = await supabase
      .from('membership_applications')
      .select('id, first_name, last_name, email, status')
      .limit(5);

    if (appsError) {
      console.log('❌ Ошибка доступа к заявкам:', appsError.message);
    } else {
      console.log(`✅ Доступ к заявкам есть! Найдено: ${apps.length} заявок`);
      if (apps.length > 0) {
        console.log('\nПоследние заявки:');
        apps.forEach((app, i) => {
          console.log(`   ${i + 1}. ${app.first_name} ${app.last_name} (${app.email}) - ${app.status}`);
        });
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
  }
}

checkUser();
