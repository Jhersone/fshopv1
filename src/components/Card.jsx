// src/components/Card.jsx
import { useState, useEffect } from "react";
import { openWhatsApp } from "../utils/whatsapp";
// ⚠️ Asegúrate de tener este archivo o ajusta el import
import { msgItem } from "../utils/messages";
import { vbucksToLocal } from "../lib/pricing";
import { getCategoryGradient } from "../utils/categoryGradients";

export default function Card({ item, selectedCountry, addToCart, category }) {
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // 1. OBTENEMOS EL COLOR DE LA CATEGORÍA
  const bgClass = getCategoryGradient(category);
  const finalBackground = bgClass; 

  // 🛡️ LÓGICA DE IMAGEN
  const imgSrc = item.fallbackImage ||
                 item.images?.featured ||
                 item.images?.icon ||
                 item.images?.smallIcon ||
                 item.background;

  // Calculamos precio
  const localPrice =
    item.localPrice ??
    (item.vBucks ? vbucksToLocal(selectedCountry.code, item.vBucks) : null);

  // ⏰ 3. LÓGICA INTELIGENTE DEL RELOJ (Días/Horas o Horas/Minutos)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetDate;

      if (item.outDate) {
        targetDate = new Date(item.outDate);
      } else {
        // Reinicio diario (00:00 UTC)
        targetDate = new Date();
        targetDate.setUTCHours(24, 0, 0, 0); 
      }

      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      // --- NUEVA LÓGICA MATEMÁTICA ---
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        // Si falta más de 1 día: "5d 14h"
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        // Si falta menos de 1 día: "16h 30m"
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft(); 
    const timer = setInterval(calculateTimeLeft, 60000); 

    return () => clearInterval(timer);
  }, [item.outDate]);

  // --- HANDLERS ---
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

      {/* Imagen + Fondo */}
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

        {/* ⏰ BADGE DE TIEMPO (Ahora con formato inteligente) */}
        {timeLeft && (
          <div className="absolute bottom-2 right-2 z-30 bg-[#c23535] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md border border-[#e64646]">
            <i className="fa-regular fa-clock text-[10px]"></i>
            <span>{timeLeft}</span>
          </div>
        )}

        {/* Sombra inferior con Nombre */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-left z-20 pointer-events-none">
          <h3 className="text-white text-sm font-burbank-shadow truncate max-w-[70%]">
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

      {/* Footer */}
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