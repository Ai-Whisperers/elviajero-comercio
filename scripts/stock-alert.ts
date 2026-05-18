import { createClient } from '@supabase/supabase-js'
import content from '@/content/es.json'

const c = content as any
const EVOLUTION_API_BASE = process.env.EVOLUTION_API_URL || "http://evolution_evolution_api:8080"
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || ''

async function run() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('[stock-alert] No service role key configured')
    return
  }

  const supabase = createClient(c.supabase.url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const { data: products } = await supabase.from('ej_products').select('name, stock').lt('stock', 5).gt('stock', 0)
  if (!products || products.length === 0) { console.log('[stock-alert] No low stock products'); return }

  const adminNumber = process.env.ADMIN_WHATSAPP || '595984009751'
  const msg = '⚠️ Productos con stock bajo:\n' + products.map((p: any) => `• ${p.name}: ${p.stock} unidades`).join('\n')

  if (EVOLUTION_API_KEY) {
    await fetch(`${EVOLUTION_API_BASE}/message/sendText/elviajero`, {
      method: 'POST',
      headers: { 'apikey': EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: adminNumber, text: msg, delay: 1200 }),
    })
    console.log('[stock-alert] Sent low stock alert')
  } else {
    console.log('[stock-alert] No Evolution API key. Would send:', msg.substring(0, 100))
  }
}

run().catch(console.error)
