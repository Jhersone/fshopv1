import { msgCart } from "../utils/messages"; // Ajusta si tu import es distinto

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, addToCart, selectedCountry }) {
  // Si está cerrado, no renderizamos nada (o podrías usar clases para ocultarlo)
  if (!isOpen) return null;

  // 1. CÁLCULO DE TOTAL
  const total = cart.reduce((acc, item) => {
    const price = Number(item.localPrice || item.price || 0);
    return acc + (price * (item.quantity || 1));
  }, 0);

  // 2. WHATSAPP
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Usamos tu lógica de mensajes
    const message = msgCart ? msgCart(cart, selectedCountry, total) : "Hola, quiero comprar..."; 

    // 👇 PON TU NÚMERO AQUÍ
    const phoneNumber = "51931646873"; 
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    // CONTENEDOR PRINCIPAL (OVERLAY)
    // Mobile: items-end (se pega abajo)
    // PC (md): items-stretch justify-end (se pega a la derecha y ocupa todo el alto)
    <div className="fixed inset-0 z-[100] flex flex-col items-end md:flex-row md:justify-end">
      
      {/* Fondo oscuro (Click para cerrar) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* === VENTANA DEL CARRITO === */}
      {/* CLASES CLAVE PARA EL CAMBIO DE FORMA:
          1. w-full md:w-[450px]: En móvil es ancho completo, en PC es de 450px fijo.
          2. h-[85vh] md:h-full: En móvil ocupa el 85% de alto, en PC ocupa TODO el alto.
          3. rounded-t-3xl md:rounded-none md:rounded-l-2xl: Bordes redondeados arriba en móvil, bordes a la izquierda en PC.
      */}
      <div className="relative bg-[#192028] w-full md:w-[450px] h-[85vh] md:h-full rounded-t-3xl md:rounded-none md:rounded-l-2xl shadow-2xl flex flex-col border-t md:border-t-0 md:border-l border-[#2C3A47] animate-slide-up md:animate-none">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2C3A47] bg-[#192028] z-10 rounded-t-3xl md:rounded-none">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-cart-shopping text-[#FFFF00]"></i>
              Tu Carrito ({cart.length})
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Subtotal: <span className="text-[#FFFF00] font-bold text-base ml-1">{selectedCountry.symbol} {total.toFixed(2)}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0f161b] text-gray-400 hover:text-white border border-[#2C3A47] transition-colors hover:rotate-90 duration-300">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto px-5 scrollbar-thin scrollbar-thumb-[#2C3A47] scrollbar-track-transparent">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 opacity-60">
              <i className="fa-solid fa-basket-shopping text-6xl animate-bounce"></i>
              <p className="text-lg font-bold">Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item, index) => {
               // Recuperamos la imagen segura
               const imgSrc = item.fallbackImage || item.images?.icon || item.images?.smallIcon || item.background;
               const unitPrice = Number(item.localPrice || item.price || 0);

               return (
                <div key={index} className="flex gap-4 py-5 border-b border-[#2C3A47] last:border-b-0 group">
                  
                  {/* Imagen */}
                  <div className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#2C3A47] p-0 flex items-center justify-center relative ${item.background || "bg-[#0f161b]"}`}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.itemName} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <span className="text-[10px]">Sin img</span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight truncate">{item.itemName}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.type || "Item"}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-[#0f161b] rounded-lg border border-[#2C3A47] h-7">
                          <button onClick={() => removeFromCart(index)} className="w-7 h-full text-gray-400 hover:text-red-400"><i className="fa-solid fa-minus text-[10px]"></i></button>
                          <span className="w-6 text-center text-xs font-bold text-white">{item.quantity || 1}</span>
                          <button onClick={() => addToCart(item)} className="w-7 h-full text-gray-400 hover:text-green-400"><i className="fa-solid fa-plus text-[10px]"></i></button>
                      </div>
                      <span className="text-[#FFFF00] font-bold text-sm">
                        {selectedCountry.symbol} {unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer (Botón de Compra) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#2C3A47] bg-[#192028] z-10">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FFFF00] hover:bg-[#e6e200] text-black font-extrabold py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Completar Pedido
            </button>
            <p className="text-center text-gray-500 text-xs mt-3">
              Serás redirigido a WhatsApp para coordinar el pago.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}