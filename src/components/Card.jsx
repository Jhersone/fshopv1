import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "51931646873";

export default function Card({ item, selectedCountry, addToCart }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [fadeImage, setFadeImage] = useState(true);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [secondLoaded, setSecondLoaded] = useState(false);

  // ✅ Conversión para pases o skins normales
  const localPrice = item.localPrice
    ? item.localPrice
    : (item.vBucks * selectedCountry.rate).toFixed(2);

  // ✅ Alternar imágenes cada 3s solo si ambas cargaron
  useEffect(() => {
    if (firstLoaded && secondLoaded) {
      const interval = setInterval(() => {
        setFadeImage((prev) => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [firstLoaded, secondLoaded]);

  // ✅ WhatsApp dinámico según tipo
  const handleWhatsApp = () => {
    const isPase = item.type === "Pases"; // Detecta si es Pase

    const message = isPase
      ? `¡Hola! Estoy interesado en comprar *${item.itemName}*.
Precio: ${selectedCountry.symbol} ${localPrice}

¿Está disponible? ¿Cómo podemos coordinar?`
      : `¡Hola! Estoy interesado en comprar *${item.itemName}*.
Costo: ${item.vBucks} pavos
Precio: ${selectedCountry.symbol} ${localPrice}

¿Está disponible?`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="bg-[#181818] rounded-xl shadow-lg w-full mx-auto overflow-hidden">
      {/* Imagen con animación suave */}
      <div className="relative w-full h-40 flex justify-center items-center bg-[#111] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-gray-500 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!imageError ? (
          <>
            <img
              src={item.renderImage}
              alt={item.itemName}
              className={`absolute w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                fadeImage ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => {
                setFirstLoaded(true);
                setIsLoading(false);
              }}
              onError={() => setImageError(true)}
            />
            {item.fallbackImage && (
              <img
                src={item.fallbackImage}
                alt={item.itemName}
                className={`absolute w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                  fadeImage ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setSecondLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
            Sin imagen
          </div>
        )}

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent px-2 py-1 text-left z-20">
          <h3 className="text-white text-sm font-semibold truncate">{item.itemName}</h3>

          {/* ✅ Solo mostramos V-Bucks si NO es un Pase */}
          {item.type !== "Pases" && (
            <p className="flex items-center gap-1 text-gray-200 text-sm font-bold">
              <img src="/img/vbucks2.png" alt="V-Bucks" className="w-4 h-4" />
              {item.vBucks}
            </p>
          )}
        </div>
      </div>

      {/* Precio y botones */}
      <div className="bg-[#181818] text-white px-3 py-3 text-center">
        <p className="text-green-400 font-bold text-base mb-3">
          {selectedCountry.symbol} {localPrice}
        </p>

      <div className="flex justify-between items-center gap-2">
          {/* ✅ Botón con ícono de WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 text-sm rounded flex-grow flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-lg"></i> Comprar
          </button>

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
