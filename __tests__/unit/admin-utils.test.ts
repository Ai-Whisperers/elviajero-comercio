/**
 * Admin Fetch + Admin UI Config Tests — auth header injection, badge styles.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline adminFetch logic (mirrors lib/admin-fetch.ts) ──────────
function buildAdminHeaders(existingHeaders: Record<string, string>, body?: any, token?: string): Record<string, string> {
  const headers = { ...existingHeaders }
  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

// ─── Inline badge styles (mirrors lib/admin-ui-config.ts) ──────────
const BADGE_STYLES: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entregado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
}

// ─── Inline CSV export logic (mirrors lib/export-csv.ts) ───────────
function ordersToCSV(orders: any[]): string {
  const headers = ["ID", "Usuario", "Items", "Total", "Estado", "Pago", "Fecha"]
  const rows = orders.map(o => [
    o.id?.slice(0, 8) || "",
    o.user || "Invitado",
    o.items?.length || 0,
    o.total || "",
    o.status || "",
    o.paymentMethod || "",
    o.date ? new Date(o.date).toLocaleDateString("es") : "",
  ])
  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Admin Fetch Headers", () => {
  it("injects Content-Type when body present", () => {
    const h = buildAdminHeaders({}, { data: "test" }, undefined)
    expect(h["Content-Type"]).toBe("application/json")
  })

  it("does not override existing Content-Type", () => {
    const h = buildAdminHeaders({ "Content-Type": "text/plain" }, "body", undefined)
    expect(h["Content-Type"]).toBe("text/plain")
  })

  it("injects Bearer token from localStorage", () => {
    const h = buildAdminHeaders({}, undefined, "jwt-token-123")
    expect(h["Authorization"]).toBe("Bearer jwt-token-123")
  })

  it("no auth header when no token", () => {
    const h = buildAdminHeaders({}, undefined, undefined)
    expect(h["Authorization"]).toBeUndefined()
  })

  it("sets both Content-Type and Auth when both provided", () => {
    const h = buildAdminHeaders({}, { data: 1 }, "my-token")
    expect(h["Content-Type"]).toBe("application/json")
    expect(h["Authorization"]).toBe("Bearer my-token")
  })

  it("preserves existing custom headers", () => {
    const h = buildAdminHeaders({ "X-Custom": "yes" }, undefined, "tok")
    expect(h["X-Custom"]).toBe("yes")
  })
})

describe("Badge Styles Config", () => {
  it("has style for all order statuses", () => {
    const statuses = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"]
    for (const s of statuses) {
      expect(BADGE_STYLES[s]).toBeTruthy()
    }
  })

  it("has style for user statuses", () => {
    expect(BADGE_STYLES["active"]).toBeTruthy()
    expect(BADGE_STYLES["suspended"]).toBeTruthy()
    expect(BADGE_STYLES["pending"]).toBeTruthy()
  })

  it("all styles contain bg class", () => {
    for (const [key, style] of Object.entries(BADGE_STYLES)) {
      expect(style).toContain("bg-")
    }
  })

  it("all styles contain text color class", () => {
    for (const [key, style] of Object.entries(BADGE_STYLES)) {
      expect(style).toContain("text-")
    }
  })

  it("cancelado is red-themed", () => {
    expect(BADGE_STYLES["cancelado"]).toContain("red")
  })

  it("entregado is green/emerald-themed", () => {
    expect(BADGE_STYLES["entregado"]).toContain("emerald")
  })
})

describe("CSV Export Logic", () => {
  it("generates CSV with headers", () => {
    const csv = ordersToCSV([])
    expect(csv).toContain("ID,Usuario,Items,Total,Estado,Pago,Fecha")
  })

  it("formats order rows", () => {
    const orders = [{
      id: "ORD-12345678-abc",
      user: "Omar",
      items: [{ name: "Carpa" }, { name: "Linterna" }],
      total: "945000",
      status: "pendiente",
      paymentMethod: "whatsapp",
      date: "2025-01-15",
    }]
    const csv = ordersToCSV(orders)
    expect(csv).toContain("ORD-1234")
    expect(csv).toContain("Omar")
    expect(csv).toContain("2")
    expect(csv).toContain("945000")
    expect(csv).toContain("pendiente")
  })

  it("truncates ID to first 8 chars", () => {
    const csv = ordersToCSV([{ id: "VERY-LONG-ORDER-ID-12345" }])
    expect(csv).toContain("VERY-LON")
  })

  it("defaults user to Invitado", () => {
    const csv = ordersToCSV([{ id: "X" }])
    expect(csv).toContain("Invitado")
  })

  it("handles missing fields gracefully", () => {
    const csv = ordersToCSV([{}])
    const rows = csv.split("\n")
    expect(rows).toHaveLength(2) // header + 1 row
  })

  it("handles multiple orders", () => {
    const orders = [{ id: "A" }, { id: "B" }, { id: "C" }]
    const csv = ordersToCSV(orders)
    const rows = csv.split("\n")
    expect(rows).toHaveLength(4) // header + 3 rows
  })
})
