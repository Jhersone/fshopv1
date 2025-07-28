import { useState } from "react";

const WHATSAPP_NUMBER = "51931646873";

const packs = [
  { id: 1, name: "110 Diamantes", img: "/img/di2.png", prices: { PE: 3.5, MX: 19 } },
  { id: 2, name: "220 Diamantes", img: "/img/di2.png", prices: { PE: 7.0, MX: 38 } },
  { id: 3, name: "341 Diamantes", img: "/img/di2.png", prices: { PE: 10.0, MX: 53 } },
  { id: 4, name: "451 Diamantes", img: "/img/di2.png", prices: { PE: 13.5, MX: 72 } },
  { id: 5, name: "572 Diamantes", img: "/img/di2.png", prices: { PE: 16.0, MX: 85 } },
  { id: 6, name: "913 Diamantes", img: "/img/di2.png", prices: { PE: 26.0, MX: 138 } },
  { id: 7, name: "1023 Diamantes", img: "/img/di2.png", prices: { PE: 30.0, MX: 159 } },
  { id: 8, name: "1166 Diamantes", img: "/img/di2.png", prices: { PE: 32.0, MX: 170 } },
  { id: 9, name: "1507 Diamantes", img: "/img/di2.png", prices: { PE: 42.0, MX: 223 } },
  { id: 10, name: "1738 Diamantes", img: "/img/di2.png", prices: { PE: 48.0, MX: 255 } },
  { id: 11, name: "2398 Diamantes", img: "/img/di2.png", prices: { PE: 62.0, MX: 329 } },
  { id: 12, name: "3564 Diamantes", img: "/img/di2.png", prices: { PE: 94.0, MX: 499 } },
  { id: 13, name: "5137 Diamantes", img: "/img/di2.png", prices: { PE: 134.0, MX: 710 } },
  { id: 14, name: "6160 Diamantes", img: "/img/di2.png", prices: { PE: 140.0, MX: 742 } },
  { id: 15, name: "8558 Diamantes", img: "/img/di2.png", prices: { PE: 202.0, MX: 1070 } },
  { id: 16, name: "9724 Diamantes", img: "/img/di2.png", prices: { PE: 234.0, MX: 1240 } },
  { id: 17, name: "10065 Diamantes", img: "/img/di2.png", prices: { PE: 244.0, MX: 1294 } },
];

export default function FreeFireShop({ selectedCountry }) {
  const [userId, setUserId] = useState("");
  const [selectedPack, setSelectedPack] = useState(null);

  const handleIdChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setUserId(val);
  };

  const isIdValid = userId.length > 0;
  const symbol = selectedCountry?.symbol || "S/";
  const code = selectedCountry?.code || "PE";

  const handleBuy = () => {
    if (!selectedPack || !userId) return;
    const price = selectedPack.prices[code] || selectedPack.prices["PE"];
    const priceText = code === "MX" ? `$${price} pesos` : `S/ ${price}`;
    const msg = `Hola quiero recargar *${selectedPack.name}* y mi ID es *${userId}*.\nTotal: *${priceText}*\n¿Por dónde te puedo pagar?`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bg-[#0f161b] text-white p-0 max-w-md mx-auto rounded-xl shadow-lg space-y-6">

      {/* SECCIÓN 1 – Ingrese su ID */}
      <div className="relative mt-6">
        <div className="absolute -top-4 left-3 w-8 h-8 rounded-full bg-[#FBBF24] text-black text-sm font-bold flex items-center justify-center z-10 shadow">
          1
        </div>
        <div className="bg-[#192028] border border-[#2C3A47] p-4 rounded-xl shadow-md pt-5">
          <p className="text-white text-sm font-semibold mb-2">Ingrese su ID</p>
          <input
            type="text"
            inputMode="numeric"
            value={userId}
            onChange={handleIdChange}
            placeholder="Ej: 123456789"
            className="w-full bg-[#0f161b] border border-[#45f983] text-white rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#45f983]"
          />
        </div>
      </div>

      {/* SECCIÓN 2 – Elegir cantidad */}
      <div className="relative mt-6">
        <div className="absolute -top-4 left-3 w-8 h-8 rounded-full bg-[#FBBF24] text-black text-sm font-bold flex items-center justify-center z-10 shadow">
          2
        </div>
        <div
          className={`bg-[#192028] border border-[#2C3A47] p-4 rounded-xl shadow-md pt-5 ${
            !isIdValid ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <p className="text-white text-sm font-semibold mb-3">Elige la cantidad</p>
          <div className="space-y-2">
            {packs.map((pack) => (
              <div
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition border ${
                  selectedPack?.id === pack.id
                    ? "bg-[#22303C] border-[#45f983]"
                    : "bg-[#0f161b] border-[#2C3A47] hover:border-[#45f983]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={pack.img} alt={pack.name} className="w-8 h-8 rounded object-contain" />
                  <span className="text-sm">{pack.name}</span>
                </div>
                <span className="font-bold text-[#FBBF24]">
                  {symbol} {pack.prices[code] || pack.prices["PE"]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTÓN – Comprar Ahora */}
      <button
        disabled={!selectedPack || !isIdValid}
        onClick={handleBuy}
        className={`w-full py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition ${
          !selectedPack || !isIdValid
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-[#45f983] hover:bg-[#36e673] text-black"
        }`}
      >
        <i className="fab fa-whatsapp text-lg"></i> Comprar Ahora
      </button>
    </div>
  );
}
