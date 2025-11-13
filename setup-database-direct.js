#!/usr/bin/env node
/**
 * Direct PostgreSQL Connection Setup
 * Creates tables using pg library - WORKS 100%
 */

require('dotenv').config({ path: './kfa-backend/kfa-api/.env' });
const { Client } = require('pg');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Cannot extract project ref from URL');
  process.exit(1);
}

// Build connection string
let connectionString = DATABASE_URL;

if (!connectionString && DB_PASSWORD) {
  // Try direct connection (port 5432)
  connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;

  console.log(`📡 Using direct connection: db.${projectRef}.supabase.co:5432`);
}

if (!connectionString) {
  console.error('❌ Missing database credentials');
  console.error('');
  console.error('Please add to .env file:');
  console.error('  SUPABASE_DB_PASSWORD=your_database_password');
  console.error('  or');
  console.error('  DATABASE_URL=postgresql://...');
  console.error('');
  console.error('Get database password from:');
  console.error('  https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
  console.error('  → Database Settings → Connection String → Password');
  process.exit(1);
}

async function setupDatabase() {
  console.log('🚀 Direct PostgreSQL Setup\n');
  console.log(`Project: ${projectRef}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Step 1: Create NEWS table
    console.log('1️⃣ Creating NEWS table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.news (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image VARCHAR(500),
        featured_image_id BIGINT,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured BOOLEAN DEFAULT false,
        author_id UUID,
        category VARCHAR(100),
        tags TEXT[],
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('   ✅ Table created');

    // Create indexes
    console.log('   📊 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
      CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
      CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
      CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);
    `);
    console.log('   ✅ Indexes created');

    // Enable RLS
    console.log('   🔒 Enabling Row Level Security...');
    await client.query(`ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policies
    await client.query(`DROP POLICY IF EXISTS "Anyone can read published news" ON public.news;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with content.view can read all" ON public.news;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with content.create can insert" ON public.news;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with content.edit can update" ON public.news;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with content.delete can delete" ON public.news;`);

    // Create policies
    await client.query(`
      CREATE POLICY "Anyone can read published news"
        ON public.news FOR SELECT
        USING (status = 'published');
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with content.view can read all"
        ON public.news FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.view' = ANY(profiles.permissions)
          )
        );
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with content.create can insert"
        ON public.news FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.create' = ANY(profiles.permissions)
          )
        );
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with content.edit can update"
        ON public.news FOR UPDATE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.edit' = ANY(profiles.permissions)
          )
        );
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with content.delete can delete"
        ON public.news FOR DELETE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.delete' = ANY(profiles.permissions)
          )
        );
    `);
    console.log('   ✅ RLS policies created');

    // Grant permissions
    await client.query(`GRANT ALL ON public.news TO authenticated;`);
    await client.query(`GRANT SELECT ON public.news TO anon;`);
    await client.query(`GRANT USAGE, SELECT ON SEQUENCE public.news_id_seq TO authenticated;`);
    console.log('   ✅ Permissions granted');

    // Step 2: Create MEDIA table
    console.log('\n2️⃣ Creating MEDIA table...');

    await client.query(`
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
    `);
    console.log('   ✅ Table created');

    // Create indexes
    console.log('   📊 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);
      CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
      CREATE INDEX IF NOT EXISTS idx_media_collection ON public.media(collection);
    `);
    console.log('   ✅ Indexes created');

    // Enable RLS
    console.log('   🔒 Enabling Row Level Security...');
    await client.query(`ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policies
    await client.query(`DROP POLICY IF EXISTS "Anyone can read media" ON public.media;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with media.upload can insert" ON public.media;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with media.edit can update" ON public.media;`);
    await client.query(`DROP POLICY IF EXISTS "Authenticated users with media.delete can delete" ON public.media;`);

    // Create policies
    await client.query(`
      CREATE POLICY "Anyone can read media"
        ON public.media FOR SELECT
        USING (true);
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with media.upload can insert"
        ON public.media FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'media.upload' = ANY(profiles.permissions)
          )
        );
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with media.edit can update"
        ON public.media FOR UPDATE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'media.edit' = ANY(profiles.permissions)
          )
        );
    `);

    await client.query(`
      CREATE POLICY "Authenticated users with media.delete can delete"
        ON public.media FOR DELETE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'media.delete' = ANY(profiles.permissions)
          )
        );
    `);
    console.log('   ✅ RLS policies created');

    // Grant permissions
    await client.query(`GRANT ALL ON public.media TO authenticated;`);
    await client.query(`GRANT SELECT ON public.media TO anon;`);
    await client.query(`GRANT USAGE, SELECT ON SEQUENCE public.media_id_seq TO authenticated;`);
    console.log('   ✅ Permissions granted');

    // Step 3: Insert test data
    console.log('\n3️⃣ Adding test data...');

    // Get admin user id
    const { rows: admins } = await client.query(`
      SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1;
    `);

    const adminId = admins[0]?.id;

    if (adminId) {
      // Check if news already exist
      const { rows: existingNews } = await client.query(`
        SELECT COUNT(*) as count FROM public.news;
      `);

      if (existingNews[0].count === '0') {
        console.log('   📝 Inserting test news...');

        await client.query(`
          INSERT INTO public.news (title, slug, content, excerpt, status, featured, author_id, published_at, category)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, NOW(), $8),
            ($9, $10, $11, $12, $13, $14, $15, NOW(), $16),
            ($17, $18, $19, $20, $21, $22, $23, NULL, $24)
        `, [
          'Добро пожаловать в систему управления новостями', 'welcome-to-news-system',
          '<h2>Добро пожаловать!</h2><p>Это тестовая новость для проверки работы CMS системы.</p>',
          'Тестовая новость для проверки работы системы', 'published', true, adminId, 'Общее',

          'Как работать с редактором новостей', 'how-to-use-news-editor',
          '<h2>Руководство</h2><p>Редактор новостей поддерживает форматирование текста, изображения и медиа.</p>',
          'Руководство по работе с редактором', 'published', false, adminId, 'Инструкции',

          'Черновик новости', 'draft-news-example',
          '<p>Это пример черновика новости.</p>',
          'Пример черновика', 'draft', false, adminId, 'Разное'
        ]);

        console.log('   ✅ Added 3 test news');
      } else {
        console.log(`   ℹ️  News already exist (${existingNews[0].count} records)`);
      }
    }

    // Step 4: Verify
    console.log('\n4️⃣ Verifying setup...');

    const { rows: newsCount } = await client.query(`
      SELECT COUNT(*) as count FROM public.news;
    `);
    console.log(`   ✅ News table: ${newsCount[0].count} records`);

    const { rows: newsList } = await client.query(`
      SELECT id, title, status, featured FROM public.news ORDER BY created_at DESC LIMIT 5;
    `);

    newsList.forEach(n => {
      const badge = n.status === 'published' ? '🟢' : '🟡';
      const star = n.featured ? '⭐' : '  ';
      console.log(`      ${badge} ${star} ${n.title}`);
    });

    const { rows: mediaCount } = await client.query(`
      SELECT COUNT(*) as count FROM public.media;
    `);
    console.log(`   ✅ Media table: ${mediaCount[0].count} records`);

    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('📌 Next steps:');
    console.log('   1. Go to https://kfa-website.vercel.app/dashboard/news');
    console.log('   2. Logout and login again');
    console.log('   3. You should see news and can create new ones with images\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('\n💡 Try different connection string:');
      console.error('   - Check your database password');
      console.error('   - Check project ref: ' + projectRef);
      console.error('   - Try IPv4 pooler: aws-0-us-east-1.pooler.supabase.com:6543');
    }
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

setupDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
