import { CartItem } from "./types"

export interface CheckoutCustomer {
  name: string
  phone: string
  city: string
  ruc?: string
}

/**
 * Genera un mensaje formateado para checkout por WhatsApp.
 * Reutilizable desde cart-sidebar, checkout page, o cualquier otro componente.
 */
export function generateCheckoutMessage(
  items: CartItem[],
  total: number,
  customer: CheckoutCustomer
): string {
  const formatGs = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  const lines: string[] = []
  lines.push("🛒 *NUEVO PEDIDO - EL VIAJERO*")
  lines.push("")
  lines.push("*📦 PRODUCTOS:*")
  lines.push("")

  items.forEach((item, idx) => {
    const subtotal = (item.priceGs ?? 0) * item.quantity
    const variant = item.variant ? ` (${item.variant})` : ""
    lines.push(
      `${idx + 1}. ${item.name}${variant}`
    )
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
  if (customer.ruc) {
    lines.push(`RUC: ${customer.ruc}`)
  }
  lines.push("")
  lines.push("✅ *Gracias por tu pedido!*")
  lines.push("Te contactaremos para coordinarlo.")

  return lines.join("\n")
}
