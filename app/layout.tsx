import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = {
  title: "El Viajero — Tu Aventura Empieza Acá",
  description: "Camping, pesca, accesorios para auto y moto, equipo outdoor. Todo para tu aventura en Paraguay.",
  icons: { icon: "/images/favicon.svg" },
  openGraph: { title: "El Viajero", description: "Tu aventura empieza acá", images: [{ url: "/images/og-viajero.svg" }] },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="es"><body className="antialiased">{children}</body></html>)
}