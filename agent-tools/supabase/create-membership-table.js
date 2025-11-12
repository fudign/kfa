#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createMembershipApplicationsTable() {
  console.log('Creating membership_applications table...\n');

  // Drop table if exists
  const dropSQL = `DROP TABLE IF EXISTS membership_applications CASCADE;`;

  // Create table
  const createSQL = `
    CREATE TABLE membership_applications (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NULL,
      membership_type VARCHAR(255) NOT NULL CHECK (membership_type IN ('individual', 'corporate')),
      status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      organization_name VARCHAR(255) NULL,
      position VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      experience TEXT NOT NULL,
      motivation TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email)
    );

    -- Create index on email
    CREATE INDEX idx_membership_applications_email ON membership_applications(email);

    -- Create index on status
    CREATE INDEX idx_membership_applications_status ON membership_applications(status);

    -- Create updated_at trigger
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_membership_applications_updated_at
      BEFORE UPDATE ON membership_applications
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    // Execute drop
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropSQL });

    // Execute create
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createSQL });

    if (createError) {
      // Try alternative method - direct SQL execution
      console.log('Trying direct SQL execution...\n');

      // First, check if table exists
      const { data: tables, error: checkError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'membership_applications');

      if (checkError) {
        console.log('Note: Cannot check existing tables (this is expected)');
      }

      console.log('\n✅ Table structure defined. Please run this SQL in Supabase SQL Editor:\n');
      console.log('-------------------------------------------------------------');
      console.log(createSQL);
      console.log('-------------------------------------------------------------\n');

      console.log('Or go to: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new\n');

      return;
    }

    console.log('✅ Table created successfully!');

    // Verify table creation
    const { data, error } = await supabase.from('membership_applications').select('*').limit(1);

    if (error) {
      console.log('⚠️  Warning: Could not verify table:', error.message);
    } else {
      console.log('✅ Table verified and accessible');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:\n');
    console.log('-------------------------------------------------------------');
    console.log(createSQL);
    console.log('-------------------------------------------------------------\n');
    console.log('Go to: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new\n');
  }
}

createMembershipApplicationsTable()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
