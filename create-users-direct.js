#!/usr/bin/env node
/**
 * Create Supabase Test Users
 * Connects directly to Supabase via Admin API and PostgreSQL
 */

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config();

// Supabase credentials from .env
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// PostgreSQL connection (for profiles table)
const DB_HOST = 'db.eofneihisbhucxcydvac.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASSWORD = 'egD.SYGb.F5Hm3r';

// Test accounts to create
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
  console.log('║   Supabase User Creation - Direct Connection     ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Step 1: Connect to PostgreSQL
  console.log('📡 Step 1: Connecting to PostgreSQL...');
  const pgClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL\n');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('\n💡 Trying Session Pooler instead...');

    // Fallback to session pooler
    pgClient.host = 'aws-0-ap-southeast-1.pooler.supabase.com';
    pgClient.port = 5432;

    try {
      await pgClient.connect();
      console.log('✅ Connected via Session Pooler\n');
    } catch (poolerError) {
      console.error('❌ Session Pooler also failed:', poolerError.message);
      console.log('\n⚠️  Skipping PostgreSQL setup. Will use Supabase Admin API only.\n');
    }
  }

  // Step 2: Create profiles table (if doesn't exist)
  console.log('📊 Step 2: Creating profiles table...');
  try {
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'member',
        roles TEXT[] DEFAULT ARRAY['member'],
        permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pgClient.query(`
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    `);

    console.log('✅ Profiles table ready\n');
  } catch (error) {
    console.log('⚠️  Profiles table creation skipped:', error.message);
    console.log('💡 You may need to run SQL script manually in Supabase Dashboard\n');
  }

  // Step 3: Create Supabase Admin client
  console.log('🔑 Step 3: Creating Supabase Admin client...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✅ Supabase Admin client ready\n');

  // Step 4: Create test users
  console.log('👥 Step 4: Creating test users...\n');

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
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️  ${account.email} already exists`);

          // Try to get existing user
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === account.email);

          if (existingUser) {
            // Update profile for existing user
            try {
              await pgClient.query(`
                INSERT INTO public.profiles (id, email, name, role, roles)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id)
                DO UPDATE SET
                  name = EXCLUDED.name,
                  role = EXCLUDED.role,
                  roles = EXCLUDED.roles;
              `, [existingUser.id, account.email, account.name, account.role, account.roles]);

              console.log(`   ✅ Updated profile for ${account.email}`);
            } catch (profileError) {
              console.log(`   ⚠️  Could not update profile: ${profileError.message}`);
            }
          }
          continue;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation returned no data');
      }

      console.log(`   ✅ Created auth user: ${authData.user.id}`);

      // Create profile in profiles table
      try {
        await pgClient.query(`
          INSERT INTO public.profiles (id, email, name, role, roles)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id)
          DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            roles = EXCLUDED.roles;
        `, [authData.user.id, account.email, account.name, account.role, account.roles]);

        console.log(`   ✅ Created profile with role: ${account.role}`);
      } catch (profileError) {
        console.log(`   ⚠️  Profile creation skipped: ${profileError.message}`);
      }

      console.log(`   ✅ ${account.role.toUpperCase()}: ${account.email} / ${account.password}\n`);
    } catch (error) {
      console.error(`   ❌ Error creating ${account.email}:`, error.message, '\n');
    }
  }

  // Step 5: Verify users created
  console.log('🔍 Step 5: Verifying users...\n');

  try {
    const { data: profiles, error } = await pgClient.query('SELECT email, name, role, roles FROM public.profiles ORDER BY email');

    if (error) throw error;

    if (profiles && profiles.rows && profiles.rows.length > 0) {
      console.log('   Users in database:');
      profiles.rows.forEach(user => {
        console.log(`   - ${user.email}: ${user.role} ${JSON.stringify(user.roles)}`);
      });
      console.log();
    } else {
      console.log('   ⚠️  No users found in profiles table');
      console.log('   💡 Run the SQL script in Supabase Dashboard to set up the schema\n');
    }
  } catch (error) {
    console.log('   ⚠️  Could not verify profiles:', error.message, '\n');
  }

  // Cleanup
  try {
    await pgClient.end();
  } catch (error) {
    // Ignore cleanup errors
  }

  // Summary
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║                  SETUP COMPLETE                   ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  console.log('✅ Test users ready!\n');
  console.log('📝 Login credentials:\n');
  TEST_ACCOUNTS.forEach(account => {
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
    process.exit(1);
  });
