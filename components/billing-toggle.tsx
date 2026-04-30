
"use client"
export function BillingAddressToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-all">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded" />
      <div className="text-sm"><p className="font-medium text-foreground">La dirección de envío es la misma que la de facturación</p></div>
    </label>
  )
}
