import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "51931646873";

const countries = [
  { code: "PE", name: "Perú", flag: "🇵🇪", symbol: "S/", rate: 0.015 },
  { code: "MX", name: "México", flag: "🇲🇽", symbol: "$", rate: 0.08 },
];

export default function Header({ selectedCountry, onCountryChange, cart, removeFromCart, clearCart }) {
  const [openCountry, setOpenCountry] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // ✅ Detección automática con ipapi
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.country_code) {
          const found = countries.find(c => c.code === data.country_code);
          if (found) onCountryChange(found);
        }
      } catch (error) {
        console.log("Error detectando país:", error);
      }
    };
    detectCountry();
  }, [onCountryChange]);

  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.localPrice), 0).toFixed(2);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const message = `¡Hola! Estoy interesado en comprar los siguientes productos:\n\n${cart
      .map((item, i) => `${i + 1}. ${item.itemName} - ${item.vBucks} pavos - ${selectedCountry.symbol} ${item.localPrice}`)
      .join("\n")}
      
Total: ${selectedCountry.symbol} ${totalPrice}

¿Está disponible? ¿Cómo podemos coordinar?`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <header className="bg-[#121212] text-white flex justify-between items-center px-6 py-3 relative">
      <h1 className="text-xl font-extrabold italic">TIOHUNTER</h1>

      <div className="flex items-center gap-4 relative">
        {/* Carrito */}
        <div className="relative">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-red-600 hover:bg-red-700 p-2 rounded relative transition-transform hover:scale-105"
          >
            <i className="fas fa-shopping-cart text-white text-lg"></i>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-2 shadow-lg">
                {cart.length}
              </span>
            )}
          </button>

          {showCart && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-[#181818] text-white rounded-lg shadow-xl z-50 p-4 border border-red-600">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Carrito vacío</p>
              ) : (
                <>
                  <ul className="max-h-[200px] overflow-y-auto space-y-2">
                    {cart.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-[#202224] px-3 py-2 rounded-lg">
                        <p className="text-sm font-semibold truncate">{item.itemName}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-300">{selectedCountry.symbol}{item.localPrice}</span>
                          <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 border-t border-red-600 pt-3 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{selectedCountry.symbol} {totalPrice}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={clearCart} className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded">Vaciar</button>
                    <button onClick={handleCheckout} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">Comprar</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Selector */}
        <div className="relative">
          <button
            onClick={() => setOpenCountry(!openCountry)}
            className="bg-[#1f1f1f] px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-700 hover:border-red-500"
          >
            <span>{selectedCountry.flag}</span>
            <span className="font-bold">{selectedCountry.code}</span>
            <i className="fas fa-chevron-down text-gray-400"></i>
          </button>
          {openCountry && (
            <div className="absolute right-0 mt-2 bg-[#1f1f1f] w-36 rounded-lg shadow-lg border border-gray-700 z-50">
              {countries.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onCountryChange(c);
                    setOpenCountry(false);
                  }}
                  className="p-2 hover:bg-red-600 cursor-pointer flex items-center gap-2 rounded"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          )}
         
        </div>
      </div>
    </header>
  );
}
