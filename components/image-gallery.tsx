"use client"
import { useState } from "react"
import Image from "next/image"

interface Props { images: string[]; productName: string; isNew?: boolean; hasDiscount?: boolean }

export function ImageGallery({ images, productName, isNew, hasDiscount }: Props) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!images.length) return (
    <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-muted">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface cursor-crosshair"
        onMouseEnter={() => setZoomed(true)} onMouseLeave={() => setZoomed(false)}>
        <Image src={images[selected]} alt={productName} fill className={"object-contain p-8 transition-transform duration-300 " + (zoomed ? "scale-150" : "scale-100")} priority />
        {isNew && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">NUEVO</span>}
        {hasDiscount && <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">OFERTA</span>}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={"h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all " + (i === selected ? "border-primary" : "border-border")}
              aria-label={"Ver imagen " + (i + 1)}>
              <Image src={src} alt="" width={64} height={64} className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
