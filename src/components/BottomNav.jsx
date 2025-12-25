// src/components/BottomNav.jsx
export default function BottomNav({ cartCount, onOpenCart }) {
  
  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("search-input")?.focus();
    }, 500);
  };

  // Mensaje personalizado para el botón de ayuda
  const handleHelp = () => {
    const phone = "51931646873"; // Tu número
    const text = encodeURIComponent("Tio Hunter quiero comprar pero tengo una duda");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#141414] border-t border-[#2C3A47] z-50 px-6 py-2 flex justify-between items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-safe">
      
      {/* Botón INICIO */}
      <button onClick={handleHome} className="flex flex-col items-center gap-1 text-gray-200 hover:text-[#FFFB00] transition-colors w-16">
        <i className="fa-solid fa-house text-xl mb-0.5"></i>
        <span className="text-[11px] font-bold">Inicio</span>
      </button>

      {/* Botón BUSCAR */}
      <button onClick={handleSearch} className="flex flex-col items-center gap-1 text-gray-200 hover:text-[#FFFB00] transition-colors w-16">
        <i className="fa-solid fa-magnifying-glass text-xl mb-0.5"></i>
        <span className="text-[11px] font-bold">Buscar</span>
      </button>

      {/* Botón CARRITO */}
      <button onClick={onOpenCart} className="flex flex-col items-center gap-1 text-gray-200 hover:text-[#FFFB00] transition-colors w-16 relative">
        <div className="relative">
          <i className="fa-solid fa-cart-shopping text-xl mb-0.5"></i>
          
          {/* 👇 CAMBIO 1: El contador SIEMPRE se muestra, incluso si es 0 */}
          <span className="absolute -top-3 -right-3 bg-[#e63946] text-white text-xs font-extrabold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#0D1321] shadow-sm animate-bounce">
            {cartCount}
          </span>
          
        </div>
        <span className="text-[11px] font-bold">Carrito</span>
      </button>

      {/* Botón AYUDA */}
      <button onClick={handleHelp} className="flex flex-col items-center gap-1 text-gray-200 hover:text-[#FFFB00] transition-colors w-16">
        {/* 👇 CAMBIO 2: Aumenté el tamaño a text-2xl */}
        <i className="fa-brands fa-whatsapp text-2xl mb-0.5"></i>
        <span className="text-[11px] font-bold">Ayuda</span>
      </button>

    </div>
  );
}