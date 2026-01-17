// src/App.jsx
import { useState, useEffect } from "react";
import { useCountry } from "@/hooks/useCountry"; 
import CustomSnowfall from "./components/CustomSnowfall";
import Header from "./components/Header";
import CarouselTabs from "./components/CarouselTabs";
import ShopGrid from "./components/ShopGrid";
import CrewClub from "./components/CrewClub";
import AvisoRegalo from "./components/AvisoRegalo";
import FloatingButtons from "./components/FloatingButtons";
import RobuxShop from "./components/RobuxShop";
import FreeFireShop from "./components/FreeFireShop";
import VBucksShop from "./components/VBucksShop";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";    
import CartDrawer from "./components/CartDrawer";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/config";
import { VideoModal } from "@/components/VideoModal"; // ✅ Importado correctamente

// 👇 CAMBIO 1: Subimos versión para asegurar limpieza total
const APP_VERSION = "4.0"; 

function App() {
  const [selectedCountry, setSelectedCountry] = useCountry(DEFAULT_COUNTRY);
  const [activeTab, setActiveTab] = useState("regalo");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lógica de limpieza de caché por versión
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

  // 👇 CAMBIO 2: Función "Interceptora"
  const handleCountryChange = (countryIncoming) => {
    const freshData = COUNTRIES[countryIncoming.code]; 
    setSelectedCountry(freshData);
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      
      <CustomSnowfall />

      {/* ✅ AQUÍ ESTÁ EL VIDEO: Se activará solo si selectedCountry es Bolivia */}
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
        
        {activeTab === "regalo" && (
          <BottomNav 
            cartCount={cart.length} 
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        
      </div>
    </div>
  );
}

export default App;