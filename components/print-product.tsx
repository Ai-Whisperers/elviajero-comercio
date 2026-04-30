
"use client"
export function PrintProductButton({ product }: { product: any }) {
  const print = () => {
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write('<!DOCTYPE html><html><head><title>' + product.name + '</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto} h1{color:#1B5E20} .price{font-size:24px;color:#1B5E20;font-weight:bold} .meta{color:#666;margin:20px 0} table{width:100%;border-collapse:collapse} td{padding:8px;border-bottom:1px solid #eee} .label{color:#999}</style></head><body>' +
      '<h1>' + product.name + '</h1>' +
      '<p class="price">' + product.price + '</p>' +
      (product.priceBefore ? '<p style="color:#999;text-decoration:line-through">' + product.priceBefore + '</p>' : "") +
      '<div class="meta">' +
      (product.brand ? '<p><strong>Marca:</strong> ' + product.brand + '</p>' : "") +
      (product.category ? '<p><strong>Categoría:</strong> ' + product.category + '</p>' : "") +
      (product.specs ? '<p><strong>Especificaciones:</strong> ' + product.specs + '</p>' : "") +
      (product.weight ? '<p><strong>Peso:</strong> ' + product.weight + '</p>' : "") +
      '<p><strong>Stock:</strong> ' + (product.stock > 0 ? "En stock (" + product.stock + ")" : "Agotado") + '</p>' +
      '</div>' +
      (product.description ? '<p>' + product.description + '</p>' : "") +
      '<p style="margin-top:40px;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:10px">El Viajero - el-viajero.paragu-ai.com</p>' +
      '</body></html>')
    win.document.close()
    win.print()
  }

  return (
    <button onClick={print} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-all hover:bg-muted" aria-label="Imprimir">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      Imprimir
    </button>
  )
}
