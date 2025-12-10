import { useState } from "react";
import CustomSnowfall from "./components/CustomSnowfall";
import Header from "./components/Header";
import CarouselTabs from "./components/CarouselTabs";
import ShopGrid from "./components/ShopGrid";
import CrewClub from "./components/CrewClub";
import AvisoRegalo from "./components/AvisoRegalo";
import FloatingButtons from "./components/FloatingButtons";
import BannerCarousel from "./components/BannerCarousel";
import RobuxShop from "./components/RobuxShop";
import FreeFireShop from "./components/FreeFireShop";
import VBucksShop from "./components/VBucksShop";
import { useCountry } from "@/hooks/useCountry";
import { DEFAULT_COUNTRY } from "@/lib/currency";
import Footer from "./components/Footer";

function App() {
  const [selectedCountry, setSelectedCountry] = useCountry(DEFAULT_COUNTRY);
  const [activeTab, setActiveTab] = useState("regalo");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    // 1. Quité bg-[#0f161b] para respetar tu color original
    <div className="min-h-screen text-white relative overflow-x-hidden">
      
      {/* 2. La nieve (z-0) se verá detrás de todo */}
      <CustomSnowfall />

      {/* 3. Contenedor con z-10 para que tu contenido esté ENCIMA de la nieve */}
      <div className="relative z-10">
        
        <Header
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
        {/* <BannerCarousel /> */}

        <CarouselTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "regalo" && (
          <div className="px-4">
            <AvisoRegalo />
          </div>
        )}

        <main className="p-6">
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

        <FloatingButtons />
        <Footer />
        
      </div>
    </div>
  );
}

export default App;