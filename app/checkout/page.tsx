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
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any

const paymentMethods = [
  { id: "transferencia", name: "Transferencia Bancaria", icon: "🏦", desc: "Depósito o transferencia a cuenta bancaria" },
  { id: "mercadopago", name: "Mercado Pago", icon: "💳", desc: "Tarjeta de crédito/débito" },
  { id: "efectivo", name: "Efectivo", icon: "💵", desc: "Pago en efectivo contra entrega" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", desc: "Te contactamos para coordinar el pago" },
]

function CheckoutForm() {
  const [step, setStep] = useState("info")
  const { user, addresses, addOrder } = useAuth()
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [addressId, setAddressId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const formatPrice = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  const handleSubmit = () => {
    if (submitting) return
    setSubmitting(true)
    const orderId = addOrder({
      items: items.map(i => ({ name: i.name, price: formatPrice(i.priceGs * i.quantity), quantity: i.quantity, imageUrl: i.imageUrl })),
      total: formatPrice(total),
      addressId,
      paymentMethod: paymentMethods.find(p => p.id === paymentMethod)?.name || paymentMethod,
    })
    setSubmitting(false)
    setDone(true)
    clearCart()
    setTimeout(() => router.push(`/pedido/confirmado?id=${orderId}`), 1500)
  }

  const totalWithShipping = total + (total > 0 ? 15000 : 0)

  if (done) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Pedido confirmado</h1>
          <p className="text-muted-foreground mb-6">Te enviamos los detalles a tu WhatsApp</p>
          <Link href="/mi-cuenta/pedidos" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Ver mis pedidos
          </Link>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          </div>
          <CheckoutStepper current={step} />

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: Contact info */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">1. Información de contacto</h2>
                <div className="space-y-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" type="tel" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                  </div>
                </div>
              </div>

              {/* Step 2: Address */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">2. Dirección de envío</h2>
                {!user ? (
                  <div className="text-sm text-muted-foreground">
                    <Link href="/login?redirect=/checkout" className="font-semibold text-primary hover:underline">Iniciá sesión</Link> para usar tus direcciones guardadas
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No tenés direcciones guardadas.{" "}
                    <Link href="/mi-cuenta/direcciones" className="font-semibold text-primary hover:underline">Agregá una</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${addressId === addr.id ? "border-primary bg-primary/5" : "border-border"}`}>
                        <input type="radio" name="address" value={addr.id} checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="mt-1" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{addr.label || "Dirección"}</p>
                          <p className="text-muted-foreground">{addr.street}, {addr.city}</p>
                          {addr.phone && <p className="text-muted-foreground">📞 {addr.phone}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Payment */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">3. Método de pago</h2>
                <div className="space-y-2">
                  {paymentMethods.map(pm => (
                    <label key={pm.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="mt-1" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{pm.icon} {pm.name}</p>
                        <p className="text-muted-foreground">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-2 text-lg font-bold text-foreground">Nota (opcional)</h2>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Instrucciones especiales..." className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring resize-none" />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-4 text-lg font-bold text-foreground">Resumen del pedido</h2>
                <div className="divide-y divide-border">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      {item.imageUrl && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <img src={item.imageUrl} alt="" className="h-8 w-8 object-contain" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(item.priceGs * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span>{total > 0 ? formatPrice(15000) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-2">
                    <span>Total</span>
                    <span>{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={!name || !paymentMethod || (addresses.length > 0 && !addressId) || submitting || items.length === 0}
                  className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 active:scale-[0.98]">
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
