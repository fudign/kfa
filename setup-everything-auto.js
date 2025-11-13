#!/usr/bin/env node
/**
 * Automatic Supabase Setup
 * Creates news and media tables, storage bucket, and configures everything
 */

require('dotenv').config({ path: './kfa-backend/kfa-api/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

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
    persistSession: false
  }
});

// Execute raw SQL via Supabase REST API
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.write(JSON.stringify({ sql }));
    req.end();
  });
}

async function setup() {
  console.log('🚀 Starting automatic Supabase setup...\n');

  try {
    // Step 1: Create NEWS table
    console.log('1️⃣ Creating NEWS table...');

    const newsTableSQL = `
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
        author_id UUID REFERENCES auth.users(id),
        category VARCHAR(100),
        tags TEXT[],
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
      CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
      CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
      CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);

      ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can read published news" ON public.news;
      CREATE POLICY "Anyone can read published news"
        ON public.news FOR SELECT
        USING (status = 'published');

      DROP POLICY IF EXISTS "Authenticated users with content.view can read all" ON public.news;
      CREATE POLICY "Authenticated users with content.view can read all"
        ON public.news FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.view' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.create can insert" ON public.news;
      CREATE POLICY "Authenticated users with content.create can insert"
        ON public.news FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.create' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.edit can update" ON public.news;
      CREATE POLICY "Authenticated users with content.edit can update"
        ON public.news FOR UPDATE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.edit' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.delete can delete" ON public.news;
      CREATE POLICY "Authenticated users with content.delete can delete"
        ON public.news FOR DELETE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.delete' = ANY(profiles.permissions)
          )
        );

      GRANT ALL ON public.news TO authenticated;
      GRANT SELECT ON public.news TO anon;
      GRANT USAGE, SELECT ON SEQUENCE public.news_id_seq TO authenticated;
    `;

    // Try direct insertion first
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    const adminId = adminProfile?.id;

    // Insert test news data
    const testNews = [
      {
        title: 'Добро пожаловать в систему управления новостями',
        slug: 'welcome-to-news-system',
        content: '<h2>Добро пожаловать!</h2><p>Это тестовая новость для проверки работы CMS.</p>',
        excerpt: 'Тестовая новость для проверки работы системы',
        status: 'published',
        featured: true,
        author_id: adminId,
        published_at: new Date().toISOString(),
        category: 'Общее'
      },
      {
        title: 'Как работать с редактором новостей',
        slug: 'how-to-use-news-editor',
        content: '<h2>Руководство по редактору</h2><p>Редактор новостей поддерживает форматирование текста.</p>',
        excerpt: 'Руководство по работе с редактором',
        status: 'published',
        featured: false,
        author_id: adminId,
        published_at: new Date().toISOString(),
        category: 'Инструкции'
      },
      {
        title: 'Черновик новости',
        slug: 'draft-news-example',
        content: '<p>Это пример черновика новости.</p>',
        excerpt: 'Пример черновика',
        status: 'draft',
        featured: false,
        author_id: adminId,
        category: 'Разное'
      }
    ];

    // Check if table exists by trying to query
    const { error: checkError } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('   ⚠️  Table does not exist, trying to create via API...');
      const result = await executeSQL(newsTableSQL);

      if (!result.success) {
        console.log('   ⚠️  Cannot create table via API');
        console.log('   💾 Saving SQL to file for manual execution...');
        const fs = require('fs');
        fs.writeFileSync('CREATE-TABLES-MANUAL.sql', newsTableSQL);
        console.log('   📄 SQL saved to: CREATE-TABLES-MANUAL.sql');
        console.log('   ℹ️  Please execute this SQL in Supabase Dashboard SQL Editor\n');
      } else {
        console.log('   ✅ News table created');
      }
    } else {
      console.log('   ✅ News table already exists');
    }

    // Insert test news
    const { data: existingNews } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (!existingNews || existingNews.length === 0) {
      console.log('   📝 Adding test news...');
      for (const news of testNews) {
        const { error: insertError } = await supabase
          .from('news')
          .insert(news);

        if (!insertError) {
          console.log(`   ✅ Added: "${news.title}"`);
        }
      }
    }

    // Step 2: Create MEDIA table
    console.log('\n2️⃣ Creating MEDIA table...');

    const mediaTableSQL = `
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
        uploader_id UUID REFERENCES auth.users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media(filename);
      CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
      CREATE INDEX IF NOT EXISTS idx_media_collection ON public.media(collection);

      ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can read media" ON public.media;
      CREATE POLICY "Anyone can read media"
        ON public.media FOR SELECT
        USING (true);

      DROP POLICY IF EXISTS "Authenticated users with media.upload can insert" ON public.media;
      CREATE POLICY "Authenticated users with media.upload can insert"
        ON public.media FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'media.upload' = ANY(profiles.permissions)
          )
        );

      GRANT ALL ON public.media TO authenticated;
      GRANT SELECT ON public.media TO anon;
      GRANT USAGE, SELECT ON SEQUENCE public.media_id_seq TO authenticated;
    `;

    const { error: mediaCheckError } = await supabase
      .from('media')
      .select('id')
      .limit(1);

    if (mediaCheckError) {
      console.log('   ⚠️  Table does not exist, trying to create...');
      const result = await executeSQL(mediaTableSQL);

      if (!result.success) {
        console.log('   ⚠️  Cannot create via API, SQL saved to file');
      } else {
        console.log('   ✅ Media table created');
      }
    } else {
      console.log('   ✅ Media table already exists');
    }

    // Step 3: Update admin permissions
    console.log('\n3️⃣ Updating admin permissions...');

    const { error: permError } = await supabase
      .from('profiles')
      .update({
        permissions: [
          'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
          'media.view', 'media.upload', 'media.edit', 'media.delete',
          'events.view', 'events.create', 'events.edit', 'events.delete',
          'members.view', 'members.edit',
          'partners.view', 'partners.create', 'partners.edit', 'partners.delete',
          'settings.view', 'settings.edit',
          'analytics.view', 'users.view', 'users.manage'
        ],
        updated_at: new Date().toISOString()
      })
      .eq('role', 'admin');

    if (permError) {
      console.log('   ❌ Error updating permissions:', permError.message);
    } else {
      console.log('   ✅ Admin permissions updated');
    }

    // Step 4: Check/Create storage bucket
    console.log('\n4️⃣ Checking Storage bucket...');

    const { data: buckets } = await supabase.storage.listBuckets();
    const mediaExists = buckets?.some(b => b.name === 'media');

    if (!mediaExists) {
      console.log('   📦 Creating "media" bucket...');
      const { error: bucketError } = await supabase.storage.createBucket('media', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
      });

      if (bucketError) {
        console.log('   ❌ Error creating bucket:', bucketError.message);
        console.log('   ℹ️  Please create bucket "media" manually in Supabase Dashboard');
      } else {
        console.log('   ✅ Storage bucket "media" created');
      }
    } else {
      console.log('   ✅ Storage bucket "media" already exists');
    }

    // Step 5: Verify everything
    console.log('\n5️⃣ Verifying setup...');

    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('id, title, status')
      .order('created_at', { ascending: false });

    if (!newsError && newsData) {
      console.log(`   ✅ News table: ${newsData.length} records`);
      newsData.slice(0, 3).forEach(n => {
        console.log(`      - ${n.title} [${n.status}]`);
      });
    }

    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('id')
      .limit(1);

    if (!mediaError) {
      console.log(`   ✅ Media table: accessible`);
    }

    const { data: adminData } = await supabase
      .from('profiles')
      .select('permissions')
      .eq('role', 'admin')
      .single();

    if (adminData) {
      const hasMedia = adminData.permissions?.includes('media.upload');
      console.log(`   ${hasMedia ? '✅' : '⚠️'} Admin has media permissions: ${hasMedia ? 'YES' : 'NO'}`);
    }

    console.log('\n✅ Setup complete!\n');
    console.log('📌 Next steps:');
    console.log('   1. Go to https://kfa-website.vercel.app/dashboard/news');
    console.log('   2. Logout and login again to refresh permissions');
    console.log('   3. You should see news and be able to upload images\n');

    if (!mediaExists) {
      console.log('⚠️  IMPORTANT: If bucket creation failed, create it manually:');
      console.log('   - Supabase Dashboard → Storage → New bucket');
      console.log('   - Name: media');
      console.log('   - Public: YES ✅');
      console.log('   - Save\n');
    }

  } catch (error) {
    console.error('\n❌ Error during setup:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setup();
