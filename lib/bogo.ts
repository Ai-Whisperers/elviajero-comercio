
"use client"
export function validateBogo(promo: any, cartItems: any[]): { ok: boolean; discount: number } {
  if (promo.type !== "bogo") return { ok: false, discount: 0 }
  if (cartItems.length < 2) return { ok: false, discount: 0 }
  // Cheapest item is free
  const sorted = [...cartItems].sort((a, b) => a.priceGs - b.priceGs)
  return { ok: true, discount: sorted[0].priceGs }
}
