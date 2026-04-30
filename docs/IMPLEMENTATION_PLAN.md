# El Viajero — Multi-Phase Implementation Plan

> **For Hermes:** Execute phase-by-phase using `subagent-driven-development`.
> Each phase groups related tasks. Deploy after each phase to catch regressions early.

**Goal:** Transform El Viajero from a placeholder site with fake data into a production-ready e-commerce store with real business info, logo/branding, cart + online payments, dynamic promos, and real product images.

**Architecture:** Standalone Next.js 15 app (Tailwind 4, framer-motion), deployed on Docker Swarm at el-viajero.paragu-ai.com. Content-driven from `content/es.json`. Site config in `config/site.json`.

**Build & Deploy:**
```bash
cd /tmp/elviajero-comercio
npm run build
docker build -t elviajero-comercio:prod .
docker service update --force elviajero-comercio_web
```

---

## PHASE 1: Fix Real Business Data (Estimated: 30 min)

Replace ALL fake/placeholder data with real info from the questionnaire.

### Task 1.1: Fix site.json — address, contact, delivery, domain

**Objective:** Correct every fake field in config/site.json

**File:** Modify `config/site.json`

Changes needed:
```json
{
  "domain": "el-viajero.paragu-ai.com",
  "path": "/",
  "publicUrl": "https://el-viajero.paragu-ai.com",
  "defaultLocale": "es",
  "locales": ["es"],
  "contact": {
    "phone": "",             // ← Real phone from owner
    "email": "",             // ← Use domain email when available
    "whatsapp": "",          // ← Real WhatsApp Business
    "instagram": "",         // ← Real handle
    "facebook": "",          // ← Real handle
    "tiktok": ""             // ← Real handle (they have TikTok)
  },
  "location": {
    "address": "Coronel Felipe Toledo, Barrio La Concordia (detrás de Mariam Lubricantes)",
    "city": "Mariano Roque Alonso",
    "department": "Central",
    "country": "Paraguay",
    "googleMapsUrl": "https://maps.google.com/?q=Coronel+Felipe+Toledo+Mariano+Roque+Alonso+Paraguay"
  },
  "hours": {
    "Lunes a Viernes": "",   // ← Real hours
    "Sabado": "",
    "Domingo": ""
  },
  "settings": {
    "delivery": {
      "enabled": true,
      "freeThresholdGs": 0,
      "freeThresholdLabel": "",
      "zones": ["Mariano Roque Alonso", "Asuncion", "Fernando de la Mora", "San Lorenzo", "Lambare", "Luque", "Capiatá"],
      "national": true,
      "expressAvailable": true,
      "expressFee": 0,
      "pickupAvailable": true,
      "pickupAddresses": ["Coronel Felipe Toledo, M.R. Alonso"]
    }
  }
}
```

**Verify:** Run `npm run build` — no type errors.

### Task 1.2: Fix content/es.json — all contact info, address, hours, founder year

**Objective:** Replace every occurrence of fake address/phone/email across all sections.

**File:** Modify `content/es.json`

Find and replace in ALL of these sections:
- `home.hero` (no contact fields here)
- `home.contact` (line ~251-261): address → real, phone → real, whatsapp → real, email → leave blank or domain
- `contacto.info` (line ~407-413): same fields
- `faq.items` (line ~435-476): address in Q1, phone in Q4
- `footer` (line ~650-653): address, phone, hours
- `about.story.paragraphs` (line ~273-278): "2018" → <1 year old (2025-2026)
- `about.hero.subheadline`: "desde 2018" → "recién llegados"

**Verify:** Each page renders the correct address/hours.
```
npm run dev
# Manually check: /, /contacto, /faq, /nosotros
```

### Task 1.3: Fix announcement bar with real promo data

**Objective:** The current hardcoded announcement "Kit Camping Completo — Carpa 4 pers..." should pull from the promociones data.

**File:** Modify `app/page.tsx` line 17

Current:
```tsx
{h.announcement && <div className=...>{h.announcement}</div>}
```

Add `announcement` field to content/es.json `home` section:
```json
{
  "announcement": {
    "text": "Kit Camping Completo — Carpa 4 pers + 2 bolsas de dormir + colchon inflable. Ahorra Gs. 80.000",
    "link": "/promociones"
  }
}
```

Update page.tsx to handle object:
```tsx
{h.announcement && (
  <Link href={h.announcement.link || "/promociones"} className="bg-accent py-2 text-center text-sm font-medium text-accent-foreground block hover:bg-accent/90 transition-colors">
    {h.announcement.text}
  </Link>
)}
```

