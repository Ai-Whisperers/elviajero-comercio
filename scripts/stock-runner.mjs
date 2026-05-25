import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qyvokpribmbrosafntqa.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EVOLUTION_API_BASE = process.env.EVOLUTION_API_URL || 'http://evolution_evolution_api:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || '595984009751';

async function run() {
  if (!SUPABASE_KEY) {
    console.log('[stock-alert] No service role key configured');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const { data: products, error } = await supabase
    .from('ej_products')
    .select('name, stock')
    .lt('stock', 5)
    .gt('stock', 0);

  if (error) {
    console.error('[stock-alert] DB error:', error.message);
    return;
  }

  if (!products || products.length === 0) {
    console.log('[stock-alert] No low stock products — all good');
    return;
  }

  const msg = 'Productos con stock bajo:\n\n' +
    products.map(p => `- ${p.name}: ${p.stock} unidades`).join('\n') +
    '\n\nStock alerta automatica';

  console.log('[stock-alert] Low stock items found:');
  products.forEach(p => console.log(`  - ${p.name}: ${p.stock}`));

  if (EVOLUTION_API_KEY) {
    const res = await fetch(`${EVOLUTION_API_BASE}/message/sendText/elviajero`, {
      method: 'POST',
      headers: {
        'apikey': EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ number: ADMIN_WHATSAPP, text: msg, delay: 1200 })
    });
    const body = await res.text();
    if (res.ok) {
      console.log('[stock-alert] WhatsApp alert sent successfully');
    } else {
      console.error('[stock-alert] WhatsApp send failed:', res.status, body);
    }
  } else {
    console.log('[stock-alert] No Evolution API key configured — alert would be:');
    console.log(msg);
  }
}

run().catch(console.error);
