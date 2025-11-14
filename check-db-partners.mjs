import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'kfa-website', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPartners() {
  console.log('🔍 Checking partners in database...\n');

  const { data, error, count } = await supabase
    .from('partners')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  if (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Database is accessible but table might not exist or have wrong schema');
    process.exit(1);
  }

  console.log(`📊 Total active partners: ${count || 0}\n`);

  if (data && data.length > 0) {
    console.table(data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      slug: p.slug || '❌ NO SLUG',
      logo: p.logo ? '✅' : '❌'
    })));
  } else {
    console.log('⚠️  No partners found in database!');
    console.log('\n💡 You need to add partners via dashboard or SQL');
  }
}

checkPartners();
