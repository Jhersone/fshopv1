// src/components/Card.jsx
import { useState } from "react";
import { openWhatsApp } from "../utils/whatsapp";
// ⚠️ Asegúrate de tener este archivo o ajusta el import
import { msgItem } from "../utils/messages";
import { vbucksToLocal } from "../lib/pricing";
import { getCategoryGradient } from "../utils/categoryGradients";

export default function Card({ item, selectedCountry, addToCart, category }) {
  const [imageError, setImageError] = useState(false);
  
  // 1. OBTENEMOS EL COLOR DE LA CATEGORÍA
  const bgClass = getCategoryGradient(category);
  
  // 2. 🎨 CORRECCIÓN AQUÍ:
  // Quitamos la condición que forzaba el azul en los Gestos.
  // Ahora usamos siempre el color de la categoría (bgClass).
  const finalBackground = bgClass; 

  // 🛡️ LÓGICA DE IMAGEN (Red de Seguridad)
  const imgSrc = item.fallbackImage ||
                 item.images?.featured ||
                 item.images?.icon ||
                 item.images?.smallIcon ||
                 item.background;

  // Calculamos precio
  const localPrice =
    item.localPrice ??
    (item.vBucks ? vbucksToLocal(selectedCountry.code, item.vBucks) : null);

  const handleWhatsApp = () => {
    const typeRaw = item.type?.displayValue || item.type || "";
    const typeStr = JSON.stringify(typeRaw).toLowerCase();
    const isMusic = typeStr.includes("music") || typeStr.includes("música");
    const label = isMusic ? " [Música 🎵]" : "";
    const isPase = item.type === "Pases";
    const extra = !isPase && item.vBucks ? `Costo: ${item.vBucks} pavos` : "";
    const priceToSend = localPrice ?? "0.00";

    const msg = `¡Hola TioHunter!
Me interesa: *${item.itemName}${label}*
Precio: ${selectedCountry.symbol} ${priceToSend}
${extra ? `(${extra})` : ""}
País: ${selectedCountry.name} ${selectedCountry.flag}`;

    openWhatsApp(msg);
  };

  const handleAddToCart = () => {
    addToCart({
        ...item,
        fallbackImage: imgSrc,
        price: parseFloat(localPrice) || 0,
        background: finalBackground
    });
  };

  return (
    <div className="relative bg-[#192028] rounded-xl shadow-lg w-full mx-auto overflow-hidden transform transition-transform duration-300 hover:scale-105">

      {/* Brillo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        <div className="shine"></div>
      </div>

      {/* Imagen + Fondo (Con altura ajustada: h-44 en móvil, h-52 en PC) */}
      <div className={`relative w-full h-44 sm:h-50 flex justify-center items-center overflow-hidden rounded-t-xl ${finalBackground}`}>

        {/* Imagen Real */}
        {!imageError && imgSrc ? (
          <img
            src={imgSrc}
            alt={item.itemName}
            className="absolute w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 text-gray-400 text-xs font-bold">
            Sin imagen
          </div>
        )}

        {/* Sombra inferior con Nombre */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/40 to-transparent px-2 py-1 text-left z-20">
          <h3 className="text-white text-sm font-burbank-shadow truncate">
            {item.itemName}
          </h3>
          {item.type !== "Pases" && item.vBucks && (
             <p className="flex items-center gap-1 text-gray-200 text-sm font-burbank-shadow">
              <img src="/img/vbucks2.png" alt="V-Bucks" className="w-4 h-4" />
              {item.vBucks}
            </p>
          )}
        </div>
      </div>

      {/* Footer de Tarjeta */}
      <div className="bg-[#192028] text-white px-3 py-3 text-center">
        {localPrice && (
        <p className="text-[#FFFFFF] font-burbank-shadow text-lg mb-3">
            {selectedCountry.symbol} {localPrice}
          </p>
        )}

        <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-[#FFFF00] text-black font-bold py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 hover:brightness-110 active:scale-95 shadow-md"
            >
              Comprar
            </button>
            <button
              onClick={handleAddToCart}
              className="w-12 bg-[#FFFF00] text-black font-bold py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 hover:brightness-110 active:scale-95 shadow-md"
            >
              <i className="fa-solid fa-cart-shopping text-lg"></i>
            </button>
        </div>
      </div>
    </div>
  );
}