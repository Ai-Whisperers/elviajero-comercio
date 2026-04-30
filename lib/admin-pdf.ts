export function exportDashboardPDF(stats: { users: number; orders: number; revenue: number }) {
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Dashboard El Viajero</title><style>body{font-family:Arial;padding:40px}h1{color:#1B5E20}.card{display:inline-block;border:1px solid #ddd;border-radius:8px;padding:20px;margin:8px;min-width:150px;text-align:center}.value{font-size:28px;font-weight:bold;color:#1B5E20}.label{color:#666;font-size:12px}</style></head><body>' +
    '<h1>Dashboard - El Viajero</h1><p>' + new Date().toLocaleDateString("es", { dateStyle: "long" }) + '</p>' +
    '<div class="card"><div class="value">' + stats.users + '</div><div class="label">Usuarios</div></div>' +
    '<div class="card"><div class="value">' + stats.orders + '</div><div class="label">Pedidos</div></div>' +
    '<div class="card"><div class="value">Gs. ' + stats.revenue.toLocaleString("es-PY") + '</div><div class="label">Ingresos</div></div>' +
    '</body></html>'
  const win = window.open("", "_blank")
  if (win) { win.document.write(html); win.document.close(); win.print() }
}
