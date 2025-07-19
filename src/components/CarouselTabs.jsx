import { useState } from "react";

const tabs = [
  { id: "regalo", name: "Regalo", img: "/img/regalo-icon.jpg" },
  { id: "pavos", name: "Pavos", img: "/img/regalo-icon.jpg" },
  { id: "packs", name: "Packs", img: "/img/pack-icon.png" },
  { id: "ofertas", name: "Ofertas", img: "/img/ofertas-icon.png" },
  { id: "skins", name: "Skins", img: "/img/skins-icon.png" },
];

export default function CarouselTabs({ activeTab, setActiveTab }) {
  const [showText, setShowText] = useState(true);

  const handleTabClick = (tabId) => {
    setShowText(false);
    setTimeout(() => {
      setActiveTab(tabId);
      setShowText(true);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Carrusel */}
     <div className="flex items-center gap-6 overflow-x-auto bg-black py-4 px-4 scrollbar-hide w-full">

        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`cursor-pointer transform transition-all duration-300 rounded-xl flex-shrink-0
              ${
                activeTab === tab.id
                  ? "scale-110 ring-4 ring-red-600 shadow-[0_0_25px_rgba(255,0,0,0.8)]"
                  : "opacity-80 hover:scale-105 hover:opacity-100"
              }`}
          >
            <img
              src={tab.img}
              alt={tab.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-gray-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
