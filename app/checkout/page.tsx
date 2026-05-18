"use client"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { useState, useEffect, useCallback } from "react"
import { CouponInput } from "@/components/coupon-input"
import { useRouter } from "next/navigation"
import { createClient } from "@ai-whisperers/auth/supabase/client"
import content from "@/content/es.json"

const c = content as any
const WHATSAPP_NUMBER = c.home?.productCatalog?.whatsappPhone || c.home?.contact?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "595981234567"

const SHIPPING_ZONES = [
  { id: "asu", name: "Asunción", fee: 15000, freeFrom: 300000 },
  { id: "central", name: "Área Metropolitana", fee: 25000, freeFrom: 400000 },
  { id: "interior", name: "Interior del país", fee: 40000, freeFrom: 500000 },
  { id: "pickup", name: "Retiro en tienda", fee: 0, freeFrom: 0 },
]

function CheckoutForm() {
  const { user, addresses = [] } = useAuth()
  const { items = [], total = 0, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [shippingZone, setShippingZone] = useState("asu")
  const [paymentMethod, setPaymentMethod] = useState("whatsapp")
  const [customer, setCustomer] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [selectedAddress, setSelectedAddress] = useState("")
  const [addressForm, setAddressForm] = useState({ street: "", city: "", phone: "" })

  const [discount, setDiscount] = useState(0)
  const [discountCode, setDiscountCode] = useState("")

  const zone = SHIPPING_ZONES.find(z => z.id === shippingZone)!
  const shipping = total >= zone.freeFrom ? 0 : zone.fee
  const grandTotal = total + shipping - discount

  const handleDiscount = useCallback((amount: number, code: string) => {
    setDiscount(amount)
    setDiscountCode(code)
  }, [])

  useEffect(() => {
    if (user) {
      setCustomer({ name: user.name, email: user.email, phone: user.phone })
    }
  }, [user])

  const placeOrder = async () => {
    setLoading(true)
    setError("")

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()

    // Save order via API route (handles WhatsApp notification to admin)
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        user_id: user?.id || null,
        items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: "Gs. " + grandTotal.toLocaleString("es-PY"),
        status: "pendiente",
        address_id: selectedAddress || addressForm.street,
        payment_method: paymentMethod,
        note: "Zona: " + zone.name,
        customer_name: customer.name,
        customer_phone: customer.phone || addressForm.phone || user?.phone || "",
        customer_email: customer.email,
      }),
    })
    const orderData = await res.json().catch(() => null)
    if (!res.ok || !orderData) {
      setError(orderData?.error || "Error al crear el pedido. Intentá de nuevo.")
      setLoading(false)
      return
    }

    if (paymentMethod === "whatsapp") {
      const msg = encodeURIComponent(
        "¡Hola! Quiero confirmar mi pedido:\n" +
        items.map(i => `- ${i.name} x${i.quantity}: ${i.price}`).join("\n") +
        `\n\nSubtotal: Gs. ${total.toLocaleString("es-PY")}` +
        `\nEnvío: Gs. ${shipping.toLocaleString("es-PY")} (${zone.name})` +
        (discount > 0 ? `\nDescuento (${discountCode}): -Gs. ${discount.toLocaleString("es-PY")}` : "") +
        `\nTotal: Gs. ${grandTotal.toLocaleString("es-PY")}` +
        `\n\nCliente: ${customer.name}` +
        `\nTel: ${customer.phone}` +
        `\nDirección: ${addressForm.street}, ${addressForm.city}`
      )
      clearCart()
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
    } else {
      // Call unified checkout API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: paymentMethod,
          order: { id: orderId },
          items,
          total: "Gs. " + grandTotal.toLocaleString("es-PY"),
          customer,
        }),
      })
      const data = await res.json()
      if (data.ok && data.redirectUrl) {
        clearCart()
        router.push(data.redirectUrl)
      } else {
        setError(data.error || "Error al procesar el pago")
      }
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <section className="flex min-h-[50vh] items-center justify-center bg-background px-4">
          <div className="text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">Agregá productos para iniciar el checkout</p>
            <button onClick={() => router.push("/tienda")} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
              Ir a la tienda
            </button>
          </div>
        </section>
        <Footer /><CookieConsent />
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* Progress */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Datos' : s === 2 ? 'Envío' : 'Pago'}
                </span>
                {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {/* Step 1: Customer data */}
          {step === 1 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Tus datos</h2>
              <div className="space-y-4">
                <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                  placeholder="Nombre completo" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" required />
                <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})}
                  placeholder="Email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" required />
                <input type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
                  placeholder="Teléfono" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" required />
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setStep(2)} className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Envío</h2>
              <div className="space-y-3 mb-6">
                {SHIPPING_ZONES.map((z) => (
                  <label key={z.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${shippingZone === z.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="zone" checked={shippingZone === z.id} onChange={() => setShippingZone(z.id)} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{z.name}</p>
                        {z.fee > 0 && <p className="text-xs text-muted-foreground">
                          {total >= z.freeFrom ? '¡Envío gratis!' : `Gs. ${z.fee.toLocaleString('es-PY')}`}
                          {total < z.freeFrom && ` (gratis desde Gs. ${z.freeFrom.toLocaleString('es-PY')})`}
                        </p>}
                        {z.id === "pickup" && <p className="text-xs text-muted-foreground">Coronel Felipe Toledo, Mariano Roque Alonso</p>}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{z.fee === 0 ? 'Gratis' : 'Gs. ' + z.fee.toLocaleString('es-PY')}</span>
                  </label>
                ))}
              </div>

              {shippingZone !== "pickup" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Dirección de entrega</h3>
                  {addresses && addresses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {addresses.map(a => (
                        <button key={a.id} onClick={() => setSelectedAddress(a.id)}
                          className={`rounded-lg border px-3 py-2 text-xs transition-all ${selectedAddress === a.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                          {a.label || a.street}
                        </button>
                      ))}
                    </div>
                  )}
                  <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})}
                    placeholder="Calle y número" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" />
                  <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                    placeholder="Ciudad" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" />
                  <input type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                    placeholder="Teléfono de contacto" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring" />
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-light">Atrás</button>
                <button onClick={() => setStep(3)} className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Continuar</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Método de pago</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "whatsapp", label: "WhatsApp / Transferencia", desc: "Te contactamos para coordinar el pago", icon: "💬" },
                  { id: "pagopar", label: "Pagopar", desc: "Tarjetas de crédito/débito, transferencia, pagaré", icon: "💳" },
                  { id: "bancard", label: "Bancard", desc: "Visa, Mastercard — 3, 6 y 12 cuotas", icon: "💳" },
                ].map((pm) => (
                  <label key={pm.id} className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{pm.icon} {pm.label}</p>
                        <p className="text-xs text-muted-foreground">{pm.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <CouponInput subtotal={total} onDiscount={handleDiscount} />

              {/* Order summary */}
              <div className="rounded-lg bg-muted p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Resumen del pedido</h3>
                {items.map(i => (
                  <div key={i.name} className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{i.name} x{i.quantity}</span>
                    <span className="text-foreground font-medium">Gs. {((i.priceGs ?? 0) * i.quantity).toLocaleString('es-PY')}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">Gs. {total.toLocaleString('es-PY')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío ({zone.name})</span>
                    <span className="text-foreground">{shipping === 0 ? 'Gratis' : 'Gs. ' + shipping.toLocaleString('es-PY')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Descuento ({discountCode})</span>
                      <span className="text-green-600">-Gs. {discount.toLocaleString('es-PY')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">Gs. {grandTotal.toLocaleString('es-PY')}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-light">Atrás</button>
                <button onClick={placeOrder} disabled={loading}
                  className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {loading ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )
}

export default function CheckoutPage() {
  return (
    <AuthProvider>
      <CheckoutForm />
    </AuthProvider>
  )
}
