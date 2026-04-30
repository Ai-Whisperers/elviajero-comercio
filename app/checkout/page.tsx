"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import { CartProvider, useCart } from "@/lib/cart-context"
import { DeliveryCalculator } from "@/components/delivery-calculator"
import { CouponInput } from "@/components/coupon-input"
import { trackWhatsAppClick, trackBeginCheckout } from "@/components/analytics"
import { useState } from "react"
import Link from "next/link"

function CheckoutContent() {
  const { items, total, clearCart } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [notes, setNotes] = useState("")
  const [method, setMethod] = useState("whatsapp")
  const [submitted, setSubmitted] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState("")

  const formatGs = (n: number) => "Gs. " + n.toLocaleString("es-PY")
  const finalTotal = Math.max(0, total - discount + deliveryFee)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackBeginCheckout(finalTotal)
    
    const msg = encodeURIComponent(
      "🛒 *Nuevo Pedido - El Viajero*\n\n" +
      items.map(i => `• ${i.name} x${i.quantity}: ${formatGs(i.priceGs * i.quantity)}`).join("\n") +
      `\n${deliveryFee > 0 ? `\n🚚 Envío: ${formatGs(deliveryFee)}` : "\n🚚 Envío: Gratis 🎉"}` +
      `${discount > 0 ? `\n💰 Descuento: -${formatGs(discount)} (${couponCode})` : ""}` +
      `\n\n*Total: ${formatGs(finalTotal)}*\n\n` +
      `👤 ${name}\n📞 ${phone}\n📍 ${address}, ${city}\n📝 ${notes}\n\n💳 Método: ${method === "whatsapp" ? "Consultar" : method === "transfer" ? "Transferencia" : "Efectivo"}`
    )
    
    // Save order to API
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, total: finalTotal, customer: { name, phone, address, city },
          delivery: { fee: deliveryFee }, payment: method, notes,
          coupon: couponCode || null, discount
        })
      })
    } catch {}
    
    if (method === "whatsapp") {
      window.open(`https://wa.me/595981234567?text=${msg}`, "_blank")
      trackWhatsAppClick("checkout_submit")
    }
    clearCart()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <span className="text-6xl mb-4 block">✅</span>
            <h1 className="text-3xl font-bold text-foreground mb-4">Pedido Enviado</h1>
            <p className="text-muted-foreground mb-6">Te contactaremos por WhatsApp para confirmar y coordinar el pago y envío.</p>
            <Link href="/" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Volver al inicio
            </Link>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <span className="text-6xl mb-4 block">🛒</span>
            <h1 className="text-3xl font-bold text-foreground mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">Agregá productos desde la tienda para iniciar tu pedido.</p>
            <Link href="/tienda" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Ver productos
            </Link>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Carrito", href: "/tienda" }, { label: "Checkout" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Finalizar Pedido</h1>

          <div className="grid gap-8 sm:grid-cols-2">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Nombre completo *</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">WhatsApp / Teléfono *</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+595" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Dirección de entrega</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle y número" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Ciudad</label>
                <input value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Notas (opcional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Método de pago</label>
                <select value={method} onChange={e => setMethod(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring">
                  <option value="whatsapp">Consultar por WhatsApp</option>
                  <option value="transfer">Transferencia bancaria</option>
                  <option value="cash">Efectivo contra entrega</option>
                </select>
              </div>
            </form>

            {/* Summary */}
            <div className="space-y-4">
              <DeliveryCalculator subtotal={total} onFeeChange={setDeliveryFee} />
              <CouponInput subtotal={total} onDiscount={(amt, code) => { setDiscount(amt); setCouponCode(code) }} />
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4">Resumen del pedido</h2>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                    <span className="font-medium text-foreground">{formatGs(item.priceGs * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4 space-y-2">
                {discount > 0 && <div className="flex items-center justify-between text-sm"><span className="text-green-600">Descuento ({couponCode})</span><span className="text-green-600">-{formatGs(discount)}</span></div>}
                {deliveryFee > 0 && <div className="flex items-center justify-between text-sm"><span>Envío</span><span>{formatGs(deliveryFee)}</span></div>}
                {deliveryFee === 0 && total > 0 && <div className="flex items-center justify-between text-sm"><span className="text-green-600">Envío</span><span className="text-green-600">Gratis 🎉</span></div>}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatGs(finalTotal)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                Enviar pedido por WhatsApp
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">Te responderemos en minutos para confirmar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function CheckoutPage() {
  return <CartProvider><CheckoutContent /></CartProvider>
}
