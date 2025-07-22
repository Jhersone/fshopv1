import { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";

export default function ShopGrid({ selectedCountry, searchTerm, setSearchTerm, addToCart }) {
  const [allItems, setAllItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [currentFilter, setCurrentFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // ✅ Tasas de conversión (1 Sol = ?)
  const conversionRates = {
    PE: 1,     // Perú (Soles)
    MX: 5.3,   // México
    BO: 3.7,   // Bolivia
    CL: 250,   // Chile
    US: 0.27,  // USA
  };

  const rate = conversionRates[selectedCountry.code] || 1;

  // ✅ Datos manuales para Pases con precio base en Soles
  const manualPases = [
    {
      itemName: "Pase de Batalla",
      renderImage: "/img/pase_batalla.webp",
      basePrice: 22, // en soles
      type: "Pases",
    },
    {
      itemName: "Pase Musical",
      renderImage: "/img/pase_musical.webp",
      basePrice: 28,
      type: "Pases",
    },
    {
      itemName: "Pase Origenes",
      renderImage: "/img/pase_origenes.webp",
      basePrice: 22,
      type: "Pases",
    },
    {
      itemName: "Pase Lego",
      renderImage: "/img/pase_lego.webp",
      basePrice: 28,
      type: "Pases",
    },
  ];

  // ✅ Calculamos precios dinámicos con redondeo hacia arriba
const manualPasesWithPrice = manualPases.map((pase) => ({
  ...pase,
  localPrice: Math.ceil(pase.basePrice * rate), // ✅ Conversión + redondeo
}));


  // ✅ Fetch API para cosméticos
  const fetchShopData = () => {
    setLoading(true);
    fetch("https://fortnite-api.com/v2/shop?language=es-419")
      .then((res) => res.json())
      .then((data) => {
        const all = [];
        const byCategory = {};

        data.data.entries.forEach((entry) => {
          const renderImage =
            entry.newDisplayAsset?.renderImages?.[0]?.image ||
            entry.tracks?.[0]?.albumArt ||
            "";

          const fallbackImage =
            entry.bundle?.image ||
            entry.displayAsset?.image ||
            entry.albumArt ||
            entry.brItems?.[0]?.images?.icon ||
            entry.tracks?.[0]?.albumArt ||
            "";

          if (!renderImage && !fallbackImage) return;

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

          const item = {
            itemName,
            renderImage,
            fallbackImage,
            rarity,
            vBucks,
            type,
          };

          all.push(item);
          if (!byCategory[category]) byCategory[category] = [];
          byCategory[category].push(item);
        });

        setAllItems(all);
        setItemsByCategory(byCategory);
        setLastFetchTime(Date.now());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener tienda:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const now = Date.now();
    if (!lastFetchTime || now - lastFetchTime > 5 * 60 * 1000) {
      fetchShopData();
    }

    const interval = setInterval(() => {
      fetchShopData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [lastFetchTime]);

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

      <FilterBar
        types={filters}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

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
                <Card
                  key={index}
                  item={item}
                  selectedCountry={selectedCountry}
                  addToCart={addToCart}
                />
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
          vBucks: `${item.basePrice} PEN`, // Mostramos base (opcional)
        }}
        selectedCountry={{
          ...selectedCountry,
          symbol: selectedCountry.symbol || "$", // Aseguramos símbolo
          // 👇 Inyectamos el precio convertido dinámico
          rate: 1,
        }}
        addToCart={addToCart}
        localPrice={item.localPrice} // ✅ Pasamos el precio ya calculado
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
                  <Card
                    key={index}
                    item={item}
                    selectedCountry={selectedCountry}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
