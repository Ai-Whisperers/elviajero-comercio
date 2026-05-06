// Promo codes — serialized in localStorage so admin can add them
import { STORAGE_KEYS } from "@ai-whisperers/auth/storage-keys"

export interface PromoCode {
  code: string
  type: "percentage" | "fixed"
  value: number
  minPurchase: number
  maxUses: number
  usedCount: number
  expiresAt: number | null
}

const DEFAULT_PROMOS: PromoCode[] = [
  { code: "BIENVENIDO10", type: "percentage", value: 10, minPurchase: 100000, maxUses: 100, usedCount: 0, expiresAt: null },
  { code: "ENVIOGRATIS", type: "fixed", value: 15000, minPurchase: 500000, maxUses: 50, usedCount: 0, expiresAt: null },
]

export function getPromoCodes(): PromoCode[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMOS)
    if (saved) return JSON.parse(saved)
  } catch {}
  localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(DEFAULT_PROMOS))
  return DEFAULT_PROMOS
}

export function validatePromo(code: string, cartTotal: number): { ok: boolean; error?: string; promo?: PromoCode } {
  const promos = getPromoCodes()
  const p = promos.find((x) => x.code.toUpperCase() === code.toUpperCase())
  if (!p) return { ok: false, error: "Código inválido" }
  if (p.expiresAt && p.expiresAt < Date.now()) return { ok: false, error: "Código expirado" }
  if (p.usedCount >= p.maxUses) return { ok: false, error: "Código agotado" }
  if (cartTotal < p.minPurchase) return { ok: false, error: `Mínimo Gs. ${p.minPurchase.toLocaleString("es-PY")}` }
  return { ok: true, promo: p }
}

export function applyPromo(total: number, promo: PromoCode): number {
  if (promo.type === "percentage") return total - (total * promo.value) / 100
  return Math.max(0, total - promo.value)
}

export function usePromo(promo: PromoCode) {
  const promos = getPromoCodes()
  const idx = promos.findIndex((p) => p.code === promo.code)
  if (idx >= 0) {
    promos[idx].usedCount++
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos))
  }
}
