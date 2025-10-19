// src/components/CarouselTabs.jsx
const TABS = [
  { id: "regalo",   label: "Fortnite",  img: "/img/regalo_morado.png" },
  { id: "crew",     label: "Crew",      img: "/img/crew.jpg" },
  { id: "pavos",    label: "Robux",     img: "/img/robux_1.png" },
  { id: "freefire", label: "Free Fire", img: "/img/dim2.png" },
  { id: "vbucks",   label: "Pavos",     img: "/img/dim2.png" },
];

const ICON_PX_MOBILE = 84;   // tamaño en móvil
const ICON_PX_MD     = 110;  // tamaño en md+

export default function CarouselTabs({ activeTab, setActiveTab }) {
  return (
    <section className="relative w-full mt-2 mb-0">
      {/* Fondo sólido del bloque (no degradado) */}
      <div className="absolute inset-0 bg-[#121a20]" />

      {/* Contenido */}
      <div className="relative max-w-[1100px] mx-auto px-4 md:px-6 py-2">
        {/* Título más compacto en móvil */}
        <div className="mb-4 text-center md:mb-6">
          <h2 className="text-[18px] md:text-[24px] font-extrabold tracking-tight">
            <span className="text-[#45F983]">Selección</span>{" "}
            <span className="text-white">de Juego</span>
          </h2>
        </div>

        {/* Fila única con scroll horizontal en móvil + snap */}
        <div className="-mx-4 px-4 relative">
          {/* Fades laterales (opcionales) */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#121a20] to-transparent hidden sm:block" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#121a20] to-transparent hidden sm:block" />

          <div
            className="
              flex gap-4 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar
              snap-x snap-mandatory md:snap-none
              scroll-px-4 md:scroll-px-0
              -mx-1 pr-2 md:mx-0 md:pr-0
              md:justify-center
            "
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={active}
                  className="
                    group flex-shrink-0 snap-start
                    flex flex-col items-center gap-2
                    focus:outline-none
                    pt-1
                  "
                >
                  {/* Icono */}
                  <div
                    className={[
                      "tab-icon relative overflow-hidden rounded-2xl border bg-[#191f26] transition",
                      active
                        ? "border-[#45F983] ring-2 ring-[#45F983] shadow-[0_0_18px_rgba(69,249,131,0.25)]"
                        : "border-[#22303C] hover:ring-1 hover:ring-[#45F983]/70 hover:shadow-[0_0_14px_rgba(69,249,131,0.18)]",
                    ].join(" ")}
                    style={{ width: ICON_PX_MOBILE, height: ICON_PX_MOBILE }}
                  >
                    <img
                      src={tab.img}
                      alt={tab.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {active && (
                      <span className="absolute -top-1.5 -left-1.5 w-6 h-6 grid place-items-center bg-[#45F983] text-black rounded-md shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Texto */}
                  <span
                    className={[
                      "text-[13px] md:text-sm font-semibold leading-tight",
                      active ? "text-white" : "text-gray-200 group-hover:text-white",
                    ].join(" ")}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS auxiliar */}
      <style>{`
        /* Ocultar scrollbar en navegadores principales */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Aumentar tamaño de iconos en md+ usando la clase 'tab-icon' */
        @media (min-width: 768px) {
          .tab-icon {
            width: ${ICON_PX_MD}px !important;
            height: ${ICON_PX_MD}px !important;
          }
        }
      `}</style>
    </section>
  );
}
