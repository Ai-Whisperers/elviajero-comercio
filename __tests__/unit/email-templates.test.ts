/**
 * Email Template Tests — verify HTML output structure and content.
 *
 * Tests: orderConfirmationHtml, passwordResetHtml
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline templates (mirrors lib/email-templates.ts) ─────────────
function orderConfirmationHtml(order: { id: string; total: string; items: { name: string; price: string; quantity: number }[]; date: string }): string {
  const itemsHtml = order.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name} x${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.price}</td></tr>`).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#1B5E20;color:white;padding:20px;text-align:center;border-radius:10px 10px 0 0">
      <h1 style="margin:0;font-size:20px">✅ Pedido Confirmado</h1>
    </div>
    <div style="border:1px solid #e0e0e0;border-top:0;padding:20px;border-radius:0 0 10px 10px">
      <p>Gracias por tu compra en <strong>El Viajero</strong>.</p>
      <p style="color:#666">Número de pedido: <strong>#${order.id?.slice(0, 8) || ""}</strong></p>
      <p style="color:#666">Fecha: ${new Date(order.date).toLocaleDateString("es", { dateStyle: "long" })}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml}</table>
      <div style="border-top:2px solid #1B5E20;padding:8px 0;text-align:right;font-size:18px;font-weight:bold">Total: ${order.total}</div>
      <p style="color:#666;margin-top:16px">Te contactaremos por WhatsApp para coordinar la entrega.</p>
      <p style="color:#999;font-size:12px;margin-top:20px">El Viajero — Coronel Felipe Toledo, Mariano Roque Alonso</p>
    </div></body></html>`
}

function passwordResetHtml(token: string): string {
  const url = "https://tiendaelviajero.com.py/recuperar/" + token
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#1B5E20;color:white;padding:20px;text-align:center;border-radius:10px"><h1 style="margin:0;font-size:20px">Restablecer contraseña</h1></div>
    <div style="border:1px solid #e0e0e0;border-top:0;padding:20px;border-radius:0 0 10px 10px">
      <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
      <a href="${url}" style="display:inline-block;background:#1B5E20;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:16px 0">Restablecer contraseña</a>
      <p style="color:#999;font-size:12px">El link expira en 1 hora. Si no solicitaste esto, ignorá este mensaje.</p>
    </div></body></html>`
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Email Templates", () => {
  describe("orderConfirmationHtml", () => {
    const order = {
      id: "ord-12345678-abc",
      total: "Gs. 850.000",
      items: [
        { name: "Carpa 4 Personas", price: "Gs. 850.000", quantity: 1 },
        { name: "Linterna LED", price: "Gs. 95.000", quantity: 2 },
      ],
      date: "2026-05-22T10:00:00Z",
    }

    it("produces valid HTML document", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("<html>")
      expect(html).toContain("</html>")
    })

    it("includes order ID (first 8 chars)", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("ord-1234")
    })

    it("includes total", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("Gs. 850.000")
    })

    it("includes each item name", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("Carpa 4 Personas")
      expect(html).toContain("Linterna LED")
    })

    it("includes item quantities", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("x1")
      expect(html).toContain("x2")
    })

    it("includes item prices", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("Gs. 850.000")
      expect(html).toContain("Gs. 95.000")
    })

    it("includes brand name El Viajero", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("El Viajero")
    })

    it("includes WhatsApp mention", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("WhatsApp")
    })

    it("uses brand color #1B5E20", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("#1B5E20")
    })

    it("includes confirmado header", () => {
      const html = orderConfirmationHtml(order)
      expect(html).toContain("Pedido Confirmado")
    })

    it("handles empty items array", () => {
      const html = orderConfirmationHtml({ ...order, items: [] })
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("Total:")
    })

    it("handles short order ID", () => {
      const html = orderConfirmationHtml({ ...order, id: "ab" })
      expect(html).toContain("ab")
    })

    it("handles missing ID gracefully", () => {
      const html = orderConfirmationHtml({ ...order, id: "" })
      expect(html).toContain("<!DOCTYPE html>")
    })
  })

  describe("passwordResetHtml", () => {
    it("produces valid HTML document", () => {
      const html = passwordResetHtml("token-abc-123")
      expect(html).toContain("<!DOCTYPE html>")
      expect(html).toContain("</html>")
    })

    it("includes the token in the URL", () => {
      const html = passwordResetHtml("my-reset-token")
      expect(html).toContain("/recuperar/my-reset-token")
    })

    it("includes reset button text", () => {
      const html = passwordResetHtml("tok")
      expect(html).toContain("Restablecer contraseña")
    })

    it("mentions 1 hour expiry", () => {
      const html = passwordResetHtml("tok")
      expect(html).toContain("1 hora")
    })

    it("uses brand color", () => {
      const html = passwordResetHtml("tok")
      expect(html).toContain("#1B5E20")
    })

    it("includes full domain URL", () => {
      const html = passwordResetHtml("tok")
      expect(html).toContain("tiendaelviajero.com.py")
    })
  })
})
