import { useState } from "react";
import Header from "./components/Header";
import CarouselTabs from "./components/CarouselTabs";
import ShopGrid from "./components/ShopGrid";
import CrewContainer from "./components/CrewContainer";
import AvisoRegalo from "./components/AvisoRegalo"; // ✅ Aviso de regalos
import FloatingButtons from "./components/FloatingButtons"; // ✅ Botones flotantes

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
  const [cart, setCart] = useState([]); // ✅ Estado global del carrito

  // ✅ Función para agregar al carrito
  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  // ✅ Función para eliminar del carrito
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Función para limpiar carrito
  const clearCart = () => setCart([]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ✅ Header con carrito y selector */}
      <Header
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      {/* ✅ Carrusel de Tabs */}
      <CarouselTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ✅ Aviso Regalo solo en Tab regalo */}
      {activeTab === "regalo" && (
        <div className="px-4">
          <AvisoRegalo />
        </div>
      )}

      {/* ✅ Contenido Principal */}
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
          <CrewContainer
            selectedCountry={selectedCountry}
            addToCart={addToCart}
          />
        )}

        {activeTab === "pavos" && (
          <div className="text-center text-xl mt-10 font-bold text-red-500">
            Más tarde se añadirá los precios
            <br />
            Únete al grupo en Roblox
            <br />
            <span className="text-white">TIOHUNTER</span>
          </div>
        )}
      </main>

      {/* ✅ Botones flotantes en toda la App */}
      <FloatingButtons />
    </div>
  );
}

export default App;
