"use client"

import { useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface WhatsAppCheckoutProps {
  items: CartItem[]
  whatsappNumber?: string
}

export default function WhatsAppCheckout({ items, whatsappNumber = "595984009751" }: WhatsAppCheckoutProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const generateWhatsAppMessage = () => {
    let text = "Hola, quisiera hacer el siguiente pedido:\n\n"

    items.forEach((item, index) => {
      text += `${index + 1}. ${item.name}\n`
      text += `   Cantidad: ${item.quantity}\n`
      text += `   Precio unitario: ${formatPrice(item.price)}\n\n`
    })

    text += `Total: ${formatPrice(total)}\n\n`

    if (message.trim()) {
      text += `Mensaje adicional: ${message}\n\n`
    }

    text += "Quedo a la espera de confirmación."

    return encodeURIComponent(text)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = () => {
    setIsSending(true)
    const waLink = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`
    window.open(waLink, "_blank")
    setTimeout(() => setIsSending(false), 2000)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tu carrito está vacío
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Mensaje adicional (opcional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Domicilio de entrega, horario preferido, consultas..."
          rows={3}
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary resize-none"
        />
      </div>

      <button
        onClick={handleCheckout}
        disabled={isSending}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? (
          "Abriendo WhatsApp..."
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.15-1.241-.554-2.436-1.488-1.498-.969-2.647-1.741-2.647-2.753 0-1.512 1.234-2.736 1.462-2.934.229-.198.565-.198.823.149.347.396 1.875 2.117 2.967 3.165.796.747 1.066.623 1.376.523.372-.1.823-.597 1.851-2.121 1.961-2.363.15-.198.199-.371.149-.747.448-1.411.823-2.734.867-2.967.1-.223.449-.523 1.411-.767 2.734-.998 1.411-.247 1.488-.199 1.488.199v.001c.347 1.462 2.117 2.967 3.165 1.649.998 2.967.523 3.715.347.747.523.748.748.623 1.376.523.747-.1 1.851-2.121 1.961-2.363.15-.198.347-.372.149-.747.199-.198.347-.199.748.149 1.411.823 2.734.867 2.967.1.223.449.523 1.411.767 2.734.998 1.411.247 1.488.199 1.488-.199v-.001c-.347-1.462-2.117-2.967-3.165-1.649-.998-2.967-.523-3.715-.347-.747-.523-.748-.623-1.376-.523-.747.1-1.851 2.121-1.961 2.363-.15.198-.347.372-.149.747-.199.198-.347.199-.748-.149-1.411-.823-2.734-.867-2.967-.1-.223-.449-.523-1.411-.767-2.734-.998-1.411-.247-1.488-.199-1.488.199v.001c-.347-1.462-2.117-2.967-3.165-1.649-.998-2.967-.523-3.715-.347-.747-.523-.748-.623-1.376-.523-.747.1-1.851 2.121-1.961 2.363-.15.198-.347.372-.149.747-.199.198-.347.199-.748-.149-1.411-.823-2.734-.867-2.967-.1-.223-.449-.523-1.411-.767-2.734-.998-1.411-.247-1.488-.199-1.488.199z" />
            </svg>
            Completar Pedido por WhatsApp
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Serás redirigido a WhatsApp para confirmar tu pedido
      </p>
    </div>
  )
}
