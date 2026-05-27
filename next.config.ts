import type { NextConfig } from "next"
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; form-action 'self'; base-uri 'self'" },
]

const config: NextConfig = {
  transpilePackages: ["@ai-whisperers"],
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'qyvokpribmbrosafntqa.supabase.co' },
    ],  unoptimized: true },
  output: "standalone",
  async redirects() { return [
    { source: "/s/:path*", destination: "/", permanent: true },
    { source: "/ofertas", destination: "/promociones", permanent: true },
    { source: "/carrito", destination: "/tienda", permanent: true },
    { source: "/cuenta", destination: "/mi-cuenta", permanent: true },
    { source: "/perfil", destination: "/mi-cuenta", permanent: true },
    { source: "/orden/:id", destination: "/pedido/buscar?id=:id", permanent: true },
    { source: "/productos/:slug", destination: "/producto/:slug", permanent: true },
  ] },
}
export default config
