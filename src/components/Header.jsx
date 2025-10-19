// src/components/Header.jsx
import { useMemo, useState } from "react";
import { openWhatsApp } from "../utils/whatsapp";
import { msgCart } from "../utils/messages";
import { fmt } from "../lib/currency";

// Opciones de país (solo flag + code)
const COUNTRY_OPTIONS = [
  { code: "PE", flag: "🇵🇪", symbol: "S/" },
  { code: "MX", flag: "🇲🇽", symbol: "$"  },
  { code: "US", flag: "🇺🇸", symbol: "$"  },
];

function CountryMenu({ current, onSelect, onClose }) {
  return (
    <div
      className="absolute right-0 mt-2 w-28 bg-[#192028] rounded-lg shadow-xl border border-[#2C3A47] z-50 p-2"
      role="listbox"
      aria-label="Seleccionar país"
    >
      {COUNTRY_OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => { onSelect(opt); onClose?.(); }}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-[#22303C] ${
            current?.code === opt.code ? "bg-[#22303C]" : ""
          }`}
          role="option"
          aria-selected={current?.code === opt.code}
        >
          <span className="text-lg">{opt.flag}</span>
          <span className="font-bold text-sm">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header({
  selectedCountry,
  onCountryChange,
  cart,
  removeFromCart,
  clearCart,
}) {
  const [openCountry, setOpenCountry] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const totalPrice = useMemo(
    () => cart.reduce((sum, it) => sum + Number(it.localPrice || 0), 0),
    [cart]
  );

  const handleCheckout = () => {
    if (!cart.length) return;
    openWhatsApp(msgCart(cart, selectedCountry, totalPrice));
  };

  return (
    <header className="bg-[#192028] text-white flex justify-between items-center px-6 py-3 relative shadow-md">
      {/* Logo */}
      <a href="/" className="text-xl font-extrabold tracking-wide">
        <span className="bg-[#45f983] text-black px-2 py-1 rounded">TIOHUNTER</span>
      </a>

      <div className="flex items-center gap-4 relative">
        {/* Carrito */}
        <div className="relative">
          <button
            onClick={() => setShowCart((v) => !v)}
            className="bg-[#45f983] hover:bg-[#36e673] text-black p-2 rounded relative transition-transform hover:scale-105"
            aria-haspopup="dialog"
            aria-expanded={showCart}
            aria-label="Abrir carrito"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FBBF24] text-black text-xs font-bold rounded-full px-2 shadow-lg">
                {cart.length}
              </span>
            )}
          </button>

          {showCart && (
            <div className="absolute right-0 mt-3 w-80 bg-[#192028] text-white rounded-lg shadow-xl z-50 p-4 border border-[#2C3A47]">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Carrito vacío</p>
              ) : (
                <>
                  <ul className="max-h-[220px] overflow-y-auto space-y-2 custom-scrollbar">
                    {cart.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-[#22303C] px-3 py-2 rounded-lg"
                      >
                        <p className="text-sm font-semibold truncate">{item.itemName}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-300">
                            {fmt(selectedCountry.code, item.localPrice)}
                          </span>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Eliminar ${item.itemName}`}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 border-t border-[#2C3A47] pt-3 flex justify-between font-bold text-[#FBBF24]">
                    <span>Total:</span>
                    <span>{fmt(selectedCountry.code, totalPrice)}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={clearCart}
                      className="flex-1 bg-[#2C3A47] hover:bg-[#374151] text-white py-2 rounded transition"
                    >
                      Vaciar
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-[#45f983] hover:bg-[#36e673] text-black font-bold py-2 rounded transition"
                    >
                      Comprar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Selector de País (solo bandera + código) */}
        <div className="relative">
          <button
            onClick={() => setOpenCountry((v) => !v)}
            className="bg-[#0f161b] border border-[#2C3A47] hover:border-[#45f983] px-3 py-2 rounded-lg flex items-center gap-2"
            aria-haspopup="listbox"
            aria-expanded={openCountry}
            aria-label="Seleccionar país"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="font-bold">{selectedCountry.code}</span>
            <i className="fas fa-chevron-down text-gray-400"></i>
          </button>
          {openCountry && (
            <CountryMenu
              current={selectedCountry}
              onSelect={(opt) => onCountryChange(opt)}
              onClose={() => setOpenCountry(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
