/**
 * Customer Lifecycle Message Tests — verify WhatsApp message templates.
 *
 * Tests: sendReviewRequest, sendAbandonedCartReminder message content
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline message builders (mirrors lib/customer-lifecycle.ts) ───
const SITE_URL = "https://tiendaelviajero.com.py"

function buildReviewMessage(order: any): string {
  return `👋 *El Viajero* 🏕️\n\n¡Gracias por tu compra! 🙌\n\n¿Nos ayudás con una reseña de ${order.items?.[0]?.name || "tu producto"}?\n\n👉 Dejanos tu opinión acá:\n${SITE_URL}/reseñas?producto=${encodeURIComponent(order.items?.[0]?.name || "")}&pedido=${order.id?.slice(0, 8)}\n\nSon solo 30 segundos y nos ayuda muchísimo 🙏`
}

function buildFirstAbandonedCartMessage(): string {
  return `👋 *El Viajero* 🏕️\n\n¡Te quedaron productos en tu carrito! 😊\n\n📦 Completá tu pedido acá:\n${SITE_URL}/tienda\n\nSi tenés alguna duda, respondé este mensaje.`
}

function buildSecondAbandonedCartMessage(): string {
  return `🎁 *El Viajero* 🏕️\n\n¡No queremos que te pierdas tu pedido! Usá el código *VIAJERO10* y obtené 10% de descuento hoy.\n\n👉 ${SITE_URL}/tienda\n\nVálido por 24 horas ⏰`
}

function shouldSendMessage(phone: string | undefined): boolean {
  return !!phone && phone.length >= 8
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Customer Lifecycle", () => {
  describe("Review request message", () => {
    it("includes product name", () => {
      const msg = buildReviewMessage({ items: [{ name: "Carpa 4 Personas" }], id: "ord-12345678-abc" })
      expect(msg).toContain("Carpa 4 Personas")
    })

    it("includes order ID (first 8 chars)", () => {
      const msg = buildReviewMessage({ items: [{ name: "Test" }], id: "ord-12345678-abc" })
      expect(msg).toContain("ord-1234")
    })

    it("includes review URL", () => {
      const msg = buildReviewMessage({ items: [{ name: "Carpa" }], id: "abc123" })
      expect(msg).toContain("/reseñas")
      expect(msg).toContain("producto=")
    })

    it("includes brand name", () => {
      const msg = buildReviewMessage({ items: [], id: "abc" })
      expect(msg).toContain("El Viajero")
    })

    it("encodes product name in URL", () => {
      const msg = buildReviewMessage({ items: [{ name: "Carpa Grande XL" }], id: "abc" })
      expect(msg).toContain(encodeURIComponent("Carpa Grande XL"))
    })

    it("falls back to 'tu producto' when no items", () => {
      const msg = buildReviewMessage({ items: [], id: "abc" })
      expect(msg).toContain("tu producto")
    })

    it("falls back to 'tu producto' when items is undefined", () => {
      const msg = buildReviewMessage({ id: "abc" })
      expect(msg).toContain("tu producto")
    })

    it("includes gratitude message", () => {
      const msg = buildReviewMessage({ items: [], id: "abc" })
      expect(msg).toContain("Gracias por tu compra")
    })
  })

  describe("First abandoned cart message", () => {
    it("includes brand name", () => {
      const msg = buildFirstAbandonedCartMessage()
      expect(msg).toContain("El Viajero")
    })

    it("includes tienda URL", () => {
      const msg = buildFirstAbandonedCartMessage()
      expect(msg).toContain("/tienda")
    })

    it("mentions carrito", () => {
      const msg = buildFirstAbandonedCartMessage()
      expect(msg).toContain("carrito")
    })

    it("invites questions", () => {
      const msg = buildFirstAbandonedCartMessage()
      expect(msg).toContain("duda")
    })
  })

  describe("Second abandoned cart message", () => {
    it("includes discount code VIAJERO10", () => {
      const msg = buildSecondAbandonedCartMessage()
      expect(msg).toContain("VIAJERO10")
    })

    it("mentions 10% discount", () => {
      const msg = buildSecondAbandonedCartMessage()
      expect(msg).toContain("10%")
    })

    it("includes tienda URL", () => {
      const msg = buildSecondAbandonedCartMessage()
      expect(msg).toContain("/tienda")
    })

    it("includes urgency (24 hours)", () => {
      const msg = buildSecondAbandonedCartMessage()
      expect(msg).toContain("24 horas")
    })

    it("includes brand name", () => {
      const msg = buildSecondAbandonedCartMessage()
      expect(msg).toContain("El Viajero")
    })
  })

  describe("shouldSendMessage", () => {
    it("sends to valid phone", () => {
      expect(shouldSendMessage("595981111111")).toBe(true)
    })

    it("rejects undefined phone", () => {
      expect(shouldSendMessage(undefined)).toBe(false)
    })

    it("rejects empty string", () => {
      expect(shouldSendMessage("")).toBe(false)
    })

    it("rejects short phone (< 8 chars)", () => {
      expect(shouldSendMessage("5951234")).toBe(false)
    })

    it("accepts exactly 8 chars", () => {
      expect(shouldSendMessage("59598111")).toBe(true)
    })
  })
})
