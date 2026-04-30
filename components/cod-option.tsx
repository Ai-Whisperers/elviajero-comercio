
"use client"
export function CodOption({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all" onClick={onSelect}>
      <input type="radio" name="cod" checked={selected} onChange={onSelect} className="mt-1" />
      <div className="text-sm"><p className="font-medium text-foreground">Pago contra entrega</p><p className="text-muted-foreground">Pagás en efectivo cuando recibís el producto</p></div>
    </label>
  )
}
