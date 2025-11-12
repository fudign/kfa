#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?sslmode=require`;

console.log('Connecting to Supabase PostgreSQL...\n');

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Drop table if exists
    console.log('Dropping existing table if any...');
    await client.query(`DROP TABLE IF EXISTS membership_applications CASCADE;`);
    console.log('✅ Old table dropped\n');

    // Create table
    console.log('Creating membership_applications table...');
    await client.query(`
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
    `);
    console.log('✅ Table created\n');

    // Create indexes
    console.log('Creating indexes...');
    await client.query(`CREATE INDEX idx_membership_applications_email ON membership_applications(email);`);
    await client.query(`CREATE INDEX idx_membership_applications_status ON membership_applications(status);`);
    console.log('✅ Indexes created\n');

    // Create updated_at trigger
    console.log('Creating triggers...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      CREATE TRIGGER update_membership_applications_updated_at
        BEFORE UPDATE ON membership_applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Triggers created\n');

    // Verify table
    const result = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'membership_applications'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Table structure:');
    console.log('---------------------------------------------------');
    result.rows.forEach((row) => {
      console.log(`  ${row.column_name.padEnd(25)} ${row.data_type.padEnd(20)} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('---------------------------------------------------\n');

    // Create other required tables if needed
    console.log('Checking for other required tables...\n');

    // Users table
    const { rows: usersTables } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users';
    `);

    if (usersTables.length === 0) {
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          email_verified_at TIMESTAMP NULL,
          password VARCHAR(255) NOT NULL,
          remember_token VARCHAR(100) NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table created\n');
    } else {
      console.log('✅ Users table already exists\n');
    }

    // Sessions table
    const { rows: sessionsTables } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'sessions';
    `);

    if (sessionsTables.length === 0) {
      console.log('Creating sessions table...');
      await client.query(`
        CREATE TABLE sessions (
          id VARCHAR(255) PRIMARY KEY,
          user_id BIGINT NULL,
          ip_address VARCHAR(45) NULL,
          user_agent TEXT NULL,
          payload TEXT NOT NULL,
          last_activity INTEGER NOT NULL
        );
        CREATE INDEX sessions_user_id_index ON sessions(user_id);
        CREATE INDEX sessions_last_activity_index ON sessions(last_activity);
      `);
      console.log('✅ Sessions table created\n');
    } else {
      console.log('✅ Sessions table already exists\n');
    }

    // Personal access tokens table (for Sanctum)
    const { rows: tokensTables } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'personal_access_tokens';
    `);

    if (tokensTables.length === 0) {
      console.log('Creating personal_access_tokens table...');
      await client.query(`
        CREATE TABLE personal_access_tokens (
          id BIGSERIAL PRIMARY KEY,
          tokenable_type VARCHAR(255) NOT NULL,
          tokenable_id BIGINT NOT NULL,
          name VARCHAR(255) NOT NULL,
          token VARCHAR(64) NOT NULL UNIQUE,
          abilities TEXT NULL,
          last_used_at TIMESTAMP NULL,
          expires_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index
          ON personal_access_tokens(tokenable_type, tokenable_id);
      `);
      console.log('✅ Personal access tokens table created\n');
    } else {
      console.log('✅ Personal access tokens table already exists\n');
    }

    console.log('🎉 Database setup complete!\n');
    console.log('You can now run your Laravel application.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
