// src/components/StickyCTA_vbuck.jsx
import React from 'react';

export default function StickyCTA_vbuck({
  totalText,      // El precio total formateado (ej: "S/ 20.00")
  summaryLabel,   // El nombre del paquete (ej: "1,000 V-Bucks")
  onClick,
  showOnDesktop = true,
  variant = "fixed",
  className = "",
}) {
  const isFixed = variant === "fixed";

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
      {/* full-bleed hack para que ocupe todo el ancho si es fixed */}
      <div
        style={
          isFixed
            ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
            : undefined
        }
        className={[
          "backdrop-blur supports-[backdrop-filter]:bg-[#0f161b]/80 bg-[#0f161b]/95 border-t border-[#2C3A47]",
          isFixed ? "" : "rounded-2xl border border-[#2C3A47]", // Agregué borde también al static para consistencia
        ].join(" ")}
      >
        <div className="max-w-[990px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Información (Izquierda) */}
          <div className="min-w-0 flex flex-col text-white">
            <div className="flex items-center gap-2 font-bold text-[16px]">
              {/* Icono de V-Bucks */}
              <img
                src="/img/pavos/vbu.png"
                alt="V-Bucks"
                className="w-6 h-6 object-contain"
              />
              <span className="truncate">{summaryLabel}</span>
            </div>
            <div className="text-[17px] mt-0.5">
              Total: <span className="font-bold text-[#FFFB00]">{totalText}</span>
            </div>
          </div>

          {/* Botón principal (Derecha) */}
          <button
            type="button"
            onClick={onClick}
            className="flex-shrink-0 w-[180px] bg-[#FFFB00] hover:bg-[#e6e200] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition"
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