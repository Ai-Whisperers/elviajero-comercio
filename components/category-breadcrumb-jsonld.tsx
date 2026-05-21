
"use client"
export function CategoryBreadcrumbJsonLd({ category, name }: { category: string; name: string }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tiendaelviajero.com.py/" },
        { "@type": "ListItem", "position": 2, "name": "Tienda", "item": "https://tiendaelviajero.com.py/tienda" },
        { "@type": "ListItem", "position": 3, "name": name, "item": "https://tiendaelviajero.com.py/categoria/" + category },
      ]
    })}} />
  )
}
