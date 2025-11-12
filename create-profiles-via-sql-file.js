#!/usr/bin/env node
/**
 * Create profiles table and setup permissions via SQL file execution
 * This generates a single SQL file that user can copy-paste into Supabase
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║      Creating Setup SQL for Supabase             ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create Supabase client to get user data
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get all auth users
  console.log('📊 Fetching auth users...');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('❌ Failed to fetch auth users:', authError.message);
    process.exit(1);
  }

  const kfaUsers = authData.users.filter(u => u.email && u.email.includes('@kfa.kg'));
  console.log(`✅ Found ${kfaUsers.length} KFA users\n`);

  // Permission sets
  const permissionSets = {
    admin: ['content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'media.delete', 'events.view', 'events.create', 'events.edit', 'events.delete', 'members.view', 'members.edit', 'partners.view', 'partners.create', 'partners.edit', 'partners.delete', 'settings.view', 'settings.edit', 'analytics.view', 'users.view', 'users.manage'],
    editor: ['content.view', 'content.create', 'content.edit', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'events.view', 'events.create', 'events.edit'],
    moderator: ['content.view', 'content.edit', 'media.view', 'events.view', 'members.view'],
    member: ['content.view'],
  };

  // Build SQL
  let sql = `-- ============================================================================
-- KFA Complete Setup SQL (Generated automatically)
-- Run this in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Create profiles table
${fs.readFileSync('./supabase-auth-setup.sql', 'utf8')}

-- STEP 2: Insert profiles for existing users
`;

  for (const user of kfaUsers) {
    const emailPrefix = user.email.split('@')[0];
    const role = ['admin', 'editor', 'moderator', 'member'].includes(emailPrefix) ? emailPrefix : 'member';
    const roles = role === 'admin' ? ['admin', 'editor', 'moderator', 'member'] : [role];
    const permissions = permissionSets[role] || permissionSets.member;

    sql += `
-- User: ${user.email}
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES (
  '${user.id}',
  '${user.email}',
  '${user.user_metadata?.name || user.email}',
  '${role}',
  ARRAY[${roles.map(r => `'${r}'`).join(', ')}],
  ARRAY[${permissions.map(p => `'${p}'`).join(', ')}]
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();
`;
  }

  sql += `
-- STEP 3: Verify setup
SELECT email, role, array_length(permissions, 1) as permission_count
FROM public.profiles
ORDER BY email;

-- ============================================================================
-- DONE! You should see ${kfaUsers.length} profiles with permissions
-- ============================================================================
`;

  // Write to file
  const outputFile = './EXECUTE-THIS-IN-SUPABASE.sql';
  fs.writeFileSync(outputFile, sql);

  console.log('✅ SQL file created: EXECUTE-THIS-IN-SUPABASE.sql\n');
  console.log('📝 NEXT STEPS:\n');
  console.log('   1. Open Supabase SQL Editor:');
  console.log('      https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql\n');
  console.log('   2. Open file: EXECUTE-THIS-IN-SUPABASE.sql\n');
  console.log('   3. Copy ALL content (Ctrl+A, Ctrl+C)\n');
  console.log('   4. Paste into SQL Editor (Ctrl+V)\n');
  console.log('   5. Click "RUN" or press Ctrl+Enter\n');
  console.log('   6. Wait for success message\n');
  console.log('   7. Login and check Dashboard → Управление контентом → Новости ✅\n');

  console.log('📊 This will create:\n');
  kfaUsers.forEach(user => {
    const role = user.email.split('@')[0];
    const validRole = ['admin', 'editor', 'moderator', 'member'].includes(role) ? role : 'member';
    const permCount = (permissionSets[validRole] || permissionSets.member).length;
    console.log(`   - ${user.email.padEnd(25)} (${validRole.padEnd(10)}): ${permCount} permissions`);
  });

  console.log('\n✅ File ready! Please execute it in Supabase SQL Editor.\n');
}

main().catch(console.error);
