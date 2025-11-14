#!/usr/bin/env node
/**
 * FIX PERMISSIONS IN SUPABASE - AUTOMATED
 * This script will automatically fix admin permissions in Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

const ADMIN_PERMISSIONS = [
  'content.view',
  'content.create',
  'content.edit',
  'content.delete',
  'content.publish',
  'media.view',
  'media.upload',
  'media.edit',
  'media.delete',
  'events.view',
  'events.create',
  'events.edit',
  'events.delete',
  'members.view',
  'members.edit',
  'partners.view',
  'partners.create',
  'partners.edit',
  'partners.delete',
  'settings.view',
  'settings.edit',
  'analytics.view',
  'users.view',
  'users.manage',
];

const EDITOR_PERMISSIONS = [
  'content.view',
  'content.create',
  'content.edit',
  'content.publish',
  'media.view',
  'media.upload',
  'media.edit',
  'events.view',
  'events.create',
  'events.edit',
];

const MODERATOR_PERMISSIONS = ['content.view', 'content.edit', 'media.view', 'events.view', 'members.view'];

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ PERMISSIONS В SUPABASE   ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Подключение к Supabase установлено\n');

  // Step 1: Check auth.users
  console.log('📊 ШАГ 1: Проверка auth.users...\n');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.log('❌ Ошибка получения пользователей:', authError.message);
    process.exit(1);
  }

  console.log(`   Найдено пользователей в auth.users: ${authUsers.users.length}`);
  authUsers.users.forEach((user) => {
    console.log(`   - ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
  });
  console.log();

  // Step 2: Check profiles table
  console.log('📊 ШАГ 2: Проверка таблицы profiles...\n');
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').order('email');

  if (profilesError) {
    if (profilesError.message.includes('does not exist')) {
      console.log('⚠️  Таблица profiles не существует!');
      console.log('   Создаем таблицу через RPC...\n');

      // Create profiles table via SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            role TEXT DEFAULT 'user',
            roles TEXT[] DEFAULT ARRAY['user'],
            permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (createError) {
        console.log('❌ Не удалось создать таблицу через RPC');
        console.log('   Попробуем через INSERT...\n');
      }
    } else {
      console.log('❌ Ошибка:', profilesError.message);
    }
  }

  // Step 3: Sync profiles with auth.users
  console.log('🔄 ШАГ 3: Синхронизация profiles с auth.users...\n');

  for (const user of authUsers.users) {
    const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', user.id).single();

    if (!existingProfile) {
      console.log(`   Создаем profile для: ${user.email}`);

      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0],
        role: 'user',
        roles: ['user'],
        permissions: [],
      });

      if (insertError) {
        console.log(`   ❌ Ошибка: ${insertError.message}`);
      } else {
        console.log(`   ✅ Profile создан`);
      }
    }
  }
  console.log();

  // Step 4: Get current profiles
  console.log('📊 ШАГ 4: Текущее состояние profiles...\n');
  const { data: currentProfiles, error: currentError } = await supabase.from('profiles').select('email, role, permissions').order('email');

  if (currentError) {
    console.log('❌ Ошибка получения profiles:', currentError.message);
    process.exit(1);
  }

  console.log('   Текущие пользователи:');
  currentProfiles.forEach((p) => {
    const permCount = p.permissions?.length || 0;
    const status = permCount > 0 ? '✅' : '❌';
    console.log(`   ${status} ${p.email} (${p.role}) - ${permCount} permissions`);
  });
  console.log();

  // Step 5: Update permissions for admins
  console.log('🔧 ШАГ 5: Обновление permissions для админов...\n');

  // Find admin users
  const adminProfiles = currentProfiles.filter((p) => p.role === 'admin' || p.email.includes('admin'));

  if (adminProfiles.length === 0) {
    console.log('⚠️  Админы не найдены!');
    console.log('   Проверяем всех пользователей и назначаем первого админом...\n');

    if (currentProfiles.length > 0) {
      const firstUser = currentProfiles[0];
      console.log(`   Назначаем ${firstUser.email} админом...`);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          roles: ['admin'],
          permissions: ADMIN_PERMISSIONS,
          updated_at: new Date().toISOString(),
        })
        .eq('email', firstUser.email);

      if (updateError) {
        console.log(`   ❌ Ошибка: ${updateError.message}`);
      } else {
        console.log(`   ✅ ${firstUser.email} теперь админ с ${ADMIN_PERMISSIONS.length} permissions`);
      }
    }
  } else {
    // Update all admin profiles
    for (const admin of adminProfiles) {
      console.log(`   Обновляем: ${admin.email}`);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          roles: ['admin'],
          permissions: ADMIN_PERMISSIONS,
          updated_at: new Date().toISOString(),
        })
        .eq('email', admin.email);

      if (updateError) {
        console.log(`   ❌ Ошибка: ${updateError.message}`);
      } else {
        console.log(`   ✅ Добавлено ${ADMIN_PERMISSIONS.length} permissions`);
      }
    }
  }
  console.log();

  // Step 6: Update other roles
  console.log('🔧 ШАГ 6: Обновление других ролей...\n');

  const editorProfiles = currentProfiles.filter((p) => p.role === 'editor');
  const moderatorProfiles = currentProfiles.filter((p) => p.role === 'moderator');

  for (const editor of editorProfiles) {
    console.log(`   Обновляем editor: ${editor.email}`);
    await supabase
      .from('profiles')
      .update({
        roles: ['editor'],
        permissions: EDITOR_PERMISSIONS,
        updated_at: new Date().toISOString(),
      })
      .eq('email', editor.email);
    console.log(`   ✅ Добавлено ${EDITOR_PERMISSIONS.length} permissions`);
  }

  for (const moderator of moderatorProfiles) {
    console.log(`   Обновляем moderator: ${moderator.email}`);
    await supabase
      .from('profiles')
      .update({
        roles: ['moderator'],
        permissions: MODERATOR_PERMISSIONS,
        updated_at: new Date().toISOString(),
      })
      .eq('email', moderator.email);
    console.log(`   ✅ Добавлено ${MODERATOR_PERMISSIONS.length} permissions`);
  }
  console.log();

  // Step 7: Verify results
  console.log('🔍 ШАГ 7: Проверка результатов...\n');
  const { data: finalProfiles } = await supabase.from('profiles').select('email, role, permissions').order('email');

  console.log('   Финальное состояние:');
  finalProfiles.forEach((p) => {
    const permCount = p.permissions?.length || 0;
    const hasContentView = p.permissions?.includes('content.view');
    const status = hasContentView ? '✅' : '⚠️';
    console.log(`   ${status} ${p.email} (${p.role}): ${permCount} permissions`);
    if (hasContentView) {
      console.log(`      → content.view: ✅ ЕСТЬ`);
    }
  });
  console.log();

  // Summary
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║                  ГОТОВО! ✅                          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('📊 Сводка:\n');
  const adminsWithAccess = finalProfiles.filter((p) => p.role === 'admin' && p.permissions?.includes('content.view'));

  console.log(`   ✅ Админов с доступом к новостям: ${adminsWithAccess.length}`);
  adminsWithAccess.forEach((a) => {
    console.log(`      - ${a.email} (${a.permissions.length} permissions)`);
  });
  console.log();

  console.log('🎯 ЧТО ДЕЛАТЬ ДАЛЬШЕ:\n');
  console.log('   1. Открой: https://kfa-website.vercel.app');
  console.log('   2. ВЫЙДИ из аккаунта (если залогинен)');
  console.log('   3. ВОЙДИ заново:');
  adminsWithAccess.forEach((a) => {
    console.log(`      - Email: ${a.email}`);
  });
  console.log('   4. Открой /dashboard');
  console.log('   5. Проверь раздел "УПРАВЛЕНИЕ КОНТЕНТОМ" → "Новости"\n');

  console.log('⚠️  ВАЖНО: Обязательно ПЕРЕЛОГИНЬСЯ, чтобы токен обновился!\n');
}

main()
  .then(() => {
    console.log('✅ Скрипт завершен успешно\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ОШИБКА:', error.message);
    console.error(error);
    process.exit(1);
  });
