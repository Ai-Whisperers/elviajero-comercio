import { ErrorBoundary } from "@/components/error-boundary"
import type { Metadata } from "next"
import "./globals.css"
import { CurrencyProvider } from "@/lib/currency"
import { AnalyticsProvider } from "@/components/analytics"
import { CartProvider } from "@ai-whisperers/commerce/cart/cart-context"
import { ToastProvider } from "@/components/toast"
import content from "@/content/es.json"

const c = content as any
const m = c.layoutMetadata || {}
const base = "https://el-viajero.paragu-ai.com"

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: m.title || "El Viajero — Tu Aventura Empieza Acá",
  description: m.description || "Camping, pesca, accesorios para auto y moto, equipo outdoor.",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
  themeColor: "#1B5E20",
  openGraph: {
    title: m.ogTitle || "El Viajero",
    description: m.ogDescription || "Tu aventura empieza acá",
    images: [{ url: m.ogImage || "/images/og-viajero.png", width: 1200, height: 630 }],
    type: "website",
    locale: "es_PY",
    siteName: m.schemaName || "El Viajero",
  },
  twitter: {
    card: "summary_large_image",
    title: m.ogTitle || "El Viajero",
    description: m.ogDescription || "Tu aventura empieza acá",
    images: [`${base}${m.ogImage || "/images/og-viajero.png"}`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  },
  other: {
    "facebook-domain-verification": process.env.NEXT_PUBLIC_FB_VERIFICATION || "",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": m.schemaName || "El Viajero",
  "description": m.schemaDescription || "Tienda de camping, pesca, accesorios outdoor y más en Paraguay.",
  "url": base,
  "telephone": m.schemaTelephone || "+595981234567",
  "email": m.schemaEmail || "info@tiendaelviajero.com.py",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Coronel Felipe Toledo",
    "addressLocality": "Mariano Roque Alonso",
    "addressRegion": "Central",
    "addressCountry": "PY"
  },
  "openingHours": "Mo-Fr 08:00-19:00, Sa 08:00-17:00, Su 09:00-13:00",
  "priceRange": m.schemaPriceRange || "Gs. 35.000 - Gs. 2.000.000",
  "currenciesAccepted": "PYG, USD",
  "paymentAccepted": "Efectivo, Transferencia, Tarjeta de crédito/débito",
  "sameAs": [
    "https://instagram.com/elviajero_py",
    "https://facebook.com/elviajeropy",
    "https://tiktok.com/@elviajero_py"
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://qyvokpribmbrosafntqa.supabase.co" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <ErrorBoundary>
          <CurrencyProvider>
            <CartProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CartProvider>
          </CurrencyProvider>
        </ErrorBoundary>
        <AnalyticsProvider />
      </body>
    </html>
  )
}
