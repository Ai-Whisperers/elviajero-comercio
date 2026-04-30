"use client"

export function ShareButtons({ productName, productSlug }: { productName: string; productSlug: string }) {
  const url = `https://el-viajero.paragu-ai.com/producto/${productSlug}`
  const shareText = encodeURIComponent(`Mirá ${productName} en El Viajero — ${url}`)

  return (
    <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
      <span>Compartir:</span>
      <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>
      <button onClick={() => { navigator.clipboard.writeText(url) }} className="text-primary hover:underline">Copiar link</button>
    </div>
  )
}
