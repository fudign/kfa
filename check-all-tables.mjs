import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'kfa-website', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAllTables() {
  console.log('🔍 Checking all database tables...\n');

  const tables = [
    'partners',
    'news',
    'events',
    'members',
    'media',
    'settings',
    'registrations',
    'certificates',
    'documents',
  ];

  const results = [];

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      results.push({
        table,
        status: '❌',
        message: `Error: ${error.message}`,
        count: 0
      });
    } else {
      results.push({
        table,
        status: '✅',
        message: 'Table exists',
        count: count || 0
      });
    }
  }

  // Вывод результатов
  console.log('📊 Database Tables Status:\n');
  console.log('TABLE NAME          STATUS  RECORDS  NOTES');
  console.log('─────────────────── ─────── ──────── ─────────────────────');

  results.forEach(r => {
    const name = r.table.padEnd(20);
    const status = r.status.padEnd(8);
    const count = String(r.count).padEnd(9);
    const msg = r.status === '❌' ? 'NOT FOUND' : r.count === 0 ? 'Empty' : 'Has data';
    console.log(`${name}${status}${count}${msg}`);
  });

  console.log('\n📝 Summary:');
  const working = results.filter(r => r.status === '✅').length;
  const missing = results.filter(r => r.status === '❌').length;
  const withData = results.filter(r => r.status === '✅' && r.count > 0).length;

  console.log(`   ✅ Working tables: ${working}/${tables.length}`);
  console.log(`   ❌ Missing tables: ${missing}/${tables.length}`);
  console.log(`   📊 Tables with data: ${withData}/${tables.length}`);

  if (missing > 0) {
    console.log('\n💡 Missing tables need to be created.');
    console.log('   These features will not work until tables are set up.');
  }

  return results;
}

checkAllTables().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
