import CrewInfo from "./CrewInfo";

const WHATSAPP_NUMBER = "51931646873";

export default function CrewContainer({ selectedCountry, addToCart }) {
  const prices = {
    PE: 20.0, // Perú
    MX: 105.0, // México
    BO: 140.0, // Bolivia
    CL: 6500.0, // Chile
    US: 5.99, // USA
  };

  const fixedPrice = prices[selectedCountry.code] || 20.0;

  const handleWhatsApp = () => {
    const message = `¡Hola! Estoy interesado en comprar la suscripción *Fortnite Crew*.
Precio: ${selectedCountry.symbol} ${fixedPrice.toFixed(2)}

¿Está disponible?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-darkSecondary rounded-xl shadow-xl max-w-lg w-full mx-auto p-4">
      {/* Banner */}
      <img
        src="/img/crew2.png"
        alt="Fortnite Crew"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Precio */}
      <p className="text-green-400 font-bold text-lg mb-3 text-center">
        {selectedCountry.symbol} {fixedPrice.toFixed(2)}
      </p>

      {/* Botones */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <button
  onClick={handleWhatsApp}
  className="bg-[#00FF7F] hover:bg-[#00CC66] text-black font-bold py-2 px-4 rounded flex-grow flex items-center justify-center gap-2"
>
  <i className="fab fa-whatsapp text-lg"></i> Comprar
</button>
<button
  onClick={() =>
    addToCart({ itemName: "Fortnite Crew", localPrice: fixedPrice.toFixed(2) })
  }
  className="bg-[#00FF7F] hover:bg-[#00CC66] text-black w-10 h-10 flex items-center justify-center rounded"
  title="Agregar al carrito"
>
  <i className="fas fa-plus text-lg"></i>
</button>

      </div>

      {/* ✅ Información */}
      <CrewInfo />
    </div>
  );
}
