import CrewInfo from "./CrewInfo";
import { openWhatsApp } from "@/utils/whatsapp";
import { msgItem } from "@/utils/messages";
import { COUNTRIES } from "@/lib/currency";

export default function CrewContainer({ selectedCountry, addToCart }) {
  const prices = {
    PE: 20.0, MX: 105.0, BO: 140.0, CL: 6500.0, US: 5.99,
  };
  const fixedPrice = prices[selectedCountry.code] ?? COUNTRIES[selectedCountry.code]?.rates?.crew ?? 20.0;

  const handleWhatsApp = () => {
    openWhatsApp(msgItem("Fortnite Crew", fixedPrice, selectedCountry));
  };

  return (
    <div className="bg-[#0D1F1E] border border-[#00FF7F33] rounded-xl max-w-lg w-full mx-auto p-4">
      <img src="/img/crew2.png" alt="Fortnite Crew" className="w-full h-48 object-cover rounded-lg mb-4" />
      <p className="text-[#FFD700] font-bold text-lg mb-3 text-center">
        {selectedCountry.symbol} {fixedPrice.toFixed(2)}
      </p>
      <div className="flex justify-between items-center gap-2 mb-4">
        <button onClick={handleWhatsApp} className="bg-[#00FF7F] hover:bg-[#00CC66] text-black font-bold py-2 px-4 rounded flex-grow flex items-center justify-center gap-2">
          <i className="fab fa-whatsapp text-lg"></i> Comprar
        </button>
        <button
          onClick={() => addToCart({ itemName: "Fortnite Crew", localPrice: fixedPrice.toFixed(2) })}
          className="bg-[#00FF7F] hover:bg-[#00CC66] text-black w-10 h-10 flex items-center justify-center rounded"
          title="Agregar al carrito"
        >
          <i className="fas fa-plus text-lg"></i>
        </button>
      </div>
      <CrewInfo />
    </div>
  );
}
