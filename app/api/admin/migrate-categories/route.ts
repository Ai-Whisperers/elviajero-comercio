import { NextResponse } from 'next/server';
import { createAdminClient } from '@ai-whisperers/auth/supabase/admin';

// GET /api/admin/migrate-categories - runs migration
// Requires auth header or ?key=elviajero-migrate-2026
export async function GET(req: Request) {
  const supabase = createAdminClient();
  const results = [];
  
  // Security: check auth or secret key
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader && key !== 'elviajero-migrate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 1. Get all product categories from ej_products
  const { data: products } = await supabase.from('ej_products').select('category');
  const productCats = [...new Set((products || []).map((p: any) => p.category).filter(Boolean))].sort();
  results.push('Found ' + productCats.length + ' categories in products: ' + productCats.join(', '));
  
  // 2. Upsert each category
  for (let i = 0; i < productCats.length; i++) {
    const name = productCats[i];
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const { error } = await supabase.from('ej_categories').upsert({
      name,
      slug,
      order_index: i,
      active: true
    }, { onConflict: 'name' });
    
    if (error) results.push('ERROR upserting ' + name + ': ' + error.message);
  }
  
  // 3. Verify
  const { data: finalCats } = await supabase.from('ej_categories').select('*').order('order_index');
  const catNames = (finalCats || []).map((c: any) => c.name).join(', ');
  results.push('ej_categories now has ' + (finalCats?.length || 0) + ' rows: ' + catNames);
  
  // 4. Check ej_subcategories
  const { error: subErr } = await supabase.from('ej_subcategories').select('*').limit(1);
  if (subErr?.message.includes('does not exist')) {
    results.push('ej_subcategories: table does not exist - needs migration');
  } else {
    const { data: subs } = await supabase.from('ej_subcategories').select('*');
    results.push('ej_subcategories: ' + (subs?.length || 0) + ' rows');
  }
  
  // 5. Check ej_content_sections
  const { error: csErr } = await supabase.from('ej_content_sections').select('id').limit(1);
  if (csErr?.message.includes('does not exist')) {
    results.push('ej_content_sections: table does not exist - needs migration');
  } else {
    results.push('ej_content_sections: table exists');
  }
  
  return NextResponse.json({ status: 'done', results });
}