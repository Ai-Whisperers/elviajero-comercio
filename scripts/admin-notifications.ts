import { createClient } from '@supabase/supabase-js'
import content from '@/content/es.json'

const c = content as any
const EVOLUTION_API_BASE = process.env.EVOLUTION_API_BASE || 'http://evolution_evolution_api:8080'
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || ''
const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP || '595981234567'
const INSTANCE = process.env.WHATSAPP_INSTANCE || 'elviajero'

async function sendWhatsApp(to: string, message: string) {
  if (!EVOLUTION_API_KEY) { console.log('[wa] No API key:', message.substring(0, 80)); return }
  try {
    await fetch(`${EVOLUTION_API_BASE}/message/sendText/${INSTANCE}`, {
      method: 'POST',
      headers: { apikey: EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: to, text: message, delay: 1200 }),
    })
  } catch (e) { console.error('[wa] Error:', e) }
}

async function recoverCarts() {
  const supabase = createClient(c.supabase.url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
  const hourAgo = new Date(Date.now() - 3600000).toISOString()
  
  const { data: carts } = await supabase
    .from('ej_abandoned_carts')
    .select('*')
    .eq('recovered', false)
    .lt('reminders_sent', 2)
    .lt('created_at', hourAgo)

  if (!carts || carts.length === 0) { console.log('[cart-recovery] No carts to recover'); return }

  for (const cart of carts) {
    const msg = `👋 ¡Hola! Te recordamos que tenés productos pendientes en El Viajero.\n\nHacé tu pedido acá:\nhttps://el-viajero.paragu-ai.com/tienda\n\n¿Te ayudamos con algo? Respondé este mensaje.`
    await sendWhatsApp(cart.phone, msg)
    await supabase.from('ej_abandoned_carts').update({ reminders_sent: (cart.reminders_sent || 0) + 1 }).eq('id', cart.id)
    console.log('[cart-recovery] Sent reminder to', cart.phone)
  }
}

async function dailyBriefing() {
  const supabase = createClient(c.supabase.url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const { data: todayOrders } = await supabase.from('ej_orders').select('total, status').gte('created_at', today)
  const { data: yesterdayOrders } = await supabase.from('ej_orders').select('total, status').gte('created_at', yesterday).lt('created_at', today)
  const { data: lowStock } = await supabase.from('ej_products').select('name, stock').lt('stock', 5).gt('stock', 0).order('stock').limit(3)

  const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0
  const yRev = (yesterdayOrders || []).reduce((s: number, o: any) => s + parseNum(o.total), 0)
  const tOrders = (todayOrders || []).length
  
  let msg = `📊 *Resumen Diario — El Viajero*\n\n`
  msg += `🗓️ Ayer: ${yesterdayOrders?.length || 0} pedidos\n`
  msg += `💰 Ingresos: Gs. ${yRev.toLocaleString('es-PY')}\n`
  msg += `📦 Hoy: ${tOrders} pedidos hasta ahora\n\n`
  if (lowStock && lowStock.length > 0) {
    msg += `⚠️ *Stock bajo:*\n`
    msg += lowStock.map((p: any) => `• ${p.name}: ${p.stock} un.`).join('\n')
    msg += `\n\n`
  }
  msg += `👉 Panel: https://el-viajero.paragu-ai.com/admin`

  await sendWhatsApp(ADMIN_NUMBER, msg)
  console.log('[briefing] Sent daily briefing')
}

async function main() {
  const action = process.argv[2] || 'briefing'
  if (action === 'recover') await recoverCarts()
  else if (action === 'briefing') await dailyBriefing()
  else if (action === 'both') { await recoverCarts(); await dailyBriefing() }
  console.log(`[${action}] done`)
}

main().catch(console.error)
