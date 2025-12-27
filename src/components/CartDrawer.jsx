// src/components/CartDrawer.jsx
import { useMemo } from "react";
import { openWhatsApp } from "../utils/whatsapp";

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, addToCart, selectedCountry }) {
  if (!isOpen) return null;

  // 1. Agrupar items repetidos
  const groupedCart = useMemo(() => {
    const items = {};
    cart.forEach((item) => {
      if (items[item.itemName]) {
        items[item.itemName].quantity += 1;
        items[item.itemName].totalPrice += item.price;
      } else {
        items[item.itemName] = { ...item, quantity: 1, totalPrice: item.price };
      }
    });
    return Object.values(items);
  }, [cart]);

  // 2. Calcular Total General
  const total = groupedCart.reduce((acc, item) => acc + item.totalPrice, 0);

  // 3. Enviar pedido a WhatsApp (LIMPIO, SIN EMOJIS)
  const handleCheckout = () => {
    // Quitamos el cuadradito ▪️
    const itemsList = groupedCart
      .map((item) => `${item.itemName} (x${item.quantity}) - ${selectedCountry.symbol} ${item.totalPrice.toFixed(2)}`)
      .join("\n");

    // Quitamos los iconos 💰 y 🏳️ para evitar errores
    const message = `¡Hola TioHunter! Quiero finalizar mi compra del carrito:

${itemsList}

*Total a pagar: ${selectedCountry.symbol} ${total.toFixed(2)}*
País: ${selectedCountry.name}

¿Me envías los datos de pago?`;

    // Enviamos el mensaje normal, sin cosas raras
    openWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      
      {/* Fondo oscuro (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* === VENTANA DEL CARRITO === */}
      <div className="relative bg-[#192028] w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col border border-[#2C3A47] animate-slide-up overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2C3A47] bg-[#192028] z-10">
          <div>
            <h2 className="text-xl font-extrabold text-white">Tu Carrito ({cart.length})</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Subtotal: <span className="text-[#FFFF00] font-bold text-base ml-1">{selectedCountry.symbol} {total.toFixed(2)}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0f161b] text-gray-400 hover:text-white border border-[#2C3A47] transition-colors">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto px-5 scrollbar-hide">
          {groupedCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 opacity-60">
              <i className="fa-solid fa-cart-shopping text-6xl"></i>
              <p className="text-lg font-bold">Tu carrito está vacío</p>
            </div>
          ) : (
            groupedCart.map((item, index) => (
              <div key={index} className="flex gap-4 py-5 border-b border-[#2C3A47] last:border-b-0 relative">
                
                {/* Imagen */}
                <div 
                    className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-[#2C3A47] p-0 flex items-center justify-center shadow-sm ${item.background || "bg-[#0f161b]"}`}
                >
                  <img src={item.fallbackImage} alt={item.itemName} className="w-full h-full object-contain" />
                </div>
                
                {/* Información */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[16px] text-white leading-tight truncate">{item.itemName}</h3>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                       <span className="inline-block text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-[#0f161b] px-2 py-0.5 rounded-md border border-[#2C3A47]">
                         {item.type || "Item"}
                       </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    
                    {/* Controles */}
                    <div className="flex items-center bg-[#0f161b] rounded-full border border-[#FFFF00] h-9">
                        <button 
                            onClick={() => {
                                const realIndex = cart.findIndex(c => c.itemName === item.itemName);
                                if (realIndex !== -1) removeFromCart(realIndex);
                            }}
                            className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90"
                        >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>

                        <div className="w-8 flex items-center justify-center border-l border-r border-[#2C3A47]/50 h-full">
                            <span className="text-sm font-extrabold text-white">{item.quantity}</span>
                        </div>

                        <button 
                            onClick={() => {
                                addToCart(item);
                            }}
                            className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>

                    {/* Precio Item */}
                    <div className="text-white font-extrabold text-lg mb-0.5">
                      {selectedCountry.symbol} {item.totalPrice.toFixed(2)}
                    </div>

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {groupedCart.length > 0 && (
          <div className="p-5 border-t border-[#2C3A47] bg-[#192028] z-10 safe-pb">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FFFF00] hover:bg-[#e6e200] text-black font-extrabold py-3 rounded-xl text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}