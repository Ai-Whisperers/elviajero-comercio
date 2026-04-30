import Link from "next/link"

export function Footer({ businessName, email, whatsapp, instagram, facebook }: {
  businessName?: string; email?: string; whatsapp?: string
  instagram?: string; facebook?: string
}) {
  return (
    <footer className="bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold">{businessName || "El Viajero"}</h3>
            <p className="text-sm text-white/70">Mariano Roque Alonso, Paraguay</p>
            <p className="text-sm text-white/70">Coronel Felipe Toledo (detrás de Mariam Lubricantes)</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Enlaces</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-white/80 hover:text-white">Inicio</Link>
              <Link href="/tienda" className="text-white/80 hover:text-white">Tienda</Link>
              <Link href="/productos" className="text-white/80 hover:text-white">Productos</Link>
              <Link href="/nosotros" className="text-white/80 hover:text-white">Nosotros</Link>
              <Link href="/contacto" className="text-white/80 hover:text-white">Contacto</Link>
              <Link href="/faq" className="text-white/80 hover:text-white">FAQ</Link>
              <Link href="/privacidad" className="text-white/80 hover:text-white">Privacidad</Link>
              <Link href="/terminos" className="text-white/80 hover:text-white">Términos</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm">
              {email && <a href={`mailto:${email}`} className="text-white/80 hover:text-white">{email}</a>}
              {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/[^\\d]/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">WhatsApp</a>}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Seguinos</h4>
            <div className="flex flex-col gap-2 text-sm">
              {instagram && <a href={`https://instagram.com/${instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">Instagram</a>}
              {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">Facebook</a>}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} {businessName || "El Viajero"}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
