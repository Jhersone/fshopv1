// src/components/Header.jsx
import { useState } from "react";
// 👇 IMPORTAMOS LA LISTA REAL (Ya no la escribimos a mano)
import { COUNTRIES } from "../lib/paises"; 

function CountryMenu({ current, onSelect, onClose }) {
  // Convertimos el objeto de países a un array para poder hacer .map()
  const countryList = Object.values(COUNTRIES);

  return (
    <div
      className="absolute right-0 mt-2 w-28 bg-[#192028] rounded-lg shadow-xl border border-[#2C3A47] z-50 p-2"
      role="listbox"
      aria-label="Seleccionar país"
    >
      {countryList.map((opt) => (
        <button
          key={opt.code}
          onClick={() => {
            onSelect(opt);
            onClose?.();
          }}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-[#22303C] ${
            current?.code === opt.code ? "bg-[#22303C]" : ""
          }`}
        >
          <span className="text-lg">{opt.flag}</span>
          <span className="font-bold text-sm">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header({ selectedCountry, onCountryChange, cart, removeFromCart, clearCart }) {
  const [openCountry, setOpenCountry] = useState(false);

  // Aseguramos que haya un país seleccionado
  const current = selectedCountry || Object.values(COUNTRIES)[0];

  return (
    <header className="bg-[#0a0a0a] text-white sticky top-0 z-50 border-b border-[#1c1c1c] shadow-md">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 transition-all duration-300">
        
        {/* Logo */}
        <a href="/" className="text-xl sm:text-2xl font-extrabold tracking-wide transition-transform duration-200 hover:scale-[1.05]">
          <span className="bg-[#ffff00] text-black px-2 sm:px-3 py-[2px] sm:py-1 rounded font-bold text-[15px] sm:text-[18px]">
            TIOHUNTER
          </span>
        </a>

        {/* Selector de país */}
        <div className="relative">
          <button
            onClick={() => setOpenCountry((v) => !v)}
            className="bg-[#0f161b] border border-[#2C3A47] hover:border-[#ffff00] px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
          >
            <span className="text-base sm:text-lg">{current.flag}</span>
            <span className="font-bold text-sm sm:text-base">{current.code}</span>
            <i className={`fas fa-chevron-down text-gray-400 text-xs sm:text-sm transition-transform ${openCountry ? "rotate-180" : ""}`}></i>
          </button>

          {openCountry && (
            <CountryMenu
              current={current}
              onSelect={(opt) => onCountryChange(opt)}
              onClose={() => setOpenCountry(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}