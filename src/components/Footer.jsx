// src/components/Footer.jsx
function Column({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(({ label, href }, i) => (
          <li key={i}>
            <a
              href={href}
              className="text-gray-300 hover:text-white transition"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0f161b] border-t border-[#22303C] mt-0">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + copy */}
          <div>
            <div className="inline-block rounded px-2 py-1 bg-[#45f983] text-black font-bold">
              TIOHUNTER
            </div>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              All rights reserved {new Date().getFullYear()}
            </p>
          </div>

          <Column
            title="Políticas"
            links={[
              { label: "Términos y condiciones", href: "#" },
              { label: "Política de privacidad", href: "#" },
              { label: "Preguntas frecuentes", href: "#" },
              { label: "Política de cookies", href: "#" },
            ]}
          />

          <Column
            title="Nosotros"
            links={[
              { label: "¿Quiénes somos?", href: "#" },
              { label: "Contacto", href: "#" },
            ]}
          />

          <Column
            title="Soporte"
            links={[
              { label: "WhatsApp", href: "https://wa.me/51931646873" },
              { label: "Facebook", href: "https://www.facebook.com/hunter.shopz" },
              { label: "TikTok", href: "https://www.tiktok.com/@tio_hunter1" },
            ]}
          />
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#22303C] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} TIOHUNTER. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Estado del servicio</a>
            <a href="#" className="hover:text-white">Reportar un problema</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
