type Lang = "es" | "gn"
import { STORAGE_KEYS } from "@ai-whisperers/auth/storage-keys"

let currentLang: Lang = "es"
const TENANT = "elviajero"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qyvokpribmbrosafntqa.supabase.co"
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm"

// In-memory content cache (client-side)
let _content: Record<string, any> | null = null

export function getLang(): Lang {
  if (typeof window === "undefined") return "es"
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG) as Lang | null
    if (saved && ["es", "gn"].includes(saved)) return saved
    const urlLang = new URLSearchParams(window.location.search).get("lang") as Lang | null
    if (urlLang && ["es", "gn"].includes(urlLang)) return urlLang
  } catch {}
  return "es"
}

export function setLang(lang: Lang) {
  currentLang = lang
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.LANG, lang)
}

// Load content from Supabase (or file fallback)
async function loadContent(locale: string): Promise<Record<string, any>> {
  try {
    if (typeof window === "undefined") {
      // Server-side: load from file
      return require(`@/content/${locale}.json`)
    }
    
    // Client-side: try sessionStorage cache first
    const cached = sessionStorage.getItem(`viajero_content_${locale}`)
    if (cached) return JSON.parse(cached)

    // Try Supabase
    const url = `${SUPABASE_URL}/rest/v1/site_content?select=key_path,content&tenant_slug=eq.${TENANT}&locale=eq.${locale}`
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        const result: Record<string, any> = {}
        for (const row of data) {
          const keys = row.key_path.split(".")
          let current = result
          for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) current[keys[i]] = row.content
            else { current[keys[i]] = current[keys[i]] || {}; current = current[keys[i]] }
          }
        }
        sessionStorage.setItem(`viajero_content_${locale}`, JSON.stringify(result))
        return result
      }
    }
  } catch {}
  
  // File fallback
  return require(`@/content/${locale}.json`)
}

export function t(key: string): string {
  const lang = getLang()
  if (lang === "es") return key
  // Simple file-based lookup for GN
  try {
    const data = require(`@/content/${lang}.json`)
    const parts = key.split(".")
    let val: any = data
    for (const p of parts) { if (val && typeof val === "object") val = val[p]; else return key }
    if (typeof val === "string") return val
  } catch {}
  return key
}
