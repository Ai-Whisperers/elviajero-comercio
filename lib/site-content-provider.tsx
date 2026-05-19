"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

/**
 * SiteContentProvider - Supabase-only content provider
 * Replaces content/es.json imports with Supabase data
 * Implements Fase 2: Remove JSON imports
 */

export interface NavigationItem {
  label: string
  href: string
}

export interface Navigation {
  businessName: string
  ctaText: string
  ctaHref: string
  items: NavigationItem[]
}

export interface SiteContent {
  siteName: string
  businessName: string
  tagline: string
  founded: string
  whatsappNumber: string
  whatsappMessage: string
  navigation: Navigation
  products?: any[]
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Fetch all site config using our SQL function
        const { data: configData, error: configError } = await supabase
          .rpc('get_all_site_config')

        if (configError) {
          throw new Error(`Failed to fetch site config: ${configError.message}`)
        }

        // Fetch products from Supabase
        const { data: products, error: productsError } = await supabase
          .from('ej_products')
          .select('id, name, slug, price, discount_price, image_url, stock, available, description, category_id')
          .order('name', { ascending: true })

        if (productsError) {
          throw new Error(`Failed to fetch products: ${productsError.message}`)
        }

        // Build content object from config
        const siteContent: SiteContent = {
          siteName: configData?.siteName || "El Viajero",
          businessName: configData?.businessName || "El Viajero",
          tagline: configData?.tagline || "Todo para tu Aventura",
          founded: configData?.founded || "2018",
          whatsappNumber: configData?.whatsappNumber || "+595984009751",
          whatsappMessage: configData?.whatsappMessage || "Hola! Quisiera informacion sobre productos",
          navigation: configData?.navigation || {
            businessName: "El Viajero",
            ctaText: "Pedir por WhatsApp",
            ctaHref: "https://wa.me/595984009751?text=Hola!%20Quisiera%20informacion%20sobre%20productos",
            items: [
              { label: "Inicio", href: "/" },
              { label: "Tienda", href: "/tienda" },
              { label: "Blog", href: "/blog" },
              { label: "Nosotros", href: "/nosotros" },
              { label: "Ofertas", href: "/promociones" },
              { label: "FAQ", href: "/faq" },
              { label: "Contacto", href: "/contacto" }
            ]
          },
          products: products || []
        }

        setContent(siteContent)
        setLoading(false)
      } catch (err) {
        console.error('[SiteContentProvider] Error:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { content, loading, error }
}

/**
 * Server-side function to fetch site content
 * Use this in Server Components (no client-side state)
 */
export async function getSiteContentSSR() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: configData, error: configError } = await supabase
    .rpc('get_all_site_config')

  if (configError) {
    throw new Error(`Failed to fetch site config: ${configError.message}`)
  }

  const { data: products, error: productsError } = await supabase
    .from('ej_products')
    .select('id, name, slug, price, discount_price, image_url, stock, available, description, category_id')
    .order('name', { ascending: true })

  if (productsError) {
    throw new Error(`Failed to fetch products: ${productsError.message}`)
  }

  const siteContent: SiteContent = {
    siteName: configData?.siteName || "El Viajero",
    businessName: configData?.businessName || "El Viajero",
    tagline: configData?.tagline || "Todo para tu Aventura",
    founded: configData?.founded || "2018",
    whatsappNumber: configData?.whatsappNumber || "+595984009751",
    whatsappMessage: configData?.whatsappMessage || "Hola! Quisiera informacion sobre productos",
    navigation: configData?.navigation || {
      businessName: "El Viajero",
      ctaText: "Pedir por WhatsApp",
      ctaHref: "https://wa.me/595984009751?text=Hola!%20Quisiera%20informacion%20sobre%20productos",
      items: [
        { label: "Inicio", href: "/" },
        { label: "Tienda", href: "/tienda" },
        { label: "Blog", href: "/blog" },
        { label: "Nosotros", href: "/nosotros" },
        { label: "Ofertas", href: "/promociones" },
        { label: "FAQ", href: "/faq" },
        { label: "Contacto", href: "/contacto" }
      ]
    },
    products: products || []
  }

  return siteContent
}
