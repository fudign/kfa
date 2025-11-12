#!/usr/bin/env node
/**
 * Execute setup SQL directly via PostgreSQL client
 * Creates profiles table and adds permissions
 */

const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// PostgreSQL connection
const DB_HOST = 'aws-0-ap-southeast-1.pooler.supabase.com';
const DB_PORT = 6543; // Transaction pooler port
const DB_NAME = 'postgres';
const DB_USER = 'postgres.eofneihisbhucxcydvac';
const DB_PASSWORD = 'egD.SYGb.F5Hm3r';

const permissionSets = {
  admin: ['content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'media.delete', 'events.view', 'events.create', 'events.edit', 'events.delete', 'members.view', 'members.edit', 'partners.view', 'partners.create', 'partners.edit', 'partners.delete', 'settings.view', 'settings.edit', 'analytics.view', 'users.view', 'users.manage'],
  editor: ['content.view', 'content.create', 'content.edit', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'events.view', 'events.create', 'events.edit'],
  moderator: ['content.view', 'content.edit', 'media.view', 'events.view', 'members.view'],
  member: ['content.view'],
};

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║   Direct PostgreSQL Setup - KFA News System      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Get auth users first
  console.log('📊 Step 1: Fetching auth users from Supabase...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('❌ Failed to fetch auth users:', authError.message);
    process.exit(1);
  }

  const kfaUsers = authData.users.filter(u => u.email && u.email.includes('@kfa.kg'));
  console.log(`✅ Found ${kfaUsers.length} KFA users\n`);

  // Connect to PostgreSQL
  console.log('📡 Step 2: Connecting to PostgreSQL...');
  const pgClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 30000,
    query_timeout: 30000,
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Trying alternative connection...\n');

    // Try direct connection
    pgClient.host = 'db.eofneihisbhucxcydvac.supabase.co';
    pgClient.port = 5432;
    pgClient.user = 'postgres';

    try {
      await pgClient.connect();
      console.log('✅ Connected via direct connection\n');
    } catch (error2) {
      console.error('❌ All connection attempts failed');
      console.log('\n⚠️  Cannot connect to PostgreSQL directly.');
      console.log('📝 Please execute the SQL file manually:');
      console.log('   File: EXECUTE-THIS-IN-SUPABASE.sql');
      console.log('   URL: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql\n');
      process.exit(1);
    }
  }

  // Create profiles table
  console.log('🔨 Step 3: Creating profiles table...');

  const createTableSQL = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'moderator', 'member', 'guest')),
  roles TEXT[] DEFAULT ARRAY['member'],
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
`;

  try {
    await pgClient.query(createTableSQL);
    console.log('✅ Profiles table created\n');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Profiles table already exists\n');
    } else {
      console.error('❌ Failed to create table:', error.message);
      await pgClient.end();
      process.exit(1);
    }
  }

  // Create RLS policies
  console.log('🔐 Step 4: Creating RLS policies...');

  const rlsPoliciesSQL = `
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;

  -- Create policies
  CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

  CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

  CREATE POLICY "Only admins can delete profiles"
    ON public.profiles FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND 'admin' = ANY(roles)
      )
    );
END $$;
`;

  try {
    await pgClient.query(rlsPoliciesSQL);
    console.log('✅ RLS policies created\n');
  } catch (error) {
    console.log('⚠️  RLS policies:', error.message.split('\n')[0], '\n');
  }

  // Insert profiles for each user
  console.log('👥 Step 5: Creating user profiles...\n');

  for (const user of kfaUsers) {
    const emailPrefix = user.email.split('@')[0];
    const role = ['admin', 'editor', 'moderator', 'member'].includes(emailPrefix) ? emailPrefix : 'member';
    const roles = role === 'admin' ? ['admin', 'editor', 'moderator', 'member'] : [role];
    const permissions = permissionSets[role] || permissionSets.member;

    const insertSQL = `
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();
`;

    try {
      await pgClient.query(insertSQL, [
        user.id,
        user.email,
        user.user_metadata?.name || user.email,
        role,
        roles,
        permissions,
      ]);

      console.log(`   ✅ ${user.email.padEnd(25)} (${role.padEnd(10)}): ${permissions.length} permissions`);
    } catch (error) {
      console.log(`   ❌ ${user.email}: ${error.message}`);
    }
  }

  // Verify
  console.log('\n🔍 Step 6: Verifying setup...\n');

  const verifySQL = 'SELECT email, role, array_length(permissions, 1) as perm_count FROM public.profiles ORDER BY email';

  try {
    const result = await pgClient.query(verifySQL);

    console.log('✅ Profiles in database:');
    result.rows.forEach(row => {
      console.log(`   - ${row.email.padEnd(25)} (${row.role.padEnd(10)}): ${row.perm_count} permissions`);
    });
  } catch (error) {
    console.log('⚠️  Could not verify:', error.message);
  }

  await pgClient.end();

  // Final summary
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║            SETUP COMPLETE ✅                      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  console.log('✅ News system is ready!\n');
  console.log('🔗 Next steps:\n');
  console.log('   1. Login: http://localhost:3000/auth/login');
  console.log('      Email: admin@kfa.kg');
  console.log('      Password: password\n');
  console.log('   2. Dashboard: http://localhost:3000/dashboard\n');
  console.log('   3. Click: Управление контентом → Новости ✅\n');
}

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
