
"use client"
export function downloadInvoice(order: any) {
  const itemsHtml = (order.items || []).map((i: any) =>
    "<tr><td style='padding:8px;border-bottom:1px solid #ddd'>" + i.name + " x" + i.quantity + "</td><td style='padding:8px;border-bottom:1px solid #ddd;text-align:right'>" + i.price + "</td></tr>"
  ).join("")
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Factura #' + (order.id?.slice(0,8) || "") + '</title></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px">' +
    '<div style="border-bottom:2px solid #1B5E20;padding-bottom:20px;margin-bottom:20px">' +
    '<h1 style="color:#1B5E20;margin:0">El Viajero</h1>' +
    '<p style="color:#666;margin:4px 0 0">Coronel Felipe Toledo, Mariano Roque Alonso</p></div>' +
    '<h2>Factura #' + (order.id?.slice(0,8) || "") + '</h2>' +
    '<p>Fecha: ' + new Date(order.date).toLocaleDateString("es", { dateStyle: "long" }) + '</p>' +
    '<p>Estado: ' + order.status + '</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:20px 0">' +
    '<tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Producto</th><th style="padding:8px;text-align:right">Precio</th></tr>' +
    itemsHtml +
    '</table>' +
    '<div style="border-top:2px solid #1B5E20;padding:10px 0;text-align:right;font-size:18px;font-weight:bold">Total: ' + order.total + '</div>' +
    '<p style="color:#999;font-size:12px;margin-top:40px">Gracias por tu compra</p></body></html>'
  
  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "factura-" + (order.id?.slice(0,8) || "pedido") + ".html"
  a.click()
  URL.revokeObjectURL(url)
}
