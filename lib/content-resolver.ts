/**
 * WhatsApp URL generator for products
 */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"

export function getProductWhatsappUrl(
  productName: string,
  price: string,
  productUrl?: string
): string {
  const text = `¡Hola! Quiero comprar: ${productName}
Precio: ${price}`
  const suffix = productUrl ? `\n\nLo vi en: ${productUrl}` : ""

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + suffix)}`
}

export function BuyNowWhatsappUrl(
  productName: string,
  price: string,
  quantity: number = 1,
  productUrl?: string
): string {
  const total = parseInt(price.replace(/[^0-9]/g, ""), 10) * quantity
  const formattedTotal = "Gs. " + total.toLocaleString("es-PY")
  const text = `¡Hola! Quiero comprar:
${quantity}x ${productName} — ${price}
Total: ${formattedTotal}`
  const suffix = productUrl ? `\n\nLo vi en: ${productUrl}` : ""

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text + suffix)}`
}
