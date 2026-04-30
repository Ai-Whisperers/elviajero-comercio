"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { CartToastListener } from "@/components/cart-toast-listener"
import { CheckoutStepper } from "@/components/checkout-stepper"
import { ToastProvider } from "@/components/toast"
import { validatePromo, applyPromo, usePromo, getPromoCodes } from "@/lib/promo-codes"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any

const paymentMethods = [
  { id: "transferencia", name: "Transferencia Bancaria", icon: "🏦", desc: "Depósito o transferencia a cuenta bancaria" },
  { id: "mercadopago", name: "Mercado Pago", icon: "💳", desc: "Tarjeta de crédito/débito" },
  { id: "efectivo", name: "Efectivo", icon: "💵", desc: "Pago en efectivo contra entrega" },
  { id: "whatsapp", name: "WhatsApp", icon: "\ud83d\udcac", desc: "Te contactamos para coordinar el pago" },
  { id: "stripe", name: "Tarjeta internacional", icon: "\ud83c\udf10", desc: "Visa, Mastercard, PayPal (USD)" },
]

// City → shipping cost (Gs.)
const shippingRates: Record<string, number> = {
  "asuncion": 10000, "mariano roque alonso": 12000, "lambar": 12000,
  "fernando de la mora": 15000, "san lorenzo": 15000, "luque": 15000,
  "capiatá": 18000, "itau guazú": 18000, "villa elisa": 15000,
  "ñemby": 18000, "limpio": 18000, "san antonio": 18000,
}

const defaultShipping = 25000

function CheckoutForm() {
  const { user, addresses, addOrder } = useAuth()
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [addressId, setAddressId] = useState("")
  const [guestCity, setGuestCity] = useState("")
  const [guestStreet, setGuestStreet] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [note, setNote] = useState("")
  const [promoInput, setPromoInput] = useState("")
  const [promoCode, setPromoCode] = useState<any>(null)
  const [promoError, setPromoError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const formatPrice = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  // Determine shipping
  const city = addresses.find(a => a.id === addressId)?.city?.toLowerCase() || guestCity.toLowerCase()
  const shippingCost = shippingRates[city.trim()] || defaultShipping
  const promoDiscount = promoCode ? total - applyPromo(total, promoCode) : 0
  const totalAfterPromo = total - promoDiscount
  const finalTotal = totalAfterPromo + shippingCost

  const handlePromo = () => {
    setPromoError("")
    const result = validatePromo(promoInput, total)
    if (!result.ok) { setPromoError(result.error || ""); setPromoCode(null) }
    else { setPromoCode(result.promo); setPromoError("") }
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)

    // Use promo
    if (promoCode) usePromo(promoCode)

    const orderId = addOrder({
      items: items.map(i => ({ name: i.name, price: formatPrice(i.priceGs * i.quantity), quantity: i.quantity, imageUrl: i.imageUrl })),
      total: formatPrice(finalTotal),
      addressId: addressId || "guest",
      paymentMethod: paymentMethods.find(p => p.id === paymentMethod)?.name || paymentMethod,
    })

    // Redirect to payment gateway if applicable
    if (paymentMethod === "mercadopago" || paymentMethod === "transferencia") {
      try {
        const res = await fetch("/api/checkout/" + (paymentMethod === "mercadopago" ? "pagopar" : "bancard"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: { id: orderId },
            items: items.map(i => ({ name: i.name, priceGs: i.priceGs * i.quantity, quantity: i.quantity })),
            total: finalTotal,
            customer: { name, email, phone },
          }),
        })
        const data = await res.json()
        if (data.ok && data.redirectUrl) {
          clearCart()
          window.location.href = data.redirectUrl
          return
        }
      } catch {}
    }

    setSubmitting(false)
    setDone(true)
    clearCart()
    setTimeout(() => router.push(`/pedido/confirmado?id=${orderId}`), 1500)
  }

  if (done) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Pedido confirmado</h1>
          <p className="text-muted-foreground mb-6">Te contactaremos por WhatsApp para coordinar</p>
          <Link href="/mi-cuenta/pedidos" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Ver mis pedidos</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <Header />
      <CartToastListener />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Checkout</h1>
          <CheckoutStepper current="info" />

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              {/* Contact info */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">1. Contacto</h2>
                <div className="space-y-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" type="tel" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                  </div>
                  {!user && <p className="text-xs text-muted-foreground">Podés comprar sin cuenta · <Link href="/register" className="text-primary hover:underline">Crear cuenta</Link></p>}
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">2. Envío</h2>
                {user && addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${addressId === addr.id ? "border-primary bg-primary/5" : "border-border"}`}>
                        <input type="radio" name="address" checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="mt-1" />
                        <div className="text-sm"><p className="font-medium text-foreground">{addr.label} — {addr.street}, {addr.city}</p></div>
                      </label>
                    ))}
                    <p className="text-xs text-muted-foreground">Envío: {formatPrice(shippingCost)} a {(addresses.find(a => a.id === addressId)?.city || "")}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input value={guestCity} onChange={e => setGuestCity(e.target.value)} placeholder="Ciudad" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                    <input value={guestStreet} onChange={e => setGuestStreet(e.target.value)} placeholder="Dirección (calle, número, barrio)" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                    {guestCity && <p className="text-xs text-muted-foreground">Envío estimado: {formatPrice(shippingCost)}</p>}
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">3. Pago</h2>
                <div className="space-y-2">
                  {paymentMethods.map(pm => (
                    <label key={pm.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="mt-1" />
                      <div className="text-sm"><p className="font-medium text-foreground">{pm.icon} {pm.name}</p><p className="text-muted-foreground">{pm.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-2 text-lg font-bold text-foreground">Nota (opcional)</h2>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Instrucciones..." className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring resize-none" />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">Resumen</h2>
                <div className="divide-y divide-border max-h-60 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      {item.imageUrl && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted"><img src={item.imageUrl} alt="" className="h-8 w-8 object-contain" /></div>}
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">x{item.quantity}</p></div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(item.priceGs * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex gap-2">
                    <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Código promocional" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
                    <button onClick={handlePromo} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">Aplicar</button>
                  </div>
                  {promoError && <p className="mt-1 text-xs text-destructive">{promoError}</p>}
                  {promoCode && <p className="mt-1 text-xs text-success">✓ {promoCode.type === "percentage" ? `${promoCode.value}%` : formatPrice(promoCode.value)} de descuento</p>}
                  <div className="mt-2 space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                    {promoDiscount > 0 && <div className="flex justify-between text-success"><span>Descuento</span><span>-{formatPrice(promoDiscount)}</span></div>}
                    <div className="flex justify-between text-muted-foreground"><span>Envío</span><span>{formatPrice(shippingCost)}</span></div>
                    <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold text-foreground"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={!name || !paymentMethod || (!city && !guestStreet) || submitting || items.length === 0}
                  className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 active:scale-[0.98]">
                  {submitting ? "Procesando..." : "Confirmar pedido"}
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">Te contactaremos por WhatsApp para confirmar</p>
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
  return (
    <CartProvider>
      <ToastProvider>
        <AuthProvider>
          <CheckoutForm />
        </AuthProvider>
      </ToastProvider>
    </CartProvider>
  )
}
