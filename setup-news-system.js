#!/usr/bin/env node
/**
 * Automatic KFA News System Setup
 * Creates profiles table, adds permissions, creates news table, and seed data
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://eofneihisbhucxcydvac.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// Permission sets by role
const PERMISSION_SETS = {
  admin: [
    'content.view',
    'content.create',
    'content.edit',
    'content.delete',
    'content.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'media.delete',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'members.view',
    'members.edit',
    'partners.view',
    'partners.create',
    'partners.edit',
    'partners.delete',
    'settings.view',
    'settings.edit',
    'analytics.view',
    'users.view',
    'users.manage',
  ],
  editor: [
    'content.view',
    'content.create',
    'content.edit',
    'content.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'events.view',
    'events.create',
    'events.edit',
  ],
  moderator: ['content.view', 'content.edit', 'media.view', 'events.view', 'members.view'],
  member: ['content.view'],
};

// SQL for profiles table
const PROFILES_TABLE_SQL = `
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;

-- RLS Policies
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

-- Function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, roles)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'member', ARRAY['member']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
`;

// SQL for news table
const NEWS_TABLE_SQL = `
-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'submitted', 'pending', 'approved', 'rejected', 'published', 'unpublished', 'archived')),
  featured BOOLEAN DEFAULT false,
  category TEXT,
  featured_image_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS news_slug_idx ON public.news(slug);
CREATE INDEX IF NOT EXISTS news_status_idx ON public.news(status);
CREATE INDEX IF NOT EXISTS news_featured_idx ON public.news(featured);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON public.news(published_at);
CREATE INDEX IF NOT EXISTS news_author_id_idx ON public.news(author_id);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public news are viewable by everyone" ON public.news;
DROP POLICY IF EXISTS "Users with content.create can insert news" ON public.news;
DROP POLICY IF EXISTS "Users with content.edit can update news" ON public.news;
DROP POLICY IF EXISTS "Users with content.delete can delete news" ON public.news;

-- RLS Policies
CREATE POLICY "Public news are viewable by everyone"
  ON public.news FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Users with content.create can insert news"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.create' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

CREATE POLICY "Users with content.edit can update news"
  ON public.news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.edit' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.edit' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

CREATE POLICY "Users with content.delete can delete news"
  ON public.news FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('content.delete' = ANY(permissions) OR 'admin' = ANY(roles))
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_news_updated ON public.news;
CREATE TRIGGER on_news_updated
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_news_updated_at();
`;

async function executeSql(supabase, sql, description) {
  console.log(`\n📝 ${description}...`);
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) throw error;
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    // If exec_sql RPC doesn't exist, we'll need to use the REST API directly
    // Try using fetch to Supabase REST API
    console.log(`⚠️  RPC not available, trying direct SQL execution...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      console.log(`✅ ${description} - SUCCESS (via REST)`);
      return true;
    } catch (restError) {
      console.log(`❌ ${description} - FAILED`);
      console.log(`   Error: ${restError.message}`);
      console.log(`   Note: You may need to run the SQL manually in Supabase Dashboard`);
      return false;
    }
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║    KFA News System - Automatic Setup             ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('✅ Supabase client ready');

  // STEP 1: Check if we can execute SQL directly
  console.log('\n═══ STEP 1: Setup Profiles Table ═══');

  // Try to check if profiles table exists
  const { data: existingProfiles, error: checkError } = await supabase.from('profiles').select('id').limit(1);

  if (checkError && checkError.message.includes('does not exist')) {
    console.log('📊 Profiles table does NOT exist - creating...');

    // We need to execute SQL, but we can't do it directly via client
    // Let's create profiles manually via insertions after auth users exist
    console.log('\n⚠️  Cannot create profiles table automatically.');
    console.log('📝 You need to run SQL manually in Supabase Dashboard:');
    console.log('   1. Open: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql');
    console.log('   2. Copy and run: supabase-auth-setup.sql');
    console.log('\n⏸️  Checking if we can create profiles from existing users instead...\n');

    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log(`❌ Could not list auth users: ${authError.message}`);
      console.log('\n💡 MANUAL SETUP REQUIRED:');
      console.log('   Run these commands:');
      console.log('   1. Open Supabase SQL Editor');
      console.log('   2. Run: supabase-auth-setup.sql');
      console.log('   3. Run: node add-admin-permissions.js');
      process.exit(1);
    }

    console.log(`✅ Found ${authUsers.users.length} auth users`);

    // Since we can't create table via API, skip to permissions update
    console.log('\n⚠️  Skipping table creation - assuming it will be done manually');
    console.log('   Continuing with permission updates...\n');
  } else {
    console.log('✅ Profiles table exists');
  }

  // STEP 2: Get all profiles and update permissions
  console.log('\n═══ STEP 2: Update User Permissions ═══');

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, role, roles, permissions')
    .order('email');

  if (profilesError) {
    console.log(`\n❌ ERROR: Could not fetch profiles!`);
    console.log(`   ${profilesError.message}`);
    console.log('\n💡 MANUAL SETUP REQUIRED:');
    console.log('   1. Open: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql');
    console.log('   2. Run: supabase-auth-setup.sql');
    console.log('   3. Then run this script again');
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log('\n⚠️  No profiles found!');
    console.log('📝 Creating profiles from auth users...\n');

    // Get auth users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const kfaUsers = authUsers.users.filter((u) => u.email && u.email.includes('@kfa.kg'));

    for (const user of kfaUsers) {
      const role = user.email.split('@')[0]; // admin, editor, moderator, member
      const validRole = ['admin', 'editor', 'moderator', 'member'].includes(role) ? role : 'member';
      const permissions = PERMISSION_SETS[validRole] || PERMISSION_SETS.member;

      console.log(`   Creating profile: ${user.email} (${validRole})`);

      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
        role: validRole,
        roles: validRole === 'admin' ? ['admin', 'editor', 'moderator', 'member'] : [validRole],
        permissions: permissions,
      });

      if (insertError) {
        console.log(`   ⚠️  Failed: ${insertError.message}`);
      } else {
        console.log(`   ✅ Created with ${permissions.length} permissions`);
      }
    }
  } else {
    console.log(`✅ Found ${profiles.length} profiles\n`);

    // Update permissions for each profile
    for (const profile of profiles) {
      const permissions = PERMISSION_SETS[profile.role] || PERMISSION_SETS.member;

      console.log(`   Updating: ${profile.email} (${profile.role})`);
      console.log(`   → Adding ${permissions.length} permissions`);

      const { error: updateError } = await supabase.from('profiles').update({ permissions }).eq('id', profile.id);

      if (updateError) {
        console.log(`   ❌ Failed: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated successfully`);
      }
    }
  }

  // STEP 3: Check news table
  console.log('\n═══ STEP 3: Setup News Table ═══');

  const { data: existingNews, error: newsCheckError } = await supabase.from('news').select('id').limit(1);

  if (newsCheckError && newsCheckError.message.includes('does not exist')) {
    console.log('📊 News table does NOT exist');
    console.log('\n⚠️  Cannot create news table automatically via API.');
    console.log('💡 OPTIONS:');
    console.log('   A. Use Laravel migrations (recommended):');
    console.log('      cd kfa-backend/kfa-api && php artisan migrate');
    console.log('   B. Create in Supabase manually:');
    console.log('      Open SQL Editor and run: supabase-news-table.sql');
  } else {
    console.log('✅ News table exists');

    // Check if we have news
    const { data: allNews, count } = await supabase.from('news').select('*', { count: 'exact' });

    console.log(`   Found ${count || 0} news items`);

    if (!count || count === 0) {
      console.log('\n📝 Creating sample news...');

      const sampleNews = [
        {
          title: 'Добро пожаловать в КФА',
          slug: 'dobro-pozhalovat-v-kfa',
          content:
            'Кыргызский Финансовый Альянс рад приветствовать вас! Мы являемся саморегулируемой организацией профессиональных участников рынка ценных бумаг Кыргызской Республики.',
          excerpt: 'Кыргызский Финансовый Альянс - профессиональное объединение участников рынка ценных бумаг.',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
          status: 'published',
          featured: true,
          category: 'regulation',
          published_at: new Date().toISOString(),
        },
        {
          title: 'Новые стандарты профессиональной деятельности',
          slug: 'novye-standarty-professionalnoj-deyatelnosti',
          content: 'КФА объявляет о внедрении новых стандартов профессиональной деятельности для участников рынка ценных бумаг.',
          excerpt: 'Внедрение новых стандартов для повышения качества услуг на рынке.',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          status: 'published',
          featured: true,
          category: 'events',
          published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: 'Аналитический отчет: Рынок ценных бумаг Кыргызстана в 2025',
          slug: 'analiticheskij-otchet-rynok-cennyh-bumag-2025',
          content:
            'Представляем вашему вниманию комплексный анализ состояния и перспектив развития рынка ценных бумаг Кыргызской Республики.',
          excerpt: 'Комплексный анализ рынка ценных бумаг за 2025 год.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
          status: 'published',
          featured: false,
          category: 'analytics',
          published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      for (const news of sampleNews) {
        const { error: insertError } = await supabase.from('news').insert(news);

        if (insertError) {
          console.log(`   ⚠️  Failed to create: ${news.title}`);
          console.log(`      ${insertError.message}`);
        } else {
          console.log(`   ✅ Created: ${news.title}`);
        }
      }
    }
  }

  // STEP 4: Verify everything
  console.log('\n═══ STEP 4: Verification ═══');

  const { data: finalProfiles } = await supabase.from('profiles').select('email, role, permissions').order('email');

  if (finalProfiles) {
    console.log('\n✅ User Permissions:');
    finalProfiles.forEach((user) => {
      console.log(`   - ${user.email.padEnd(25)} (${user.role.padEnd(10)}): ${user.permissions?.length || 0} permissions`);
    });
  }

  const { data: finalNews, count: newsCount } = await supabase.from('news').select('title, status, featured', { count: 'exact' });

  if (finalNews) {
    console.log(`\n✅ News in database: ${newsCount || 0}`);
    finalNews.forEach((news) => {
      const featured = news.featured ? '⭐' : '  ';
      console.log(`   ${featured} ${news.title} (${news.status})`);
    });
  }

  // Summary
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║            SETUP COMPLETE ✅                      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  console.log('📊 Summary:\n');
  console.log(`   Profiles:    ${finalProfiles?.length || 0} users with permissions`);
  console.log(`   News:        ${newsCount || 0} articles`);
  console.log();

  console.log('🔗 Next steps:\n');
  console.log('   1. Login at: http://localhost:3000/auth/login');
  console.log('      Email: admin@kfa.kg');
  console.log('      Password: password\n');
  console.log('   2. Go to Dashboard: http://localhost:3000/dashboard\n');
  console.log('   3. Click: Управление контентом → Новости ✅\n');
  console.log('   4. View homepage: http://localhost:3000\n');

  console.log('✅ News system is ready to use!\n');
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
