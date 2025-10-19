import { useState } from "react";
import { openWhatsApp } from "@/utils/whatsapp"; // Asegúrate de tener este helper

const MIN_ROBUX = 1000;

// Tarifas por 1000 Robux (ajústalas si cambian)
const PRICES = {
  PE: { rate: 35,   symbol: "S/" }, // 1000 Robux = 35 soles
  MX: { rate: 185.5, symbol: "$"  }, // 1000 Robux = 185.5 pesos
};

export default function RobuxCard({ selectedCountry }) {
  const [quantity, setQuantity] = useState(1000);
  const [error, setError] = useState("");

  const code = selectedCountry?.code || "PE";
  const countryData = PRICES[code] || PRICES.PE;

  const handleChange = (value) => {
    const newQty = Math.max(MIN_ROBUX, parseInt(value || 0, 10));
    setQuantity(newQty);
    setError(newQty < MIN_ROBUX ? "Monto mínimo 1000 Robux" : "");
  };

  const increase = () => handleChange(quantity + 100);
  const decrease = () => handleChange(quantity - 100);

  const totalPrice =
    quantity >= MIN_ROBUX
      ? ((quantity / 1000) * countryData.rate).toFixed(2)
      : "0.00";

  const handleBuy = () => {
    if (quantity < MIN_ROBUX) return;
    const message = `¡Hola! Estoy interesado en comprar ${quantity} Robux.
Total: ${countryData.symbol}${totalPrice}
¿Está disponible?`;
    openWhatsApp(message);
  };

  return (
    <div className="bg-[#192028] text-white rounded-xl p-6 shadow-lg w/full max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="bg-[#22303C] text-center py-2 rounded-lg text-sm font-semibold text-[#45F983]">
        Yo cubro el 30% de impuesto de Roblox
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-700 pb-1">
          <span className="text-gray-400">Tiempo de entrega</span>
          <span className="text-green-400 font-semibold flex items-center gap-1">
            <i className="fas fa-clock"></i> 10 min
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Cantidad mínima</span>
          <span className="font-bold text-white">{MIN_ROBUX}</span>
        </div>
      </div>

      {/* Selector */}
      <div className="flex items-center bg-[#0F161B] rounded-lg px-4 py-3 justify-between">
        <button
          onClick={decrease}
          className="text-2xl font-bold text-gray-400 hover:text-white"
          aria-label="Disminuir"
        >
          -
        </button>
        <input
          type="number"
          min={MIN_ROBUX}
          step={100}
          value={quantity}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-transparent text-center text-lg font-bold w-28 focus:outline-none text-white"
        />
        <button
          onClick={increase}
          className="text-2xl font-bold text-gray-400 hover:text-white"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Total */}
      <div className="text-lg font-bold text-[#FBBF24]">
        Total: {countryData.symbol}{totalPrice}
      </div>

      {/* Botón */}
      <button
        onClick={handleBuy}
        disabled={quantity < MIN_ROBUX}
        className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition ${
          quantity < MIN_ROBUX
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-[#45F983] hover:bg-[#36E673] text-black"
        }`}
      >
        <i className="fab fa-whatsapp text-xl"></i> Comprar Ahora
      </button>

      {/* Requisitos */}
      <div className="bg-[#22303C] rounded-lg p-4 text-sm text-gray-300">
        <p className="mb-2 font-semibold flex items-center gap-2">
          <i className="fas fa-bullhorn text-[#45F983]"></i> Requisitos
        </p>
        <ul className="list-disc pl-4 space-y-1 text-gray-400">
          <li>Debes estar en todos mis grupos por 14 días para enviarte robux en minutos.</li>
          <li>No se entrega por gamepass (Solo por Grupo).</li>
          <li>Los Robux son 100% legales.</li>
        </ul>
      </div>
    </div>
  );
}
