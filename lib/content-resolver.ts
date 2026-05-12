// ── Content resolver ──
// In-memory LRU cache for JSON content files with TTL.
// Single source of truth for all content access — no more raw imports.

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const REPO = process.cwd()

// ── Cache ──
interface CacheEntry { data: any; timestamp: number }
const cache = new Map<string, CacheEntry>()
const TTL = 60_000 // 60s between renders

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < TTL) return entry.data as T
  return null
}

function setCached(key: string, data: any) {
  if (cache.size > 50) {
    const entries = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
    for (const [k] of entries.slice(0, cache.size - 50)) cache.delete(k)
  }
  cache.set(key, { data, timestamp: Date.now() })
}

// ── Loaders ──

export function loadJSON<T>(path: string): T | null {
  const cached = getCached<T>(path)
  if (cached) return cached

  try {
    const data = JSON.parse(readFileSync(join(REPO, path), 'utf-8')) as T
    setCached(path, data)
    return data
  } catch {
    return null
  }
}

export function loadContent(locale = 'es'): any {
  return loadJSON<any>(`content/${locale}.json`)
}

export function loadSiteConfig(): any {
  return loadJSON<any>('config/site.json')
}

export function loadPageConfig(page: string): any {
  return loadJSON<any>(`config/pages/${page}.json`)
}

export function loadCategories(): Record<string, any> {
  return loadJSON<Record<string, any>>('config/categories.json') || {}
}

export function loadShipping(): any {
  return loadJSON<any>('config/shipping.json')
}

export function loadTestimonials(): any[] {
  return loadJSON<any[]>('testimonials.json') || loadContent()?.testimonials || []
}

// ── Dot-notation resolver ──

export function resolveContent(data: any, path: string, defaultValue = ''): any {
  if (!data) return defaultValue
  const keys = path.split('.')
  let current = data
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue
    current = current[key]
  }
  return current !== undefined && current !== null ? current : defaultValue
}

export function resolveContentArray(data: any, path: string, defaultValue: any[] = []): any[] {
  const result = resolveContent(data, path, undefined)
  return Array.isArray(result) ? result : defaultValue
}

// ── High-level helpers ──

export function getWhatsappUrl(content: any, defaultPhone = '+595****4567', defaultMessage = 'Hola! Quisiera información sobre productos'): string {
  const phone = resolveContent(content, 'business.whatsappPhone', '') ||
    resolveContent(content, 'business.businessNumber', '') || defaultPhone
  const message = resolveContent(content, 'business.whatsappMessage', defaultMessage)
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
}
