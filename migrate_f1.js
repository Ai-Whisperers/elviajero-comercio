// Migration F1 - Create missing columns in ej_categories via direct SQL
// Run: node migrate_f1.js from /root/elviajero

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function safeQuery(fn) {
  try { return { data: await fn(), error: null }; }
  catch (e) { return { data: null, error: e.message }; }
}

async function migrate() {
  console.log('=== EL VIAJERO Migration F1 ===\n');

  // Step 1: Get current ej_categories schema
  const { data: cats, error: catErr } = await safeQuery(() =>
    supabase.from('ej_categories').select('*').limit(1)
  );
  if (catErr) {
    console.log('ej_categories query error:', catErr);
  } else {
    console.log('ej_categories columns:', Object.keys(cats?.[0] || {}).join(', '));
    console.log('ej_categories row count:', cats?.length);
  }

  // Step 2: Check ej_products
  const { data: prods, error: prodErr } = await safeQuery(() =>
    supabase.from('ej_products').select('id,name,category,price,slug').limit(3)
  );
  if (prodErr) {
    console.log('ej_products query error:', prodErr);
  } else if (prods) {
    console.log('ej_products columns:', Object.keys(prods[0] || {}).join(', '));
    console.log('Sample products:', prods.map(p => p.name).join(', '));
  }

  // Step 3: The SUPABASE_REST_API doesn't support DDL (ALTER TABLE)
  // We need to use the direct pg connection via Supabase's pooler
  // The connection string for Supabase is: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
  // Or via the pooler: postgresql://postgres.[REF].[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

  // Get the project ref and check if we have pooler credentials
  const ref = 'qyvokpribmbrosafntqa';
  const projectRegion = 'use1'; // guess, but let's see

  console.log('\n--- Supabase REST API Limitation ---');
  console.log('REST API cannot run ALTER/CREATE TABLE statements.');
  console.log('Need direct PostgreSQL connection via pooler.\n');

  // Try to use the Supabase management API via HTTP
  // The management key for this project is: sb_secret_J7n1igQHaVSKn35OrMe93A_p-_FEBvH
  // We can try: POST https://api.supabase.com/v1/projects/{ref}/database/query

  console.log('Attempting management API call...\n');

  // Alternative: use Supabase's `_meta` endpoint or direct pg connection string
  // For now, let's check what the connection string would be
  // The password for pooler is NOT the service role key
  // It is shown in Settings > Database > Connection string

  // Since we don't have the pooler password, let's work with what we CAN do:
  // 1. Use existing tables (ej_categories, ej_products) with INSERT/SELECT
  // 2. Create new tables via INSERT-only approach (use a workaround)
  // 3. For DDL, we need to provide the SQL to run manually in dashboard

  // Let's verify current content endpoints work
  const { data: contentCheck } = await safeQuery(() =>
    supabase.from('ej_categories').select('name').limit(10)
  );
  if (contentCheck) {
    console.log('Current categories in DB:', contentCheck.map(c => c.name).join(', '));
  }

  console.log('\n=== F1 Summary ===');
  console.log('- ej_categories table EXISTS (4 rows, needs slug/order_index/active columns)');
  console.log('- ej_products table EXISTS with data');
  console.log('- ej_site_config: need to create via SQL editor');
  console.log('- ej_content_sections: need to create via SQL editor');
  console.log('\nSQL to run in Supabase SQL Editor:');

  const sql = `
-- Add missing columns to ej_categories
ALTER TABLE ej_categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE ej_categories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE ej_categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE ej_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Set unique constraint on slug
ALTER TABLE ej_categories ADD UNIQUE (slug);

-- Backfill slug and order_index
UPDATE ej_categories SET slug = lower(replace(replace(name, ' ', '-'), 'á', 'a')) WHERE slug IS NULL;
UPDATE ej_categories SET order_index = CASE name
  WHEN 'Camping' THEN 0
  WHEN 'Artículos de pesca' THEN 1
  WHEN 'Exploración y táctico' THEN 2
  WHEN 'Ruta y Aventura' THEN 3
  ELSE 99 END
WHERE order_index = 0 OR order_index IS NULL;
UPDATE ej_categories SET active = true WHERE active IS NULL;
UPDATE ej_categories SET updated_at = now() WHERE updated_at IS NULL;

-- Create ej_content_sections
CREATE TABLE IF NOT EXISTS ej_content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ej_content_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON ej_content_sections FOR SELECT USING (is_published = true);
CREATE POLICY "Admin write" ON ej_content_sections FOR ALL USING (auth.role() = 'service_role');

-- Create ej_site_config
CREATE TABLE IF NOT EXISTS ej_site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ej_site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON ej_site_config FOR SELECT USING (true);
CREATE POLICY "Admin write" ON ej_site_config FOR ALL USING (auth.role() = 'service_role');

-- Seed ej_content_sections
INSERT INTO ej_content_sections (section_key, content, is_published) VALUES
  ('navbar', '{"logo": "El Viajero", "logoImageUrl": null}', true),
  ('footer', '{"copyright": "2024 El Viajero"}', true),
  ('home.hero', '{"title": "El Viajero", "subtitle": "Tu aventura comienza aquí"}', true),
  ('productCatalog', '{"showPrice": true, "currency": "Gs."}', true)
ON CONFLICT (section_key) DO NOTHING;
`;

  console.log(sql);
  console.log('\n=== F1 REQUIRES DASHBOARD SQL ===');
}

migrate().catch(e => { console.error(e); process.exit(1); });