import { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";
import { getShop } from "@/services/shopService";

export default function ShopGrid({ selectedCountry, searchTerm, setSearchTerm, addToCart }) {
  const [allItems, setAllItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [currentFilter, setCurrentFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);

  const manualPases = [
    { itemName: "Pase de Batalla", fallbackImage: "/img/pase_batalla.webp", type: "Pases", prices: { PE: 22, MX: 121, BO: 6.63, US: 6.63, CO: 28000 ,CL: 6550} },
    { itemName: "Pase Musical",  fallbackImage: "/img/pase_musical.webp", type: "Pases", prices: { PE: 28, MX: 154, BO: 8.45, US: 8.45  ,CO: 35000 ,CL: 8500} },
    { itemName: "Pase Orígenes", fallbackImage: "/img/pase_origenes.webp", type: "Pases", prices: { PE: 22, MX: 121, BO: 6.63 , US: 6.63, CO: 28000 ,CL: 6550} },
    { itemName: "Pase Lego",     fallbackImage: "/img/pase_lego.webp",     type: "Pases", prices: { PE: 28, MX: 154, BO: 8.45, US: 8.45 ,CO: 35000 ,CL: 8500}},
  ];
  const manualPasesWithPrice = manualPases.map((p) => ({
    ...p,
    localPrice: p.prices[selectedCountry.code] || p.prices["PE"],
  }));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { all, byCategory } = await getShop();
        setAllItems(all);
        setItemsByCategory(byCategory);
      } catch (e) {
        console.error("Error al obtener tienda:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

// 🔹 Filtros
const filters = [
  "Todos",
  { label: "SKINS", value: "Atuendo" },
  { label: "BAILES", value: "Gesto" },
   { label: "MASCOTA", value: "Compañero" },
  "Calzado",
  "Música",
  "Autos",
  "Pases"
  
];

  const combinedItems = currentFilter === "Pases" ? manualPasesWithPrice : allItems;

  const globalResults = useMemo(() => {
    if (!searchTerm) return [];
    const allForSearch = [...allItems, ...manualPasesWithPrice];
    return allForSearch.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allItems, manualPasesWithPrice]);

  return (
    <div className="space-y-6 w-full max-w-[990px] mx-auto">
      <SearchBar setSearchTerm={setSearchTerm} />
      <FilterBar types={filters} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      ) : searchTerm ? (
        <section className="mt-6">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">Resultados para: "{searchTerm}"</h2>
          {globalResults.length > 0 ? (
            /* 1. SECCIÓN DE BÚSQUEDA */
            <div className="grid gap-x-3 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-center">
              {globalResults.map((item, index) => (
                <Card key={index} item={item} selectedCountry={selectedCountry} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No se encontraron resultados.</p>
          )}
        </section>
      ) : currentFilter === "Pases" ? (
        <section>
          <h2 className="text-white text-2xl font-bold mb-4 text-center">Pases de Batalla</h2>
          {/* 2. SECCIÓN DE PASES */ }
          <div className="grid gap-x-3 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-center">
            {manualPasesWithPrice.map((item, index) => (
              <Card
                key={index}
                item={{ ...item, vBucks: "Precio fijo" }}
                selectedCountry={selectedCountry}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>
      ) : (
        Object.keys(itemsByCategory).map((category) => {
          const sectionItems = itemsByCategory[category].filter(
            (item) => currentFilter === "Todos" || item.type === currentFilter
          );
          if (!sectionItems.length) return null;
          return (
            <section key={category} className="mb-10">
              <h2 className="text-white text-2xl font-bold mb-4 text-center font-burbank-shadow">{category}</h2>
              {/* 3. SECCIÓN POR CATEGORÍAS */ }
              <div className="grid gap-x-3 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-center">
                {sectionItems.map((item, index) => (
                  <Card key={index} item={item} selectedCountry={selectedCountry} addToCart={addToCart} category={category} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}