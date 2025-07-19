const WHATSAPP_NUMBER = "51931646873"; // Cambia por tu número

export default function Cart({ cart, removeFromCart, clearCart, selectedCountry }) {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.localPrice), 0).toFixed(2);

  const handleWhatsApp = () => {
    if (cart.length === 0) return;

    let message = "¡Hola! Estoy interesado en comprar estos artículos:\n\n";

    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.itemName} - ${item.vBucks} pavos - ${selectedCountry.symbol} ${item.localPrice}\n`;
    });

    message += `\nTOTAL: ${selectedCountry.symbol} ${total}\n¿Está disponible? ¿Cómo podemos coordinar?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-5 right-5 bg-[#222] p-4 rounded-lg shadow-lg w-64">
      <h3 className="text-lg font-bold mb-2">🛒 Carrito</h3>
      {cart.length === 0 ? (
        <p className="text-gray-400">Carrito vacío</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <span>{item.itemName}</span>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => removeFromCart(i)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <p className="font-bold mb-3">Total: {selectedCountry.symbol} {total}</p>
          <button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-bold"
          >
            Finalizar compra
          </button>
          <button
            onClick={clearCart}
            className="text-gray-400 text-xs mt-2 w-full hover:text-red-500"
          >
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
