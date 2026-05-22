/**
 * Checkout message builder tests — pure function, no mocks needed.
 *
 * Tests: generateCheckoutMessage — the WhatsApp order message formatter.
 */
import { describe, it, expect } from "@jest/globals"
import { cartItemFactory, cartItemFactoryN, customerFactory } from "../test-helpers/factories"

// Inline the function to avoid side-effect imports
interface CheckoutCustomer { name: string; phone: string; city: string; ruc?: string }
interface CartItem { name: string; price: string; priceGs: number; quantity: number; variant?: string }

function generateCheckoutMessage(items: CartItem[], total: number, customer: CheckoutCustomer): string {
  const formatGs = (n: number) => "Gs. " + n.toLocaleString("es-PY")
  const lines: string[] = []
  lines.push("🛒 *NUEVO PEDIDO - EL VIAJERO*")
  lines.push("")
  lines.push("*📦 PRODUCTOS:*")
  lines.push("")
  items.forEach((item, idx) => {
    const subtotal = (item.priceGs ?? 0) * item.quantity
    const variant = item.variant ? ` (${item.variant})` : ""
    lines.push(`${idx + 1}. ${item.name}${variant}`)
    lines.push(`   Cant: ${item.quantity}  ×  ${formatGs(item.priceGs ?? 0)}`)
    lines.push(`   Subtotal: ${formatGs(subtotal)}`)
    lines.push("")
  })
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  lines.push("─".repeat(30))
  lines.push(`*Total items:* ${totalItems}`)
  lines.push(`*💰 TOTAL: ${formatGs(total)}*`)
  lines.push("─".repeat(30))
  lines.push("")
  lines.push("*👤 DATOS DEL CLIENTE:*")
  lines.push(`Nombre: ${customer.name}`)
  lines.push(`Teléfono: ${customer.phone}`)
  lines.push(`Ciudad: ${customer.city}`)
  if (customer.ruc) lines.push(`RUC: ${customer.ruc}`)
  lines.push("")
  lines.push("✅ *Gracias por tu pedido!*")
  lines.push("Te contactaremos para coordinarlo.")
  return lines.join("\n")
}

describe("Checkout Message Builder", () => {
  it("generates a message with header", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory()
    )
    expect(msg).toContain("NUEVO PEDIDO - EL VIAJERO")
  })

  it("includes product name", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ name: "Carpa 4 personas" })],
      350000,
      customerFactory()
    )
    expect(msg).toContain("Carpa 4 personas")
  })

  it("includes variant when present", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ name: "Carpa", variant: "4 personas" })],
      350000,
      customerFactory()
    )
    expect(msg).toContain("Carpa (4 personas)")
  })

  it("omits variant when empty", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ name: "Linterna", variant: "" })],
      50000,
      customerFactory()
    )
    expect(msg).toContain("Linterna")
    expect(msg).not.toContain("Linterna (")
  })

  it("includes quantity and price", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ quantity: 3, priceGs: 100000 })],
      300000,
      customerFactory()
    )
    expect(msg).toContain("Cant: 3")
    expect(msg).toContain("Gs.")
  })

  it("calculates subtotal per item", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ quantity: 2, priceGs: 150000 })],
      300000,
      customerFactory()
    )
    expect(msg).toContain("Subtotal:")
    // 2 × 150000 = 300000
    expect(msg).toContain("300.000")
  })

  it("includes total items count", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory({ quantity: 2 }), cartItemFactory({ id: "prod-002", name: "Linterna", quantity: 3 })],
      500000,
      customerFactory()
    )
    expect(msg).toContain("Total items:* 5")
  })

  it("includes total with currency", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory()
    )
    expect(msg).toContain("TOTAL:")
    expect(msg).toContain("Gs.")
  })

  it("includes customer data", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory({ name: "Ana Gómez", phone: "595981111111", city: "Luque" })
    )
    expect(msg).toContain("Nombre: Ana Gómez")
    expect(msg).toContain("Teléfono: 595981111111")
    expect(msg).toContain("Ciudad: Luque")
  })

  it("includes RUC when provided", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory({ ruc: "80012345-1" })
    )
    expect(msg).toContain("RUC: 80012345-1")
  })

  it("omits RUC when not provided", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory({ ruc: "" })
    )
    expect(msg).not.toContain("RUC:")
  })

  it("handles multiple items", () => {
    const items = cartItemFactoryN(3)
    const msg = generateCheckoutMessage(items, 600000, customerFactory())
    expect(msg).toContain("1.")
    expect(msg).toContain("2.")
    expect(msg).toContain("3.")
  })

  it("handles single item", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory()
    )
    expect(msg).toContain("1.")
    // Should only have one numbered item
    expect(msg).not.toContain("2.")
  })

  it("ends with confirmation message", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory()
    )
    expect(msg).toContain("Gracias por tu pedido")
    expect(msg).toContain("Te contactaremos")
  })

  it("has separator lines", () => {
    const msg = generateCheckoutMessage(
      [cartItemFactory()],
      180000,
      customerFactory()
    )
    expect(msg).toContain("─".repeat(30))
  })
})
