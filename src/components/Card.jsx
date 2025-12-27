// src/components/Card.jsx
import { useState } from "react";
import { openWhatsApp } from "../utils/whatsapp";
// ⚠️ Asegúrate de tener este archivo o ajusta el import
import { msgItem } from "../utils/messages"; 
import { vbucksToLocal } from "../lib/pricing";
import { getCategoryGradient } from "../utils/categoryGradients";

export default function Card({ item, selectedCountry, addToCart, category }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const bgClass = getCategoryGradient(category);
  const finalBackground = item.type === "Gesto" ? "bg-fortnite-rare" : bgClass;

  // Calculamos precio
  const localPrice =
    item.localPrice ??
    (item.vBucks ? vbucksToLocal(selectedCountry.code, item.vBucks) : null);

  const handleWhatsApp = () => {
    const isPase = item.type === "Pases";
    const extra = !isPase && item.vBucks ? `Costo: ${item.vBucks} pavos` : "";
    const priceToSend = localPrice ?? "0.00";
    
    // Generamos mensaje
    const msg = `¡Hola TioHunter!
Me interesa: *${item.itemName}*
Precio: ${selectedCountry.symbol} ${priceToSend}
${extra ? `(${extra})` : ""}
País: ${selectedCountry.name} ${selectedCountry.flag}`;

    openWhatsApp(msg);
  };

  const handleAddToCart = () => {
    addToCart({ 
        ...item, 
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
      <div className={`relative w-full h-40 flex justify-center items-center overflow-hidden rounded-t-xl ${finalBackground}`}>
        
        {/* Placeholder de carga */}
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                 <i className="fa-solid fa-image text-4xl text-white/50 animate-pulse"></i>
            </div>
        )}

        {/* Imagen Real */}
        {!imageError && item.fallbackImage ? (
          <img
            src={item.fallbackImage}
            alt={item.itemName}
            className={`absolute w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
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