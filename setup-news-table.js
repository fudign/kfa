#!/usr/bin/env node
/**
 * Setup News Table in Supabase
 * Creates table, RLS policies, and test data
 */

require('dotenv').config({ path: './kfa-backend/kfa-api/.env' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupNewsTable() {
  console.log('🔧 Setting up news table in Supabase...\n');

  try {
    // 1. Check if table exists by trying to query it
    console.log('1️⃣ Checking if news table exists...');
    const { data: existing, error: checkError } = await supabase.from('news').select('id').limit(1);

    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it via SQL
      console.log('   ❌ Table does not exist, creating...');

      const createTableSQL = `
        -- Create news table
        CREATE TABLE IF NOT EXISTS news (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          image VARCHAR(500),
          featured_image_id BIGINT,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          featured BOOLEAN DEFAULT false,
          author_id UUID REFERENCES auth.users(id),
          category VARCHAR(100),
          tags TEXT[],
          published_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
        CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
        CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
        CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);

        -- Enable RLS
        ALTER TABLE news ENABLE ROW LEVEL SECURITY;

        -- RLS Policy: Anyone can read published news
        CREATE POLICY "Anyone can read published news"
          ON news FOR SELECT
          USING (status = 'published');

        -- RLS Policy: Authenticated users with content.view can read all news
        CREATE POLICY "Authenticated users with content.view can read all news"
          ON news FOR SELECT
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND 'content.view' = ANY(profiles.permissions)
            )
          );

        -- RLS Policy: Authenticated users with content.create can insert
        CREATE POLICY "Authenticated users with content.create can insert"
          ON news FOR INSERT
          TO authenticated
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND 'content.create' = ANY(profiles.permissions)
            )
          );

        -- RLS Policy: Authenticated users with content.edit can update
        CREATE POLICY "Authenticated users with content.edit can update"
          ON news FOR UPDATE
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND 'content.edit' = ANY(profiles.permissions)
            )
          );

        -- RLS Policy: Authenticated users with content.delete can delete
        CREATE POLICY "Authenticated users with content.delete can delete"
          ON news FOR DELETE
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND 'content.delete' = ANY(profiles.permissions)
            )
          );
      `;

      // Execute SQL via RPC or direct query
      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL }).catch(() => {
        // If RPC doesn't exist, we need to create table manually
        return { error: { message: 'Cannot create table via API. Please run SQL in Supabase Dashboard.' } };
      });

      if (sqlError) {
        console.log('   ⚠️  Cannot create table automatically.');
        console.log('   📋 Please run the SQL script in Supabase Dashboard:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(createTableSQL);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Save SQL to file
        const fs = require('fs');
        const sqlFile = 'CREATE-NEWS-TABLE.sql';
        fs.writeFileSync(sqlFile, createTableSQL);
        console.log(`   💾 SQL saved to: ${sqlFile}\n`);

        console.log('After running the SQL, run this script again to add test data.\n');
        return;
      }

      console.log('   ✅ Table created successfully');
    } else {
      console.log('   ✅ Table already exists');
    }

    // 2. Check if there's any data
    console.log('\n2️⃣ Checking existing news...');
    const { data: newsCount, error: countError } = await supabase.from('news').select('id', { count: 'exact', head: true });

    if (countError) throw countError;

    console.log(`   📊 Found ${newsCount?.length || 0} news items`);

    // 3. Add test data if empty
    if (!newsCount || newsCount.length === 0) {
      console.log('\n3️⃣ Adding test news data...');

      // Get admin user
      const { data: profiles } = await supabase.from('profiles').select('id, email').eq('role', 'admin').limit(1);

      const authorId = profiles?.[0]?.id;

      const testNews = [
        {
          title: 'Добро пожаловать в систему управления новостями',
          slug: 'welcome-to-news-system',
          content:
            '<p>Это тестовая новость для проверки работы CMS.</p><p>Вы можете редактировать, публиковать и удалять новости через панель управления.</p>',
          excerpt: 'Тестовая новость для проверки работы системы',
          status: 'published',
          featured: true,
          author_id: authorId,
          published_at: new Date().toISOString(),
          category: 'Общее',
        },
        {
          title: 'Как работать с редактором новостей',
          slug: 'how-to-use-news-editor',
          content: '<p>Редактор новостей поддерживает форматирование текста, добавление изображений и медиа файлов.</p>',
          excerpt: 'Руководство по работе с редактором',
          status: 'published',
          featured: false,
          author_id: authorId,
          published_at: new Date().toISOString(),
          category: 'Инструкции',
        },
        {
          title: 'Черновик новости',
          slug: 'draft-news-example',
          content: '<p>Это пример черновика новости. Она не отображается на сайте до публикации.</p>',
          excerpt: 'Пример черновика',
          status: 'draft',
          featured: false,
          author_id: authorId,
          category: 'Разное',
        },
      ];

      for (const news of testNews) {
        const { error: insertError } = await supabase.from('news').insert(news);

        if (insertError) {
          console.error(`   ❌ Error adding "${news.title}":`, insertError.message);
        } else {
          console.log(`   ✅ Added: "${news.title}" [${news.status}]`);
        }
      }
    }

    // 4. Verify final state
    console.log('\n4️⃣ Final verification...');
    const { data: allNews, error: verifyError } = await supabase
      .from('news')
      .select('id, title, status, featured')
      .order('created_at', { ascending: false });

    if (verifyError) throw verifyError;

    console.log(`\n📰 News in database (${allNews?.length || 0} total):`);
    if (allNews && allNews.length > 0) {
      allNews.forEach((news) => {
        const badge = news.status === 'published' ? '🟢' : news.status === 'draft' ? '🟡' : '⚪';
        const star = news.featured ? '⭐' : '  ';
        console.log(`   ${badge} ${star} ${news.title} [${news.status}]`);
      });
    }

    console.log('\n✅ News table setup complete!');
    console.log('\n📌 Next steps:');
    console.log('   1. Go to https://kfa-website.vercel.app/dashboard/news');
    console.log('   2. Logout and login again to refresh permissions');
    console.log('   3. You should see the news manager interface\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupNewsTable();
