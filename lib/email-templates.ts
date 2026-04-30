
export function orderConfirmationHtml(order: { id: string; total: string; items: { name: string; price: string; quantity: number }[]; date: string }): string {
  const itemsHtml = order.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name} x${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.price}</td></tr>`).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#1B5E20;color:white;padding:20px;text-align:center;border-radius:10px 10px 0 0">
      <h1 style="margin:0;font-size:20px">✅ Pedido Confirmado</h1>
    </div>
    <div style="border:1px solid #e0e0e0;border-top:0;padding:20px;border-radius:0 0 10px 10px">
      <p>Gracias por tu compra en <strong>El Viajero</strong>.</p>
      <p style="color:#666">Número de pedido: <strong>#${order.id?.slice(0, 8) || ""}</strong></p>
      <p style="color:#666">Fecha: ${new Date(order.date).toLocaleDateString("es", { dateStyle: "long" })}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsHtml}</table>
      <div style="border-top:2px solid #1B5E20;padding:8px 0;text-align:right;font-size:18px;font-weight:bold">Total: ${order.total}</div>
      <p style="color:#666;margin-top:16px">Te contactaremos por WhatsApp para coordinar la entrega.</p>
      <p style="color:#999;font-size:12px;margin-top:20px">El Viajero — Coronel Felipe Toledo, Mariano Roque Alonso</p>
    </div></body></html>`
}

export function passwordResetHtml(token: string): string {
  const url = process.env.NEXT_PUBLIC_BASE_URL + "/recuperar/" + token
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#1B5E20;color:white;padding:20px;text-align:center;border-radius:10px"><h1 style="margin:0;font-size:20px">Restablecer contraseña</h1></div>
    <div style="border:1px solid #e0e0e0;border-top:0;padding:20px;border-radius:0 0 10px 10px">
      <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
      <a href="${url}" style="display:inline-block;background:#1B5E20;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin:16px 0">Restablecer contraseña</a>
      <p style="color:#999;font-size:12px">El link expira en 1 hora. Si no solicitaste esto, ignorá este mensaje.</p>
    </div></body></html>`
}