**Verify:** Announcement bar is a clickable link to /promociones.

---

## PHASE 2: Logo & Branding (Estimated: 45 min)

### Task 2.1: Create logo SVG

**Objective:** Generate a logo for "El Viajero" — outdoor/camping theme, text-based with icon.

**File:** Create `public/images/logo.svg`

**Design specs from questionnaire:**
- Colors: green (#1B5E20), blue (#1565C0), black/graphite (#37474F)
- Style: rústico/natural + aventurero
- Icon suggestion: mountain + tent silhouette or compass + arrow
- Tono: "Descubrí nuevos horizontes..."

**Implementation:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
  <!-- Mountain icon -->
  <path d="M10 45 L25 15 L40 45Z" fill="#1B5E20"/>
  <path d="M25 15 L35 30 L40 45 L25 35 L15 40Z" fill="#1565C0" opacity="0.3"/>
  <!-- Text -->
  <text x="52" y="32" font-family="'Poppins',sans-serif" font-size="20" font-weight="700" fill="#1B5E20">El Viajero</text>
  <text x="52" y="46" font-family="'Inter',sans-serif" font-size="10" fill="#37474F">Todo para tu aventura</text>
</svg>
```

**Verify:** `curl -sI https://el-viajero.paragu-ai.com/images/logo.svg 2>/dev/null | head -2` → 200

### Task 2.2: Update layout with logo and OG image

**Objective:** Replace the `EV` text monogram in header with the real SVG logo.

**File:** Modify `components/header.tsx`

Current (from rendered HTML):
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">EV</div>
<span className="hidden text-lg font-bold text-foreground sm:inline">El Viajero</span>
```

Replace with:
```tsx
<Link href="/" className="flex items-center gap-2">
  <Image src="/images/logo.svg" alt="El Viajero" width={160} height={48} className="h-10 w-auto" />
</Link>
```

**Also update:** `app/layout.tsx` — change og-image to use new logo
```tsx
openGraph: {
  title: "El Viajero — Tu Aventura Empieza Acá",
  description: "Camping, pesca, accesorios para auto y moto, equipo outdoor.",
  images: [{ url: "/images/logo.svg" }]
}
```

**Verify:** Header shows SVG logo instead of "EV" monogram.

### Task 2.3: Update globals.css with chosen brand colors

**Objective:** The questionnaire chose verde selva (#1B5E20), azul cielo (#1565C0), negro/grafito (#37474F). Current colors already match. Review for consistency.

**File:** Review `app/globals.css`

Current colors are already green-primary, dark-secondary, orange-accent. From questionnaire:
- Primary matches "verde naturaleza" ✅
- Accent (E65100) is orange — not in their preferences. Consider changing to blue (#1565C0).

**Change:** Replace accent with blue:
```css
--color-accent: #1565C0;
--color-accent-foreground: #FFFFFF;
```

**Verify:** `npm run build` passes, blue elements appear on site.

---

## PHASE 3: E-commerce — Cart & Online Payments (Estimated: 2h)

This is the biggest feature. The questionnaire says they want:
- "carrito y pago via tarjetas"
- "iniciar sesión y registro"
- "precio anterior y de hoy"

### Task 3.1: Add price history fields to product data

**Objective:** Support `priceBefore` field in addition to `price` for sale pricing.

**File:** Modify `content/es.json` — add `priceBefore` to each product in both catalog copies.

Example change:
```json
{
  "name": "Carpa 4 Personas",
  "category": "Camping",
  "price": "Gs. 450.000",
  "priceBefore": "Gs. 530.000",
  "description": "Impermeable, facil de armar, incluye bolsa de transporte. Ideal para familias.",
  "imageUrl": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"
}
```

**File:** Modify `app/tienda/page.tsx` — show strikethrough old price + sale badge.

In the product card rendering (line ~32-36):
```tsx
<div className="p-4">
  <h4 className="font-semibold text-foreground">{p.name}</h4>
  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
  <div className="mt-2 flex items-baseline gap-2">
    <p className="text-lg font-bold text-primary">{p.price}</p>
    {p.priceBefore && <p className="text-sm text-muted-foreground line-through">{p.priceBefore}</p>}
  </div>
  {p.priceBefore && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">OFERTA</span>}
  <a href=...>  {/* WhatsApp button stays */}
</div>
```

**Verify:** Products with `priceBefore` show old price crossed out + OFERTA badge.

### Task 3.2: Build cart system (client-side)

**Objective:** Add-to-cart functionality using localStorage + React context.

**Files to create:**
- Create `lib/cart-context.tsx` — CartContext + CartProvider
- Create `lib/cart-types.ts` — CartItem, CartState types

**Files to modify:**
- Modify `app/layout.tsx` — wrap with CartProvider
- Modify `app/tienda/page.tsx` — add "Agregar al carrito" button next to WhatsApp button

**lib/cart-types.ts:**
```ts
export interface CartItem {
  name: string
  price: string
  priceGs: number     // parsed numeric for total calculation
  quantity: number
  imageUrl?: string
  category?: string
}

export interface CartState {
  items: CartItem[]
  whatsappPhone: string
}
```

**lib/cart-context.tsx:**
```tsx
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from './cart-types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (name: string) => void
  updateQuantity: (name: string, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  useEffect(() => {
    const saved = localStorage.getItem('viajero-cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])
  
  useEffect(() => {
    localStorage.setItem('viajero-cart', JSON.stringify(items))
  }, [items])
  
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === item.name)
      if (existing) return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  
  const removeItem = (name: string) => setItems(prev => prev.filter(i => i.name !== name))
  const updateQuantity = (name: string, qty: number) => setItems(prev => prev.map(i => i.name === name ? { ...i, quantity: Math.max(1, qty) } : i))
  const clearCart = () => setItems([])
  const total = items.reduce((sum, i) => sum + i.priceGs * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

**Verify:** Can add/remove items from cart, data persists in localStorage across page navigations.

### Task 3.3: Add cart UI — sidebar + badge

**Objective:** Cart badge in header + slide-out cart sidebar.

**Files to create:**
- Create `components/cart-sidebar.tsx` — slide-out drawer with items, totals, checkout button
- Create `components/cart-badge.tsx` — floating badge link

**Files to modify:**
- Modify `app/layout.tsx` — add CartSidebar component
- Modify `components/header.tsx` — add cart icon with item count

**cart-sidebar.tsx:**
```tsx
"use client"
import { useCart } from '@/lib/cart-context'

export function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  
  if (!open) return null
  
  // Format Gs number
  const formatGs = (n: number) => 'Gs. ' + n.toLocaleString('es-PY')
  
  // WhatsApp checkout message
  const checkoutMessage = encodeURIComponent(
    '¡Hola! Quiero hacer un pedido:\n' +
    items.map(i => `- ${i.name} x${i.quantity}: ${formatGs(i.priceGs * i.quantity)}`).join('\n') +
    `\n\nTotal: ${formatGs(total)}\n\n¿Formas de pago y envío?`
  )
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Carrito ({items.length})</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="overflow-y-auto p-4" style={{maxHeight: 'calc(100vh - 200px)'}}>
          {items.length === 0 && <p className="py-10 text-center text-muted-foreground">Tu carrito está vacío</p>}
          {items.map(item => (
            <div key={item.name} className="mb-4 flex items-center gap-3 rounded-lg border p-3">
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-primary font-bold">{formatGs(item.priceGs * item.quantity)}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="h-6 w-6 rounded border text-center text-sm">-</button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="h-6 w-6 rounded border text-center text-sm">+</button>
                  <button onClick={() => removeItem(item.name)} className="ml-auto text-xs text-destructive">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t p-4">
            <p className="mb-2 text-lg font-bold">Total: {formatGs(total)}</p>
            <a href={`https://wa.me/595981234567?text=${checkoutMessage}`} target="_blank" className="mb-2 flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
              Pedir por WhatsApp
            </a>
            <button onClick={clearCart} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Vaciar carrito</button>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Verify:** Click cart icon → sidebar opens with items, totals, WhatsApp checkout button.

### Task 3.4: Add "Agregar al carrito" button to tienda page

**Objective:** In the tienda page, each product card gets an "Agregar" + cart button alongside the WhatsApp button.

**File:** Modify `app/tienda/page.tsx` — replace the product card CTA area to include both buttons.

Parse price string to number:
```tsx
const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, '')) || 0
```

Add handler:
```tsx
import { useCart } from '@/lib/cart-context'
const { addItem } = useCart()
```

In product card, after the WhatsApp button:
```tsx
<button 
  onClick={() => addItem({ name: p.name, price: p.price, priceGs: parseGs(p.price), imageUrl: p.imageUrl, category: p.category })}
  className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
>
  Agregar al carrito
</button>
```

**Verify:** Click "Agregar al carrito" → badge increments → cart sidebar shows the item.

### Task 3.5: Add product detail modal/page

**Objective:** Clicking a product shows a quick-view modal with full info + larger image + quantity selector.

**File:** Create `components/product-modal.tsx`

```tsx
"use client"
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface ProductModalProps {
  product: any
  onClose: () => void
}

export function ProductModal({ product: p, onClose }: ProductModalProps) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, '')) || 0
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Product image */}
        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="mb-4 aspect-video w-full rounded-xl object-cover" />}
        <h2 className="text-2xl font-bold">{p.name}</h2>
        <p className="mt-2 text-muted-foreground">{p.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{p.price}</span>
          {p.priceBefore && <span className="text-muted-foreground line-through">{p.priceBefore}</span>}
        </div>
        {/* Quantity selector */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium">Cantidad:</span>
          <button onClick={() => setQty(Math.max(1, qty-1))} className="h-8 w-8 rounded border text-center">-</button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button onClick={() => setQty(qty+1)} className="h-8 w-8 rounded border text-center">+</button>
        </div>
        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={() => { addItem({ name: p.name, price: p.price, priceGs: parseGs(p.price) * qty, imageUrl: p.imageUrl }); onClose() }}
            className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Agregar al carrito
          </button>
          <a href={`https://wa.me/595981234567?text=${encodeURIComponent('Hola! Me interesa ' + p.name + ' (' + p.price + ')')}`}
            target="_blank" className="flex-1 rounded-lg border border-primary py-3 text-center font-semibold text-primary hover:bg-primary/5">
            Consultar
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Verify:** Click a product → modal opens with full info.

---

## PHASE 4: Dynamic Promo Banner & Seasonal Offers (Estimated: 45 min)

### Task 4.1: Create rotating promo banner component

**Objective:** Replace the static announcement bar with a carousel that cycles through promotions from `content/es.json`.

**File:** Create `components/promo-carousel.tsx`

```tsx
"use client"
import { useState, useEffect, useCallback } from 'react'
import content from '@/content/es.json'

const c = content as any

export function PromoCarousel() {
  const promos = c.promociones?.promotions || []
  const [current, setCurrent] = useState(0)
  
  const next = useCallback(() => setCurrent(prev => (prev + 1) % promos.length), [promos.length])
  
  useEffect(() => {
    if (promos.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, promos.length])
  
  if (promos.length === 0) return null
  
  const promo = promos[current]
  return (
    <div className="relative overflow-hidden bg-accent">
      <a href={promo.ctaHref || "/promociones"} className="block py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
        {promo.badge && <span className="mr-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">{promo.badge}</span>}
        {promo.title}: {promo.description}
      </a>
      {promos.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
          {promos.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

**File:** Modify `app/page.tsx` — replace the hardcoded announcement with `<PromoCarousel />`.

**Verify:** Promo banner cycles every 5s through the 3 promotions (Kit Camping, Combo Pesca, Envío Gratis).

### Task 4.2: Add seasonal offer section to home page

**Objective:** Add a "Ofertas de temporada" section with dynamic promo images between the features grid and the catalog.

**File:** Modify `app/page.tsx`

After the features section (around line 39), add:
```tsx
{promotions.length > 0 && (
  <section className="bg-surface py-16">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Ofertas de Temporada</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((p: any, i: number) => (
          <div key={i} className="group relative overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-video bg-muted">
              {p.image && <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              {p.badge && <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{p.badge}</span>}
              <h3 className="text-lg font-bold text-white">{p.title}</h3>
              <p className="text-sm text-white/80">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
```

Need to add `promotions` to the destructured data at top of page.tsx:
```tsx
const promotions = c.promociones?.promotions || []
```

**Verify:** Home page shows seasonal offers section with cards, badges, gradient overlays.

---

## PHASE 5: Login & Registration (Estimated: 1h)

### Task 5.1: Add auth pages (login + register)

**Objective:** Simple email+password auth with localStorage (no backend — MVP). Will upgrade to Supabase later.

**Files to create:**
- Create `app/login/page.tsx`
- Create `app/register/page.tsx`

**app/login/page.tsx:**
```tsx
"use client"
import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // MVP: validate against localStorage
    const users = JSON.parse(localStorage.getItem('viajero-users') || '[]')
    const user = users.find((u: any) => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('viajero-session', JSON.stringify({ email: user.email, name: user.name }))
      window.location.href = '/'
    } else {
      alert('Email o contraseña incorrectos')
    }
  }
  
  return (
    <><Header />
    <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring" required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring" required />
          <button type="submit" className="rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">Ingresar</button>
          <p className="text-center text-sm text-muted-foreground">¿No tenés cuenta? <Link href="/register" className="text-primary hover:underline">Registrate</Link></p>
        </form>
      </div>
    </section>
    <Footer /></>
  )
}
```

**app/register/page.tsx** — similar form but saves to localStorage.

**navigation update:** Add login link to config/site.json and components/header.tsx:
```tsx
<a href="/login" className="rounded-md px-2 py-2 text-sm font-medium text-foreground">Ingresar</a>
```

**Verify:** Can register, log out, log in. Session persists.

---

## PHASE 6: Real Product Images & Content Deepening (Estimated: 45 min)

### Task 6.1: Generate/upload real product images

**Objective:** Replace Unsplash placeholder images with generated product images.

Generate using inference.sh CLI:
```
infsh flux --prompt "professional product photo: a 4-person camping tent in green, set up on grass, daylight, e-commerce style, white background" --output public/images/productos/carpa-4p.jpg
infsh flux --prompt "product photo: sleeping bag rated 0C, blue and grey, on white background, e-commerce catalog style" --output public/images/productos/bolsa-dormir.jpg
# ... one per product
```

**File:** Update `content/es.json` → change `imageUrl` from unsplash to `/images/productos/...`

**Verify:** All 12+ products show real images, not unsplash placeholders.

### Task 6.2: Expand product catalog to 30+ items

**Objective:** The questionnaire mentions 50-200 products and 6 categories. Add more products.

**File:** Modify `content/es.json` — add more products per category:
- Camping: +5 items (cooler, parrilla portátil, hamaca, toldo, cocina a gas)
- Pesca: +3 items (señuelos, caja de herramientas, red)
- Acc. Personales: +3 items (botas, termo, mochila térmica)
- Automóviles: +2 items (eslingas, extintor)
- Motos: +2 items (guantes, rastreador GPS)
- Campo: +2 items (bebedero, comederos)

Each with: name, category, price, description, imageUrl.

**Verify:** `wc -c content/es.json` shows significant growth.

---

## PHASE 7: UX Polish & Mobile Optimization (Estimated: 30 min)

### Task 7.1: Add framer-motion entry animations

**Objective:** Sections animate in on scroll for a polished feel.

**File:** Create `components/section-animate.tsx`
**File:** Modify `app/page.tsx` — wrap sections with animation wrapper

```tsx
"use client"
import { motion } from 'framer-motion'

export function SectionAnimate({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Verify:** Sections fade+slide in as you scroll.

### Task 7.2: Add loading states and error boundaries

**Objective:** Skeleton loaders for product grid, error boundaries for sections.

**File:** Create `components/error-boundary.tsx`
**File:** Modify `app/tienda/page.tsx` — add loading skeleton

### Task 7.3: Responsive fixes

**Objective:** Audit all pages at 375px width.

Check:
- [ ] Header doesn't overflow on mobile
- [ ] Product cards stack in 2 cols then 1 col
- [ ] Cart sidebar full-width on mobile
- [ ] Hero text is readable at small sizes
- [ ] Footer columns stack vertically

---

## PHASE 8: Domain & DNS (Estimated: 15 min)

### Task 8.1: Purchase tiendaelviajero.com.py

**Action (manual):** Purchase domain through Hostinger or Nic.py.

### Task 8.2: Update Traefik + DNS

**File:** Modify `docker-compose.yml` — add the production domain:
```yaml
- "traefik.http.routers.viajero.rule=Host(`el-viajero.paragu-ai.com`) || Host(`tiendaelviajero.com.py`)"
```

**Action (manual):** Add A record in Cloudflare dashboard:
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` (tiendaelviajero.com.py) | `72.61.44.159` | ✅ Proxied |

---

## Execution Order

```
PHASE 1: Fix data       → Deploy
PHASE 2: Logo/Brand    → Deploy
PHASE 3: E-commerce    → Deploy
PHASE 4: Promo banner  → Deploy
PHASE 5: Auth          → Deploy
PHASE 6: Images        → Deploy
PHASE 7: UX Polish     → Deploy
PHASE 8: Domain        → Deploy
```

Each phase is independently deployable. Deploy after each to catch issues early.
