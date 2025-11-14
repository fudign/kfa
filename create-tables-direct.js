#!/usr/bin/env node
/**
 * Create tables directly using Supabase Management API
 */

require('dotenv').config({ path: './kfa-backend/kfa-api/.env' });
const https = require('https');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Cannot extract project ref from URL');
  process.exit(1);
}

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`   Response status: ${res.statusCode}`);
        if (responseData) {
          console.log(`   Response: ${responseData}`);
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: responseData });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   Request error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

async function createTables() {
  console.log('🔧 Creating tables via Management API...\n');
  console.log(`Project: ${projectRef}`);

  // Simplified SQL - one table at a time
  const newsSQL = `
    CREATE TABLE IF NOT EXISTS public.news (
      id BIGSERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      image VARCHAR(500),
      featured_image_id BIGINT,
      status VARCHAR(20) DEFAULT 'draft',
      featured BOOLEAN DEFAULT false,
      author_id UUID,
      category VARCHAR(100),
      tags TEXT[],
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "Allow public read published" ON public.news
      FOR SELECT USING (status = 'published');
  `;

  const mediaSQL = `
    CREATE TABLE IF NOT EXISTS public.media (
      id BIGSERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      path VARCHAR(500) NOT NULL,
      url TEXT NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size BIGINT NOT NULL,
      width INTEGER,
      height INTEGER,
      alt_text VARCHAR(255),
      description TEXT,
      collection VARCHAR(100),
      uploader_id UUID,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "Allow public read all" ON public.media
      FOR SELECT USING (true);
  `;

  console.log('\n1️⃣ Creating NEWS table...');
  const newsResult = await executeSQL(newsSQL);

  if (newsResult.success) {
    console.log('   ✅ News table created or already exists');
  } else {
    console.log('   ❌ Failed to create news table');
    console.log('   💡 Tables must be created manually in Supabase Dashboard');
    console.log('\n📄 SQL scripts are ready in:');
    console.log('   - CREATE-NEWS-TABLE.sql');
    console.log('   - CREATE-MEDIA-TABLE.sql\n');
    return false;
  }

  console.log('\n2️⃣ Creating MEDIA table...');
  const mediaResult = await executeSQL(mediaSQL);

  if (mediaResult.success) {
    console.log('   ✅ Media table created or already exists');
  } else {
    console.log('   ❌ Failed to create media table');
  }

  return newsResult.success && mediaResult.success;
}

createTables().then((success) => {
  if (success) {
    console.log('\n✅ Tables created successfully!');
    console.log('\n📌 Now run: node setup-everything-auto.js');
  } else {
    console.log('\n⚠️  Automatic creation failed.');
    console.log('\n📋 Please execute SQL manually:');
    console.log('   1. Open: https://supabase.com/dashboard');
    console.log('   2. Go to: SQL Editor');
    console.log('   3. Run: CREATE-NEWS-TABLE.sql');
    console.log('   4. Run: CREATE-MEDIA-TABLE.sql');
    console.log('   5. Run: node setup-everything-auto.js again\n');
  }
});
