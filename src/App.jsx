import { useState } from "react";
import Header from "./components/Header";
import CarouselTabs from "./components/CarouselTabs";
import ShopGrid from "./components/ShopGrid";
import CrewContainer from "./components/CrewContainer";
import AvisoRegalo from "./components/AvisoRegalo";
import FloatingButtons from "./components/FloatingButtons";
import ImageSlider from "./components/ImageSlider";
import RobuxCard from "./components/RobuxCard";
import MarqueeNotice from "./components/MarqueeNotice";
import FreeFireShop from "./components/FreeFireShop";

function App() {
  const [selectedCountry, setSelectedCountry] = useState({
    code: "PE",
    name: "Perú",
    flag: "🇵🇪",
    symbol: "S/",
    rate: 0.015,
  });

  const [activeTab, setActiveTab] = useState("regalo");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen text-white">
      <Header
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      
      <ImageSlider />

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
          <CrewContainer selectedCountry={selectedCountry} addToCart={addToCart} />
        )}
{activeTab === "pavos" && (
  <div className="space-y-4">
    <MarqueeNotice /> {/* Texto animado solo para Robux */}
    <RobuxCard selectedCountry={selectedCountry} />
  </div>
)}
{activeTab === "freefire" && (
  <FreeFireShop selectedCountry={selectedCountry} />
)}

      </main>

      <FloatingButtons />
    </div>
  );
}

export default App;
