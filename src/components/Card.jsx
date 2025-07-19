import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "51931646873";

export default function Card({ item, selectedCountry, addToCart }) {
  const [showFirstImage, setShowFirstImage] = useState(true);
  const [flash, setFlash] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Estado para precarga

  const localPrice = (item.vBucks * selectedCountry.rate).toFixed(2);

  useEffect(() => {
    if (item.renderImage && item.fallbackImage && item.renderImage !== item.fallbackImage) {
      const interval = setInterval(() => {
        setShowFirstImage((prev) => !prev);
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      }, 2800);
      return () => clearInterval(interval);
    }
  }, [item]);

  const handleWhatsApp = () => {
    const message = `¡Hola! Estoy interesado en comprar *${item.itemName}*.
Costo: ${item.vBucks} pavos
Precio: ${selectedCountry.symbol} ${localPrice}

¿Está disponible? ¿Cómo podemos coordinar?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#181818] rounded-xl shadow-lg max-w-[200px] w-full mx-auto overflow-hidden">
      {/* Imagen */}
      <div className="relative w-full h-40 flex justify-center items-center bg-[#111] overflow-hidden">
        {/* Skeleton mientras carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
        )}

        <img
          src={item.renderImage}
          alt={item.itemName}
          loading="lazy"
          onLoad={() => setIsLoading(false)} // ✅ Cuando carga, quitamos skeleton
          className={`absolute w-full h-full object-contain transition-all duration-1000 ease-in-out ${
            showFirstImage ? "opacity-100 scale-100" : "opacity-0 scale-105 blur-[2px]"
          }`}
        />
        {item.fallbackImage && item.fallbackImage !== item.renderImage && (
          <img
            src={item.fallbackImage}
            alt={item.itemName}
            loading="lazy"
            className={`absolute w-full h-full object-contain transition-all duration-1000 ease-in-out ${
              showFirstImage ? "opacity-0 scale-105 blur-[2px]" : "opacity-100 scale-100"
            }`}
          />
        )}

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-2 py-1 text-left z-20">
          <h3 className="text-white text-xs font-semibold leading-tight truncate">{item.itemName}</h3>
          <p className="flex items-center gap-1 text-gray-200 text-xs font-bold">
            <img src="/img/vbucks2.png" alt="V-Bucks" className="w-4 h-4" />
            {item.vBucks}
          </p>
        </div>
      </div>

      {/* Caja inferior */}
      <div className="bg-[#181818] text-white px-3 py-3 text-center">
        <p className="text-green-400 font-bold text-sm mb-3">
          {selectedCountry.symbol} {localPrice}
        </p>

        <div className="flex justify-between items-center gap-2">
          {/* Botón principal */}
          <button
            onClick={handleWhatsApp}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 text-sm rounded flex-grow"
          >
            Comprar
          </button>

          {/* Botón + */}
          <button
            onClick={() => addToCart({ ...item, localPrice })}
            className="bg-red-600 hover:bg-red-700 text-white w-9 h-9 flex items-center justify-center rounded"
            title="Agregar al carrito"
          >
            <i className="fas fa-plus text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
