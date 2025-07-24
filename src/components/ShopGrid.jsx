import { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";

export default function ShopGrid({ selectedCountry, searchTerm, setSearchTerm, addToCart }) {
  const [allItems, setAllItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [currentFilter, setCurrentFilter] = useState("Atuendo");
  const [loading, setLoading] = useState(true);

  // ✅ Tasas de conversión dinámicas para skins (1 V-Buck → moneda local)
  const conversionRates = {
    PE: 0.015, // Perú
    MX: 0.08,  // México
    BO: 0.012, // Bolivia
  };

  const rate = conversionRates[selectedCountry.code] || 1;

  // ✅ Pases con precios fijos por país
  const manualPases = [
    {
      itemName: "Pase de Batalla",
      fallbackImage: "/img/pase_batalla.webp",
      type: "Pases",
      prices: { PE: 22, MX: 117, BO: 0 }
    },
    {
      itemName: "Pase Musical",
      fallbackImage: "/img/pase_musical.webp",
      type: "Pases",
      prices: { PE: 28, MX: 149, BO: 0 }
    },
    {
      itemName: "Pase Orígenes",
      fallbackImage: "/img/pase_origenes.webp",
      type: "Pases",
      prices: { PE: 22, MX: 117, BO: 0 }
    },
    {
      itemName: "Pase Lego",
      fallbackImage: "/img/pase_lego.webp",
      type: "Pases",
      prices: { PE: 28, MX: 149, BO: 0 }
    }
  ];

  // ✅ Ajustamos precios según país seleccionado
  const manualPasesWithPrice = manualPases.map((pase) => ({
    ...pase,
    localPrice: pase.prices[selectedCountry.code] || pase.prices["PE"]
  }));

  // ✅ Fetch tienda (solo fallbackImage)
  const fetchShopData = async () => {
    setLoading(true);
    const now = Date.now();
    const cachedData = localStorage.getItem("fortniteShopData");
    const cachedTime = localStorage.getItem("fortniteShopTime");

    if (cachedData && cachedTime && now - cachedTime < 5 * 60 * 1000) {
      const parsedData = JSON.parse(cachedData);
      setAllItems(parsedData.all);
      setItemsByCategory(parsedData.byCategory);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://fortnite-api.com/v2/shop?language=es-419");
      const data = await response.json();

      const all = [];
      const byCategory = {};

      data.data.entries.forEach((entry) => {
        const fallbackImage =
          entry.bundle?.image ||
          entry.displayAsset?.image ||
          entry.albumArt ||
          entry.brItems?.[0]?.images?.icon ||
          entry.tracks?.[0]?.albumArt ||
          "";

        if (!fallbackImage) return;

        const itemName =
          entry.bundle?.name ||
          entry.brItems?.[0]?.name ||
          entry.tracks?.[0]?.title ||
          "SIN NOMBRE";

        const rarity = entry.brItems?.[0]?.rarity?.displayValue || "Común";
        let type = entry.brItems?.[0]?.type?.displayValue || "Otros";
        if (type === "Otros" && entry.tracks?.length > 0) type = "Música";
        if (type === "Zapatos") type = "Calzado";
        if (entry.cars?.length > 0) type = "Autos";

        const vBucks = entry.finalPrice;
        const category = entry.layout?.name || "Otros";

        const item = { itemName, fallbackImage, rarity, vBucks, type };
        all.push(item);

        if (!byCategory[category]) byCategory[category] = [];
        byCategory[category].push(item);
      });

      setAllItems(all);
      setItemsByCategory(byCategory);

      localStorage.setItem("fortniteShopData", JSON.stringify({ all, byCategory }));
      localStorage.setItem("fortniteShopTime", now.toString());

    } catch (error) {
      console.error("Error al obtener tienda:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const filters = ["Todos", "Atuendo", "Gesto", "Calzado", "Música", "Personaje", "Autos", "Pases"];
  const combinedItems = currentFilter === "Pases" ? manualPasesWithPrice : allItems;

  const globalResults = useMemo(() => {
    if (!searchTerm) return [];
    const allForSearch = [...allItems, ...manualPasesWithPrice];
    return allForSearch.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allItems, manualPasesWithPrice]);

  return (
    <div className="space-y-6 px-0 py-0 w-full max-w-[1200px] mx-auto">
      <SearchBar setSearchTerm={setSearchTerm} />
      <FilterBar types={filters} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      ) : searchTerm ? (
        <section className="mt-6">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            Resultados para: "{searchTerm}"
          </h2>
          {globalResults.length > 0 ? (
            <div className="grid gap-x-5 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] justify-center">
              {globalResults.map((item, index) => (
                <Card key={index} item={item} selectedCountry={{ ...selectedCountry, rate }} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No se encontraron resultados.</p>
          )}
        </section>
      ) : currentFilter === "Pases" ? (
        <section>
          <h2 className="text-white text-2xl font-bold mb-4 text-center">Pases de Batalla</h2>
          <div className="grid gap-x-5 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] justify-center">
            {manualPasesWithPrice.map((item, index) => (
              <Card
                key={index}
                item={{
                  ...item,
                  vBucks: "Precio fijo", // Solo para mostrar algo descriptivo
                }}
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
          if (sectionItems.length === 0) return null;

          return (
            <section key={category} className="mb-10">
              <h2 className="text-white text-2xl font-bold mb-4 text-center">{category}</h2>
              <div className="grid gap-x-5 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] justify-center">
                {sectionItems.map((item, index) => (
                  <Card key={index} item={item} selectedCountry={{ ...selectedCountry, rate }} addToCart={addToCart} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
