export default function StickyCTA({
  title,
  totalText,
  buttonText = "Comprar ahora",
  onClick,
  // ahora por defecto visible también en desktop
  showOnDesktop = true,
  // "fixed" (flotante full-bleed) o "static" (acoplada dentro del flujo)
  variant = "fixed",
  className = "",
}) {
  const isFixed = variant === "fixed";

  return (
    <div
      className={[
        isFixed ? "fixed inset-x-0 bottom-0 z-50" : "", // flotante o en flujo
        showOnDesktop ? "" : "md:hidden",               // si quieres ocultar en desktop, pásalo a false
        className,
      ].join(" ")}
      style={isFixed ? { paddingBottom: "env(safe-area-inset-bottom)" } : undefined}
      aria-live="polite"
    >
      {/* full-bleed sólo si es fixed; en static respeta el contenedor */}
      <div
        style={
          isFixed
            ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
            : undefined
        }
        className={[
          "backdrop-blur supports-[backdrop-filter]:bg-[#0f161b]/80 bg-[#0f161b]/95 border-t border-[#2C3A47]",
          isFixed ? "" : "rounded-2xl", // un toque de estilo cuando está acoplada
        ].join(" ")}
      >
        <div className="max-w-[990px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {title && <div className="text-sm text-gray-300 truncate">{title}</div>}
            <div className="text-[17px]">
              Total: <span className="font-bold text-[#45F983]">{totalText}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClick}
            className="flex-shrink-0 w-[180px] bg-[#45F983] hover:bg-[#36E673] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition"
            aria-label={buttonText}
          >
            <i className="fab fa-whatsapp text-xl" aria-hidden="true" />
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
