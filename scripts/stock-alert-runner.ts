import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contentPath = join(__dirname, '..', 'content', 'es.json')
const c = JSON.parse(readFileSync(contentPath, 'utf-8'))

const SUPABASE_URL = c.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const EVO_BASE = process.env.EVOLUTION_API_URL || 'http://evolution_evolution_api:8080'
const EVO_KEY = process.env.EVOLUTION_API_KEY || ''
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || 'elviajero'
const ADMIN = process.env.ADMIN_WHATSAPP || '595984009751'

async function run() {
  if (!SUPABASE_KEY) {
    console.log('[stock-alert] No SUPABASE_SERVICE_ROLE_KEY in env --- skipping')
    return
  }
  if (!SUPABASE_URL) {
    console.log('[stock-alert] No Supabase URL --- skipping')
    return
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

  const { data: products, error } = await supabase
    .from('ej_products')
    .select('id, name, stock')
    .lt('stock', 5)
    .gt('stock', 0)

  if (error) {
    console.log('[stock-alert] Query error:', error.message)
    return
  }

  if (!products || products.length === 0) {
    console.log('[stock-alert] No low stock products --- all healthy')
    return
  }

  const lines = products.map((p: any) => `• ${p.name}: ${p.stock} unidades`)
  const msg = `⚠️ Productos con stock bajo:\n${lines.join('\n')}`

  if (EVO_KEY) {
    const url = `${EVO_BASE}/message/sendText/${EVO_INSTANCE}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { apikey: EVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: ADMIN, text: msg, delay: 1200 }),
    })
    if (res.ok) {
      console.log(`[stock-alert] Alert sent to ${ADMIN} (${products.length} low-stock items)`)
    } else {
      const txt = await res.text()
      console.log(`[stock-alert] Evolution API error ${res.status}: ${txt}`)
    }
  } else {
    console.log('[stock-alert] No Evolution API key --- would send:\n' + msg)
  }
}

run().catch(e => console.error('[stock-alert] Fatal:', e))
