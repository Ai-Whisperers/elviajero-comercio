require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function run() {
  console.log('Migration start');
  const { data: cats, error: ce } = await supabase.from('ej_categories').select('*');
  console.log('existing cats:', cats?.length, ce?.message || '');
  const { data: prods } = await supabase.from('ej_products').select('category').limit(50);
  const productCats = [...new Set((prods||[]).map(p=>p.category).filter(Boolean))].sort();
  console.log('product cats in DB:', productCats.join(', '));
  for (let i=0; i<productCats.length; i++) {
    const name = productCats[i];
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    await supabase.from('ej_categories').upsert({name, slug, order_index: i, active: true}, {onConflict:'name'});
  }
  const { data: final } = await supabase.from('ej_categories').select('*').order('order_index');
  console.log('final cats:', final?.map(c=>c.name).join(', '));
  console.log('DONE');
}
run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
