
"use client"
export function ArticleJsonLd({ title, description, image, date, author }: { title: string; description: string; image?: string; date: string; author?: string }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": image || "",
      "datePublished": date,
      "author": { "@type": "Person", "name": author || "El Viajero" },
    })}} />
  )
}
