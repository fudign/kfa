#!/usr/bin/env node
/**
 * Add Content Management Permissions to Admin User
 * Adds necessary permissions for admin to access News Manager and other CMS features
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// Permission sets by role
const PERMISSION_SETS = {
  admin: [
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
  ],
  editor: [
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
  ],
  moderator: ['content.view', 'content.edit', 'media.view', 'events.view', 'members.view'],
  member: ['content.view'],
};

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║      Add Permissions to KFA Users                 ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Supabase client ready\n');

  // Check if profiles table exists
  console.log('📊 Checking profiles table...');
  const { data: profiles, error: tableError } = await supabase
    .from('profiles')
    .select('id, email, role, roles, permissions')
    .order('email');

  if (tableError) {
    console.log('\n❌ ERROR: Profiles table not found!\n');
    console.log('📝 You need to run this SQL first:');
    console.log('   https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql\n');
    console.log('   Copy and run: supabase-auth-setup.sql\n');
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log('\n⚠️  No profiles found!\n');
    console.log('📝 Create users first by running: node create-users-simple.js\n');
    process.exit(1);
  }

  console.log(`✅ Found ${profiles.length} profiles\n`);

  // Update permissions for each user
  console.log('🔧 Updating permissions...\n');

  for (const profile of profiles) {
    const permissions = PERMISSION_SETS[profile.role] || PERMISSION_SETS.member;

    console.log(`   Processing: ${profile.email} (${profile.role})`);
    console.log(`   → Adding ${permissions.length} permissions`);

    const { error: updateError } = await supabase.from('profiles').update({ permissions }).eq('id', profile.id);

    if (updateError) {
      console.log(`   ❌ Failed: ${updateError.message}\n`);
    } else {
      console.log(`   ✅ Updated successfully\n`);
    }
  }

  // Verify updates
  console.log('🔍 Verifying permissions...\n');

  const { data: updated } = await supabase.from('profiles').select('email, role, permissions').order('email');

  if (updated) {
    console.log('   Current permissions:');
    updated.forEach((user) => {
      console.log(`   - ${user.email} (${user.role}): ${user.permissions?.length || 0} permissions`);
      if (user.permissions && user.permissions.length > 0) {
        console.log(`     ${user.permissions.slice(0, 3).join(', ')}${user.permissions.length > 3 ? '...' : ''}`);
      }
    });
    console.log();
  }

  // Summary
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║            PERMISSIONS UPDATED ✅                 ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  console.log('📊 Permission Summary:\n');
  console.log(`   Admin:     ${PERMISSION_SETS.admin.length} permissions (full access)`);
  console.log(`   Editor:    ${PERMISSION_SETS.editor.length} permissions (content + media)`);
  console.log(`   Moderator: ${PERMISSION_SETS.moderator.length} permissions (view + moderate)`);
  console.log(`   Member:    ${PERMISSION_SETS.member.length} permission (view only)`);
  console.log();

  console.log('✅ Now you can login and access:');
  console.log('   - Dashboard → Управление контентом → Новости');
  console.log('   - Dashboard → Управление контентом → События');
  console.log('   - Dashboard → Управление контентом → Медиафайлы');
  console.log();

  console.log('🔗 Login at: http://localhost:3000/auth/login');
  console.log('   Email: admin@kfa.kg');
  console.log('   Password: password\n');
}

// Run
main()
  .then(() => {
    console.log('✅ Script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message, '\n');
    console.error(error);
    process.exit(1);
  });
