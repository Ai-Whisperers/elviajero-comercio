"use client"
import { useRef } from "react"

interface PackingSlipProps {
  order: any
  onClose: () => void
}

export function PackingSlip({ order, onClose }: PackingSlipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || []

  const print = () => {
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`
      <html><head><title>Pedido #${order.id?.slice(0, 8)}</title>
      <style>
        body { font-family: monospace; font-size: 12px; padding: 20px; max-width: 300px; margin: 0 auto; }
        h1 { font-size: 16px; text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { text-align: left; padding: 4px 2px; border-bottom: 1px dotted #ccc; }
        .total { font-size: 14px; font-weight: bold; text-align: right; margin-top: 10px; }
        .address { margin: 10px 0; padding: 8px; border: 1px solid #ccc; }
        .footer { text-align: center; font-size: 10px; margin-top: 20px; color: #666; }
        @media print { body { margin: 0; padding: 10px; } }
      </style></head><body>
      <h1>🧭 EL VIAJERO</h1>
      <p style="text-align:center;font-size:10px;">Coronel Felipe Toledo, Mariano Roque Alonso</p>
      <p style="text-align:center;font-size:10px;">+595 984 009 751</p>
      <hr>
      <p><strong>Pedido:</strong> #${order.id?.slice(0, 8)}</p>
      <p><strong>Fecha:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString("es-PY") : ""}</p>
      <p><strong>Estado:</strong> ${order.status}</p>
      <p><strong>Pago:</strong> ${order.payment_method || "—"}</p>
      <hr>
      <div class="address">
        <strong>Dirección de envío:</strong><br>
        ${order.address_id || "Retiro en tienda"}<br>
        ${order.note || ""}
      </div>
      <table>
        <tr><th>Cant</th><th>Producto</th><th>Precio</th></tr>
        ${items.map((i: any) => `<tr><td>${i.quantity || 1}</td><td>${i.name}</td><td>${i.price || ""}</td></tr>`).join("")}
      </table>
      <p class="total">Total: ${order.total}</p>
      <hr>
      <div class="footer">Gracias por tu compra! 🏕️</div>
      <script>window.print();window.close();</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-4">🧾 Comprobante de pedido</h2>
        <div ref={ref} className="space-y-2 text-sm text-gray-300 mb-6">
          <p><span className="text-gray-500">Pedido:</span> #{order.id?.slice(0, 8)}</p>
          <p><span className="text-gray-500">Cliente:</span> {order.user_id?.slice(0, 8) || "Invitado"}</p>
          <p><span className="text-gray-500">Total:</span> {order.total}</p>
          <p><span className="text-gray-500">Pago:</span> {order.payment_method || "—"}</p>
          <p><span className="text-gray-500">Estado:</span> {order.status}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={print} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">🖨️ Imprimir</button>
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-400 hover:text-white">Cerrar</button>
        </div>
      </div>
    </div>
  )
}
