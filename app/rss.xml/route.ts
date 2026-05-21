
import content from "@/content/es.json"

const c = content as any
const posts = c.blog?.posts || []

export async function GET() {
  const baseUrl = "https://tiendaelviajero.com.py"
  const items = posts.map((p: any) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description><![CDATA[${p.excerpt || p.text?.substring(0, 200) || ""}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${p.slug}</guid>
    </item>
  `).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>El Viajero - Blog</title>
      <link>${baseUrl}/blog</link>
      <description>Consejos de camping, pesca y outdoor en Paraguay</description>
      <language>es</language>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}
