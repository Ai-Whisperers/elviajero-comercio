/**
 * WhatsApp Checkout Message Builder Tests — tests message generation logic.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors components/whatsapp-checkout.tsx) ──────────────
function formatPricePYG(amount: number): string {
  return "Gs. " + amount.toLocaleString("es-PY")
}

function generateWhatsAppMessage(items: { name: string; price: number; quantity: number }[]): string {
  let text = "Hola, quisiera hacer el siguiente pedido:\n\n"
  items.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`
    text += `   Cantidad: ${item.quantity}\n`
    text += `   Precio unitario: ${formatPricePYG(item.price)}\n\n`
  })
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  text += `Total: ${formatPricePYG(total)}`
  return text
}

function buildCheckoutUrl(items: { name: string; price: number; quantity: number }[], phone: string): string {
  const msg = generateWhatsAppMessage(items)
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("WhatsApp Checkout Message", () => {
  const items = [
    { name: "Carpa 4 Personas", price: 850000, quantity: 1 },
    { name: "Linterna LED", price: 95000, quantity: 2 },
  ]

  describe("formatPricePYG", () => {
    it("formats 850000 as Gs. 850.000", () => {
      expect(formatPricePYG(850000)).toContain("850.000")
    })

    it("formats 0 as Gs. 0", () => {
      expect(formatPricePYG(0)).toContain("Gs.")
    })

    it("formats 15000", () => {
      expect(formatPricePYG(15000)).toContain("15.000")
    })
  })

  describe("generateWhatsAppMessage", () => {
    it("includes greeting", () => {
      expect(generateWhatsAppMessage(items)).toContain("Hola")
    })

    it("includes each product name", () => {
      const msg = generateWhatsAppMessage(items)
      expect(msg).toContain("Carpa 4 Personas")
      expect(msg).toContain("Linterna LED")
    })

    it("includes quantities", () => {
      const msg = generateWhatsAppMessage(items)
      expect(msg).toContain("Cantidad: 1")
      expect(msg).toContain("Cantidad: 2")
    })

    it("includes unit prices", () => {
      const msg = generateWhatsAppMessage(items)
      expect(msg).toContain("Gs. 850.000")
      expect(msg).toContain("Gs. 95.000")
    })

    it("includes total (850000 + 95000*2 = 1040000)", () => {
      const msg = generateWhatsAppMessage(items)
      expect(msg).toContain("1.040.000")
    })

    it("numbers items sequentially", () => {
      const msg = generateWhatsAppMessage(items)
      expect(msg).toContain("1. Carpa")
      expect(msg).toContain("2. Linterna")
    })

    it("handles single item", () => {
      const msg = generateWhatsAppMessage([{ name: "Test", price: 100000, quantity: 1 }])
      expect(msg).toContain("Test")
      expect(msg).toContain("Gs. 100.000")
    })

    it("handles empty items array", () => {
      const msg = generateWhatsAppMessage([])
      expect(msg).toContain("Total: Gs. 0")
    })
  })

  describe("buildCheckoutUrl", () => {
    it("generates valid wa.me URL", () => {
      const url = buildCheckoutUrl(items, "595984009751")
      expect(url).toContain("wa.me/595984009751")
    })

    it("URL-encodes message", () => {
      const url = buildCheckoutUrl(items, "595984009751")
      expect(url).toContain("text=")
      expect(url).toContain(encodeURIComponent("Hola"))
    })
  })
})
