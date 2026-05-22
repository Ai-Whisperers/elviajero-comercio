/**
 * WhatsApp URL Generator Tests — content-resolver + whatsapp helpers.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/content-resolver.ts) ──────────────────────
const WHATSAPP_NUMBER = "595984009751"

function getProductWhatsappUrl(productName: string, price: string, productUrl?: string): string {
  const text = `¡Hola! Quiero comprar: ${productName}\nPrecio: ${price}`
  const suffix = productUrl ? `\n\nLo vi en: ${productUrl}` : ""
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + suffix)}`
}

function buyNowWhatsappUrl(productName: string, price: string, quantity: number = 1, productUrl?: string): string {
  const total = parseInt(price.replace(/[^0-9]/g, ""), 10) * quantity
  const formattedTotal = "Gs. " + total.toLocaleString("es-PY")
  const text = `¡Hola! Quiero comprar:\n${quantity}x ${productName} — ${price}\nTotal: ${formattedTotal}`
  const suffix = productUrl ? `\n\nLo vi en: ${productUrl}` : ""
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + suffix)}`
}

function cleanNumber(number: string): string {
  return number.replace(/[^0-9]/g, "")
}

describe("WhatsApp URL Generation", () => {
  describe("getProductWhatsappUrl", () => {
    it("generates valid wa.me URL", () => {
      const url = getProductWhatsappUrl("Carpa 4P", "Gs. 850.000")
      expect(url).toContain("wa.me/595984009751")
    })

    it("includes product name", () => {
      const decoded = decodeURIComponent(getProductWhatsappUrl("Carpa Grande", "Gs. 500.000"))
      expect(decoded).toContain("Carpa Grande")
    })

    it("includes price", () => {
      const decoded = decodeURIComponent(getProductWhatsappUrl("Carpa", "Gs. 850.000"))
      expect(decoded).toContain("Gs. 850.000")
    })

    it("includes product URL when provided", () => {
      const decoded = decodeURIComponent(getProductWhatsappUrl("Carpa", "Gs. 100", "https://tiendaelviajero.com.py/producto/carpa"))
      expect(decoded).toContain("tiendaelviajero.com.py")
    })

    it("omits product URL section when not provided", () => {
      const decoded = decodeURIComponent(getProductWhatsappUrl("Carpa", "Gs. 100"))
      expect(decoded).not.toContain("Lo vi en")
    })

    it("includes greeting message", () => {
      const decoded = decodeURIComponent(getProductWhatsappUrl("Carpa", "Gs. 100"))
      expect(decoded).toContain("Hola")
    })
  })

  describe("buyNowWhatsappUrl", () => {
    it("includes quantity", () => {
      const decoded = decodeURIComponent(buyNowWhatsappUrl("Carpa", "Gs. 850.000", 3))
      expect(decoded).toContain("3x")
    })

    it("calculates total correctly", () => {
      const decoded = decodeURIComponent(buyNowWhatsappUrl("Carpa", "Gs. 850.000", 2))
      expect(decoded).toContain("1.700.000")
    })

    it("defaults to quantity 1", () => {
      const decoded = decodeURIComponent(buyNowWhatsappUrl("Carpa", "Gs. 850.000"))
      expect(decoded).toContain("1x")
    })

    it("strips non-numeric from price for calculation", () => {
      const decoded = decodeURIComponent(buyNowWhatsappUrl("Test", "Gs. 100.000", 2))
      expect(decoded).toContain("200.000")
    })
  })

  describe("cleanNumber", () => {
    it("removes non-numeric chars", () => {
      expect(cleanNumber("+595 984 009 751")).toBe("595984009751")
    })

    it("handles already clean number", () => {
      expect(cleanNumber("595984009751")).toBe("595984009751")
    })

    it("removes dashes and parens", () => {
      expect(cleanNumber("+(595)-984-009-751")).toBe("595984009751")
    })

    it("handles empty string", () => {
      expect(cleanNumber("")).toBe("")
    })
  })
})
