"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useState } from "react"
import { SafeImage } from "@/components/safe-image"
import { PriceUSD } from "@/components/price-usd"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { useWishlist } from "@/lib/wishlist"
import { getProductWhatsappUrl } from "@/lib/content-resolver"

// NOTE: JSON import removed - using hardcoded Spanish labels
// Migration 008 created ej_site_config as source of truth
const LABELS = {
  sale: "OFERTA",
  soldOut: "Agotado",
  addFav: "Agregar a favoritos",
  removeFav: "Quitar de favoritos",
  add: "Agregar",
  details: "Ver detalles",
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü]+/g, "-")
    .replace(/-+$/, "")
}

function parseGs(priceStr: string) {
  return parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0
}

interface Product {
  id?: string
  name: string
  price: string
  priceBefore?: string
  imageUrl?: string
  category?: string
  stock?: number
  specs?: string
  slug?: string
}

export function ProductCard({ product, onClick }: { product: Product; onClick?: (p: Product) => void }) {
  const { addItem } = useCart()
  const { isWished, toggle } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)

  const hasStock = (product.stock ?? 999) > 0
  const priceVal = parseGs(product.price)
  const isOnSale = !!product.priceBefore && parseGs(product.priceBefore) > priceVal

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasStock) return
    addItem({
      id: product.id || product.slug || slugify(product.name),
      productId: product.id || product.slug || slugify(product.name),
      name: product.name,
      price: product.price,
      priceGs: priceVal,
      image: product.imageUrl,
      category: product.category,
      priceBefore: product.priceBefore,
    })
  }, [product, hasStock, priceVal, addItem])

  const productHref = `/producto/${product.slug || slugify(product.name)}`

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <Link
        href={productHref}
        onClick={() => onClick?.(product)}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {product.imageUrl ? (
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            containerClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}

        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
            {LABELS.sale}
          </span>
        )}

        {/* Out of stock overlay */}
        {!hasStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
              {LABELS.soldOut}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.name) }}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all duration-200 ${
            isWished(product.name)
              ? "bg-white text-red-500"
              : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
          } ${isHovered || isWished(product.name) ? "opacity-100" : "opacity-0"}`}
          aria-label={isWished(product.name) ? LABELS.removeFav : LABELS.addFav}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWished(product.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={productHref} onClick={() => onClick?.(product)} className="block">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          {product.specs && (
            <p className="mt-0.5 text-[11px] text-muted-foreground/60 line-clamp-1">{product.specs}</p>
          )}
        </Link>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <p className="text-lg font-bold text-foreground">{product.price}</p>
          {priceVal > 0 && <PriceUSD pygStr={product.price} />}
          {isOnSale && product.priceBefore && (
            <p className="text-sm text-muted-foreground line-through">{product.priceBefore}</p>
          )}
        </div>

        {/* Add to cart */}
        <button
          disabled={!hasStock}
          onClick={handleAdd}
          className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
            hasStock
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {hasStock ? LABELS.add : LABELS.soldOut}
        </button>

        {/* Comprar por WhatsApp */}
        <a
          href={getProductWhatsappUrl(
            product.name,
            product.price,
            typeof window !== "undefined" ? `${window.location.origin}/producto/${product.slug || slugify(product.name)}` : "",
          )}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-[0.97]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  )
}
