// Daily briefing for El Viajero
// Self-contained - uses Node 20 built-in fetch, no npm packages
// Usage: node scripts/daily-briefing.mjs
// Env: SUPABASE_SERVICE_ROLE_KEY, EVOLUTION_API_KEY, EVOLUTION_API_URL (optional)

const SUPABASE_URL = 'https://qyvokpribmbrosafntqa.supabase.co'
const EVO_BASE = process.env.EVOLUTION_API_URL || 'http://evolution_evolution_api:8080'
const EVO_KEY = process.env.EVOLUTION_API_KEY || ''
const ADMIN = process.env.ADMIN_WHATSAPP || '595984009751'
const INSTANCE = process.env.EVOLUTION_INSTANCE || 'elviajero'

async function supabaseQuery(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error(`Supabase ${path}: ${res.status}`)
  return res.json()
}

async function sendWA(to, msg) {
  if (!EVO_KEY) { return }
  const res = await fetch(`${EVO_BASE}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: { 'apikey': EVO_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: to, text: msg, delay: 1200 })
  })
  if (!res.ok) console.error('[wa] send failed:', res.status, await res.text())
}

async function main() {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const [todayOrders, yesterdayOrders, lowStock, profiles] = await Promise.all([
    supabaseQuery(`ej_orders?select=total,status&created_at=gte.${today}`),
    supabaseQuery(`ej_orders?select=total,status&created_at=gte.${yesterday}&created_at=lt.${today}`),
    supabaseQuery(`ej_products?select=name,stock&stock=lt.5&stock=gt.0&order=stock.asc&limit=3`),
    supabaseQuery(`profiles?select=id,role&role=eq.admin&limit=10`),
  ])

  const parseNum = s => parseInt(String(s).replace(/[^0-9]/g, ''), 10) || 0
  const yRev = (yesterdayOrders || []).reduce((s, o) => s + parseNum(o.total), 0)
  const tOrders = (todayOrders || []).length

  let msg = '📊 *Resumen Diario — El Viajero*\n\n'
  msg += `🗓️ Ayer: ${(yesterdayOrders || []).length} pedidos\n`
  msg += `💰 Ingresos ayer: Gs. ${yRev.toLocaleString('es-PY')}\n`
  msg += `📦 Hoy: ${tOrders} pedidos hasta ahora\n\n`
  if (lowStock && lowStock.length > 0) {
    msg += '⚠️ *Stock bajo:*\n'
    msg += lowStock.map(p => `• ${p.name}: ${p.stock} un.`).join('\n')
    msg += '\n\n'
  }
  msg += `👥 Admins: ${(profiles || []).length} registrados\n`
  msg += `👉 Panel: https://tiendaelviajero.com.py/admin`

  console.log(msg)
  await sendWA(ADMIN, msg)
}

main().catch(e => { console.error(e); process.exit(1) })
