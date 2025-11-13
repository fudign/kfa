#!/usr/bin/env node
/**
 * Create Supabase Test Users - Simple Version
 * Uses only Supabase Admin API (no direct PostgreSQL)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase credentials
const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// Test accounts
const TEST_ACCOUNTS = [
  {
    email: 'admin@kfa.kg',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
    roles: ['admin', 'editor', 'moderator', 'member'],
  },
  {
    email: 'editor@kfa.kg',
    password: 'password',
    name: 'Editor User',
    role: 'editor',
    roles: ['editor', 'member'],
  },
  {
    email: 'moderator@kfa.kg',
    password: 'password',
    name: 'Moderator User',
    role: 'moderator',
    roles: ['moderator', 'member'],
  },
  {
    email: 'member@kfa.kg',
    password: 'password',
    name: 'Member User',
    role: 'member',
    roles: ['member'],
  },
];

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║      Supabase User Creation - Simple Mode        ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create Supabase Admin client
  console.log('🔑 Creating Supabase Admin client...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✅ Supabase Admin client ready\n');

  // Step 1: Check if profiles table exists
  console.log('📊 Checking profiles table...');
  const { error: tableError } = await supabase.from('profiles').select('id').limit(1);

  if (tableError && tableError.message.includes('relation "public.profiles" does not exist')) {
    console.log('⚠️  Profiles table does NOT exist!\n');
    console.log('📝 You need to run this SQL in Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql\n');
    console.log('   Copy and run: supabase-auth-setup.sql\n');
    console.log('⏸️  Continuing with auth user creation only...\n');
  } else {
    console.log('✅ Profiles table exists\n');
  }

  // Step 2: Create users
  console.log('👥 Creating test users...\n');

  const createdUsers = [];

  for (const account of TEST_ACCOUNTS) {
    try {
      console.log(`   Creating: ${account.email}`);

      // Create user via Supabase Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: account.name,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('duplicate')) {
          console.log(`   ⚠️  ${account.email} already exists in auth.users`);

          // Try to get existing user
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find((u) => u.email === account.email);

          if (existingUser) {
            console.log(`   ℹ️  Found existing user: ${existingUser.id}`);
            createdUsers.push({ ...account, id: existingUser.id });

            // Try to create/update profile
            if (!tableError) {
              const { error: profileError } = await supabase.from('profiles').upsert(
                {
                  id: existingUser.id,
                  email: account.email,
                  name: account.name,
                  role: account.role,
                  roles: account.roles,
                },
                { onConflict: 'id' },
              );

              if (profileError) {
                console.log(`   ⚠️  Profile upsert failed: ${profileError.message}`);
              } else {
                console.log(`   ✅ Profile updated`);
              }
            }
          }
          continue;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation returned no data');
      }

      console.log(`   ✅ Auth user created: ${authData.user.id}`);
      createdUsers.push({ ...account, id: authData.user.id });

      // Create profile if table exists
      if (!tableError) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email: account.email,
          name: account.name,
          role: account.role,
          roles: account.roles,
        });

        if (profileError) {
          console.log(`   ⚠️  Profile creation failed: ${profileError.message}`);
        } else {
          console.log(`   ✅ Profile created with role: ${account.role}`);
        }
      }

      console.log(`   ✅ ${account.role.toUpperCase()}: ${account.email} / ${account.password}\n`);
    } catch (error) {
      console.error(`   ❌ Error creating ${account.email}:`, error.message, '\n');
    }
  }

  // Step 3: Verify
  console.log('🔍 Verifying users...\n');

  // List users from auth
  const { data: allUsers } = await supabase.auth.admin.listUsers();
  const kfaUsers = allUsers.users.filter((u) => u.email && u.email.includes('@kfa.kg'));

  console.log(`   Found ${kfaUsers.length} KFA users in auth.users:`);
  kfaUsers.forEach((user) => {
    console.log(`   - ${user.email} (${user.id})`);
  });
  console.log();

  // List profiles if table exists
  if (!tableError) {
    const { data: profiles } = await supabase.from('profiles').select('email, name, role, roles').order('email');

    if (profiles && profiles.length > 0) {
      console.log(`   Found ${profiles.length} profiles:`);
      profiles.forEach((profile) => {
        console.log(`   - ${profile.email}: ${profile.role} ${JSON.stringify(profile.roles)}`);
      });
      console.log();
    }
  }

  // Summary
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║                  SETUP COMPLETE                   ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  if (tableError) {
    console.log('⚠️  IMPORTANT: Profiles table not found!\n');
    console.log('📝 Run this SQL in Supabase Dashboard:');
    console.log('   1. Open: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql');
    console.log('   2. Copy and paste: supabase-auth-setup.sql');
    console.log('   3. Click "Run"\n');
    console.log('   Then run this script again to create profiles.\n');
  } else {
    console.log('✅ Users ready with profiles!\n');
  }

  console.log('📝 Login credentials:\n');
  TEST_ACCOUNTS.forEach((account) => {
    console.log(`   ${account.role.toUpperCase().padEnd(10)} → ${account.email} / ${account.password}`);
  });
  console.log('\n🔗 Test login at: http://localhost:3000/auth/login\n');
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
