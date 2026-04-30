
"use client"

export function BrandFilter({ brands, selected, onChange }: { brands: string[]; selected: string[]; onChange: (brands: string[]) => void }) {
  const toggle = (brand: string) => {
    if (selected.includes(brand)) onChange(selected.filter(b => b !== brand))
    else onChange([...selected, brand])
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Marca</label>
      <div className="flex flex-wrap gap-2">
        {brands.map(b => (
          <button key={b} onClick={() => toggle(b)}
            className={"rounded-full px-3 py-1 text-xs font-medium transition-all " + (selected.includes(b) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary hover:text-primary")}>
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}
