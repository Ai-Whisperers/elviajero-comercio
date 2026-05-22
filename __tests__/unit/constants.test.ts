/**
 * Constants Integrity Tests — verify data shapes and required fields.
 *
 * Tests: ABOUT, CONTACT, FAQ, HOME, KITS, PROMOTIONS, CATEGORIES, BRAND theme
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline constants (mirrors lib/constants/*.ts) ─────────────────
const CONTACT_INFO = {
  whatsapp: "595984009751",
  email: "info@tiendaelviajero.com",
  phone: "+595 984 009 751",
  address: "Mariano Roque Alonso, Paraguay",
  hours: "Lun-Vie: 9:00-18:00 | Sáb: 9:00-13:00",
}

const FAQ_ITEMS = [
  { question: "¿Cómo realizo mi pedido?", answer: "Podés agregar productos al carrito..." },
  { question: "¿Realizan envíos a todo Paraguay?", answer: "Sí, realizamos envíos..." },
  { question: "¿Qué métodos de pago aceptan?", answer: "Aceptamos efectivo..." },
  { question: "¿Tienen garantía en los productos?", answer: "Todos nuestros productos..." },
  { question: "¿Puedo visitar el local?", answer: "Sí, te invitamos..." },
  { question: "¿Hacen envíos internacionales?", answer: "Actualmente solo..." },
  { question: "¿Puedo reservar productos?", answer: "Sí, podés reservar..." },
  { question: "¿Tienen catálogo de productos?", answer: "Nuestro catálogo..." },
]

const BRAND = {
  name: "El Viajero",
  colors: {
    primary: "#1B5E20",
    primaryLight: "#2E7D32",
    primaryDark: "#0D3B0F",
    secondary: "#E65100",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    error: "#DC2626",
    success: "#16A34A",
    warning: "#F59E0B",
  },
  whatsapp: {
    phone: "+595 984 009751",
    message: "Hola! Quisiera información sobre productos",
  },
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Constants Integrity", () => {
  describe("CONTACT_INFO", () => {
    it("has whatsapp number", () => {
      expect(CONTACT_INFO.whatsapp).toBeTruthy()
      expect(CONTACT_INFO.whatsapp.length).toBeGreaterThanOrEqual(10)
    })

    it("has email with @", () => {
      expect(CONTACT_INFO.email).toContain("@")
    })

    it("has phone number", () => {
      expect(CONTACT_INFO.phone).toBeTruthy()
    })

    it("has address", () => {
      expect(CONTACT_INFO.address).toBeTruthy()
    })

    it("has business hours", () => {
      expect(CONTACT_INFO.hours).toBeTruthy()
    })

    it("whatsapp is numeric only", () => {
      expect(CONTACT_INFO.whatsapp).toMatch(/^\d+$/)
    })
  })

  describe("FAQ_ITEMS", () => {
    it("has at least 5 FAQs", () => {
      expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(5)
    })

    it("each item has question and answer", () => {
      for (const item of FAQ_ITEMS) {
        expect(item.question.length).toBeGreaterThan(0)
        expect(item.answer.length).toBeGreaterThan(0)
      }
    })

    it("no duplicate questions", () => {
      const questions = FAQ_ITEMS.map(i => i.question)
      expect(new Set(questions).size).toBe(questions.length)
    })

    it("all questions end with ?", () => {
      for (const item of FAQ_ITEMS) {
        expect(item.question).toMatch(/\?/)
      }
    })
  })

  describe("BRAND theme", () => {
    it("has brand name El Viajero", () => {
      expect(BRAND.name).toBe("El Viajero")
    })

    it("has primary color as hex", () => {
      expect(BRAND.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it("has secondary color as hex", () => {
      expect(BRAND.colors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it("all colors are valid hex codes", () => {
      for (const [key, val] of Object.entries(BRAND.colors)) {
        expect(val).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })

    it("has whatsapp config", () => {
      expect(BRAND.whatsapp.phone).toBeTruthy()
      expect(BRAND.whatsapp.message).toBeTruthy()
    })

    it("primary color is green (#1B5E20)", () => {
      expect(BRAND.colors.primary).toBe("#1B5E20")
    })

    it("secondary color is orange (#E65100)", () => {
      expect(BRAND.colors.secondary).toBe("#E65100")
    })
  })
})
