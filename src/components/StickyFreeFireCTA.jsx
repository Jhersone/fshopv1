// src/components/StickyFreeFireCTA.jsx
export default function StickyFreeFireCTA({
  amount,
  selectedOffer,
  totalText,
  onClick,
  showOnDesktop = true,
  variant = "fixed",
  className = "",
}) {
  const isFixed = variant === "fixed";

  // Etiqueta dinámica según selección
  const label = selectedOffer
    ? selectedOffer === "weekly"
      ? "Tarjeta Semanal"
      : "Tarjeta Mensual"
    : `${amount?.toLocaleString() || 0} Diamantes`;

  // Ícono dinámico según tipo
  const iconSrc = selectedOffer
    ? selectedOffer === "weekly"
      ? "/img/t.semanal.png"
      : "/img/t.mensual.png"
    : "/img/diama.png";

  return (
    <div
      className={[
        isFixed ? "fixed inset-x-0 bottom-0 z-50" : "",
        showOnDesktop ? "" : "md:hidden",
        className,
      ].join(" ")}
      style={isFixed ? { paddingBottom: "env(safe-area-inset-bottom)" } : undefined}
      aria-live="polite"
    >
      <div
        style={
          isFixed
            ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
            : undefined
        }
        className={[
          "backdrop-blur supports-[backdrop-filter]:bg-[#0f161b]/80 bg-[#0f161b]/95 border-t border-[#2C3A47]",
          isFixed ? "" : "rounded-2xl",
        ].join(" ")}
      >
        <div className="max-w-[990px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Información */}
          <div className="min-w-0 flex flex-col text-white">
            <div className="flex items-center gap-2 font-bold text-[16px]">
              <img
                src={iconSrc}
                alt={label}
                className="w-6 h-6 object-contain"
              />
              <span>{label}</span>
            </div>

            <div className="text-[17px] mt-0.5">
              Total:{" "}
              <span className="font-bold text-[#45F983]">{totalText}</span>
            </div>
          </div>

          {/* Botón principal */}
          <button
            type="button"
            onClick={onClick}
            className="flex-shrink-0 w-[180px] bg-[#45F983] hover:bg-[#36E673] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition"
            aria-label="Comprar ahora"
          >
            <i className="fab fa-whatsapp text-xl" aria-hidden="true" />
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
