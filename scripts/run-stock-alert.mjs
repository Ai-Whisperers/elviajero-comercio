const SUPABASE_URL = 'https://qyvokpribmbrosafntqa.supabase.co';
const SERVICE_KEY = 'sb_secret_J7n1igQHaVSKn35OrMe93A_p-_FEBvH';
const EVO_API_KEY = 'EVOLUT...8080';
const ADMIN_NUMBER = '595981234567';
const EVO_API_URL = 'http://evolution_evolution_api:8080';

async function run() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ej_products?select=name,stock&stock=lt.5&stock=gt.0`, {
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Accept': 'application/json' }
  });
  if (!res.ok) { console.error('[stock-alert] DB query failed:', res.status); process.exit(1); }
  const products = await res.json();
  if (!products || products.length === 0) { console.log('[stock-alert] No low stock products'); process.exit(0); }
  console.log(`[stock-alert] Found ${products.length} low stock products`);
  const msg = '⚠️ *Stock Bajo - El Viajero*\n\n' + products.map((p, i) => `${i+1}. *${p.name}*: ${p.stock} uds`).join('\n') + '\n\nReponer ASAP.';
  const evoRes = await fetch(`${EVO_API_URL}/message/sendText/elviajero`, {
    method: 'POST',
    headers: { 'apikey': EVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: ADMIN_NUMBER, text: msg, delay: 1200 })
  });
  const result = await evoRes.text();
  console.log('[stock-alert] WhatsApp alert sent:', result.substring(0, 150));
}
run().catch(err => { console.error('[stock-alert] Error:', err.message); process.exit(1); });
