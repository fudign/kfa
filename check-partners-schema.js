const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('Checking partners table schema...\n');

  // Get table structure
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'partners'
        AND table_schema = 'public'
      ORDER BY ordinal_position;
    `
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Partners table columns:');
  console.table(data);

  // Check if slug exists
  const hasSlug = data?.some(col => col.column_name === 'slug');
  console.log(`\n✅ Slug field exists: ${hasSlug}`);

  // Get sample partners
  const { data: partners, error: partnersError } = await supabase
    .from('partners')
    .select('id, name, slug, status')
    .limit(5);

  if (!partnersError && partners) {
    console.log('\nSample partners:');
    console.table(partners);
  }
}

checkSchema().catch(console.error);
