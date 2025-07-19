import { useEffect, useState } from "react";
import Card from "./Card";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";

export default function ShopGrid({ selectedCountry, searchTerm, setSearchTerm, addToCart }) {
  const [allItems, setAllItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [currentFilter, setCurrentFilter] = useState("Todos");

  useEffect(() => {
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
            vBucks,
            type,
          };

          all.push(item);
          if (!byCategory[category]) byCategory[category] = [];
          byCategory[category].push(item);
        });

        setAllItems(all);
        setItemsByCategory(byCategory);
      });
  }, []);

  const filters = ["Todos", "Atuendo", "Gesto", "Calzado", "Música", "Personaje", "Autos"];

  const globalResults = searchTerm
    ? allItems.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-8 px-4 py-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <FilterBar
        types={filters}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      {searchTerm ? (
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
      ) : (
        Object.keys(itemsByCategory).map((category) => {
          const sectionItems = itemsByCategory[category].filter(
            (item) => currentFilter === "Todos" || item.type === currentFilter
          );
          if (sectionItems.length === 0) return null;

          return (
            <section key={category} className="mb-10">
              <h2 className="text-white text-2xl font-bold mb-4 text-center">{category}</h2>
              <div className="grid gap-x-5 gap-y-6 grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] justify-center">
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
