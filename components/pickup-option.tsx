
"use client"
export function PickupOption({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all" onClick={onSelect}>
      <input type="checkbox" checked={selected} onChange={onSelect} className="mt-1" />
      <div className="text-sm"><p className="font-medium text-foreground">Retiro en tienda</p><p className="text-muted-foreground">Coronel Felipe Toledo, Mariano Roque Alonso — Gratis</p></div>
    </label>
  )
}
