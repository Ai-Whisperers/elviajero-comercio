
"use client"
const KEY = "viajero_stock_history"

export function logStockChange(productName: string, oldStock: number, newStock: number) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "[]")
    all.unshift({ id: Date.now().toString(36), productName, oldStock, newStock, date: new Date().toISOString() })
    if (all.length > 500) all.length = 500
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {}
}

export function getStockHistory(productName: string, limit = 10) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "[]")
    return all.filter((e: any) => e.productName === productName).slice(0, limit)
  } catch { return [] }
}
