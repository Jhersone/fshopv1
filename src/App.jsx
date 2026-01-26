// src/App.jsx
import { useState, useEffect } from "react";
import { useCountry } from "@/hooks/useCountry"; 
import CustomSnowfall from "./components/CustomSnowfall";
import Header from "./components/Header";
import CarouselTabs from "./components/CarouselTabs";
import ShopGrid from "./components/ShopGrid";
import CrewClub from "./components/CrewClub";
import AvisoRegalo from "./components/AvisoRegalo";
import RobuxShop from "./components/RobuxShop";
import FreeFireShop from "./components/FreeFireShop";
import VBucksShop from "./components/VBucksShop";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";     
import CartDrawer from "./components/CartDrawer";
import { VideoModal } from "@/components/VideoModal"; 
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/config";

const APP_VERSION = "10.5"; // Subimos versión por si acaso

function App() {
  const [selectedCountry, setSelectedCountry] = useCountry(DEFAULT_COUNTRY);
  const [activeTab, setActiveTab] = useState("regalo");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Limpieza de caché
  useEffect(() => {
    const storedVersion = localStorage.getItem("app_version");

    if (storedVersion !== APP_VERSION) {
      console.log("Nueva actualización detectada. Limpiando caché...");
      localStorage.removeItem("cart"); 
      localStorage.clear(); 
      localStorage.setItem("app_version", APP_VERSION);
      setCart([]);
    }
  }, []);

  const handleCountryChange = (countryIncoming) => {
    const freshData = COUNTRIES[countryIncoming.code]; 
    setSelectedCountry(freshData);
  };

  // ✅ FUNCIÓN ADD TO CART
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      let typeStr = "item";
      try {
        if (newItem.type?.displayValue) typeStr = newItem.type.displayValue;
        else if (typeof newItem.type === "string") typeStr = newItem.type;
        else if (newItem.type) typeStr = JSON.stringify(newItem.type); 
      } catch (e) { console.error(e); }

      const safeId = newItem.id || newItem.itemName || "unknown"; 
      const uniqueIdentity = `${safeId}-${typeStr}`;
      
      const existingIndex = prevCart.findIndex((item) => {
        let t = "item";
        if (item.type?.displayValue) t = item.type.displayValue;
        else if (typeof item.type === "string") t = item.type;
        else if (item.type) t = JSON.stringify(item.type);
        
        const itemSafeId = item.id || item.itemName || "unknown";
        return `${itemSafeId}-${t}` === uniqueIdentity;
      });

      if (existingIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: (newCart[existingIndex].quantity || 1) + 1
        };
        return newCart;
      } else {
        return [...prevCart, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      
      <CustomSnowfall />

      <VideoModal country={selectedCountry} />

      <div className="relative z-10 pt-16">
        
        <div className="fixed top-0 left-0 w-full z-50 bg-[#0D1321] shadow-lg border-b border-gray-800">
          <Header
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange} 
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        </div>

        <CarouselTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "regalo" && (
          <div className="px-4">
            <AvisoRegalo />
          </div>
        )}

        <main 
          className={`
            py-4 sm:py-6 
            ${activeTab === "regalo" ? "px-0 sm:px-6 pb-24" : "px-4 sm:px-6 pb-8"}
          `}
        >
          {activeTab === "regalo" && (
            <ShopGrid
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCountry={selectedCountry}
              addToCart={addToCart}
            />
          )}
          {activeTab === "crew" && (
            <CrewClub selectedCountry={selectedCountry} />
          )}
          {activeTab === "pavos" && (
             <div className="space-y-4">
               <RobuxShop selectedCountry={selectedCountry} />
             </div>
          )}
          {activeTab === "freefire" && (
            <FreeFireShop selectedCountry={selectedCountry} />
          )}
          {activeTab === "vbucks" && (
            <VBucksShop selectedCountry={selectedCountry} />
          )}
        </main>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          selectedCountry={selectedCountry}
        />
 {/* === BOTÓN FLOTANTE PARA PC (Siempre muestra el 0 rebotando) === */}
        {activeTab === "regalo" && (
          <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[1280px] z-50 pointer-events-none justify-end px-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="pointer-events-auto bg-[#FFFF00] text-black w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-4 border-black group"
            >
              <div className="relative">
                <i className="fa-solid fa-cart-shopping text-2xl group-hover:rotate-12 transition-transform"></i>
                
                {/* 🔴 CAMBIO AQUÍ: Quitamos la condición. 
                    Ahora siempre renderiza el span, mostrando "0" si está vacío. */}
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                  {cart.length}
                </span>

              </div>
            </button>
          </div>
        )}

        {/* BARRA DE NAVEGACIÓN (Solo visible en Móvil) */}
        {activeTab === "regalo" && (
          <div className="md:hidden"> 
             <BottomNav 
               cartCount={cart.length} 
               onOpenCart={() => setIsCartOpen(true)}
             />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;