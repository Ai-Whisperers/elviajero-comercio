
"use client"
export function exportOrdersCSV(orders: any[]) {
  const headers = ["ID", "Usuario", "Items", "Total", "Estado", "Pago", "Fecha"]
  const rows = orders.map(o => [
    o.id?.slice(0, 8) || "",
    o.user || "Invitado",
    o.items?.length || 0,
    o.total || "",
    o.status || "",
    o.paymentMethod || "",
    o.date ? new Date(o.date).toLocaleDateString("es") : "",
  ])
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = "pedidos-" + new Date().toISOString().slice(0, 10) + ".csv"
  a.click()
  URL.revokeObjectURL(url)
}
