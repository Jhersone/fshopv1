// src/components/Card.jsx
import { useState } from "react";
import { openWhatsApp } from "../utils/whatsapp";
import { msgItem } from "../utils/messages";
import { vbucksToLocal } from "../lib/pricing";
import { getCategoryGradient } from "../utils/categoryGradients";

export default function Card({ item, selectedCountry, addToCart, category }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const bgClass = getCategoryGradient(category);
  console.log("🟣 Categoría:", category, "→ Clase aplicada:", bgClass);


  // Precio local: si ya viene en item.localPrice lo usa; si no, convierte desde vBucks
  const localPrice =
    item.localPrice ??
    (item.vBucks ? vbucksToLocal(selectedCountry.code, item.vBucks) : null);

  const handleWhatsApp = () => {
    const isPase = item.type === "Pases";
    const extra = !isPase && item.vBucks ? `Costo: ${item.vBucks} pavos` : "";
    const priceToSend = localPrice ?? "0.00";
    openWhatsApp(msgItem(item.itemName, priceToSend, selectedCountry, extra));
  };

  return (
    <div
      className={`relative bg-[#192028] rounded-xl shadow-lg w-full mx-auto overflow-hidden transform transition-transform duration-300 ${
        !isLoading ? "hover:scale-105" : ""
      }`}
    >
      {!isLoading && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          <div className="shine"></div>
        </div>
      )}

      {/* Imagen */}
<div
  className={`relative w-full h-40 flex justify-center items-center overflow-hidden rounded-t-xl ${
    item.type === "Gesto" ? "bg-fortnite-rare" : bgClass
  }`}
>



        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-gray-500 border-t-[#45f983] rounded-full animate-spin"></div>
          </div>
        )}

        {!imageError && item.fallbackImage ? (
          <img
            src={item.fallbackImage}
            alt={item.itemName}
            className="absolute w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoading(false)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
            Sin imagen
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/25 to-transparent px-2 py-1 text-left z-20">
          <h3 className="text-white text-sm font-burbank-shadow truncate">
            {item.itemName}
          </h3>
          {item.type !== "Pases" && item.vBucks && (
             <p className="flex items-center gap-1 text-gray-200 text-sm font-burbank">
              <img src="/img/vbucks2.png" alt="V-Bucks" className="w-4 h-4" />
              {item.vBucks}
            </p>
          )}
        </div>
      </div>

      {/* Precio y acciones */}
      <div className="bg-[#192028] text-white px-3 py-3 text-center">
        {localPrice && (
        <p className="text-[#FBBF24] font-burbank-shadow text-base mb-3">
            {selectedCountry.symbol} {localPrice}
          </p>
        )}

        <div className="flex justify-between items-center gap-2">
          <button
            onClick={handleWhatsApp}
            className="bg-[#45f983] hover:bg-[#36e673] text-black font-bold py-2 px-3 text-sm rounded flex-grow flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-lg"></i> Comprar
          </button>

          <button
            onClick={() =>
              addToCart({ ...item, localPrice: localPrice ?? "0.00" })
            }
            className="bg-[#45f983] hover:bg-[#36e673] text-black w-9 h-9 flex items-center justify-center rounded"
            title="Agregar al carrito"
          >
            <i className="fas fa-plus text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
