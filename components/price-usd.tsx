"use client"
export function PriceUSD({ pygStr }: { pygStr: string }) {
  const n = parseInt(pygStr.replace(/[^\d]/g, ""), 10) || 0
  const usd = n / 7400
  return (
    <span className="text-xs text-muted-foreground/60 ml-1">
      ≈ USD {usd.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
    </span>
  )
}
