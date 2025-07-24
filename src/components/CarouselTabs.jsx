import { useState } from "react";

const tabs = [
  { id: "regalo", name: "Regalo", img: "/img/regalo_morado.png" },
  { id: "crew", name: "Crew", img: "/img/crew.jpg" }, // ✅ Nuevo
  { id: "pavos", name: "Pavos", img: "/img/robux_1.png" },
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
      <div className="flex items-center gap-4 overflow-x-auto bg-[#0f161b] py-3 px-4 scrollbar-hide w-full">

        {tabs.map((tab) => (
         <div
  key={tab.id}
  onClick={() => handleTabClick(tab.id)}
  className={`cursor-pointer transform transition-all duration-300 rounded-xl flex-shrink-0 ${
    activeTab === tab.id
      ? "scale-105 ring-4 ring-[#45f983] shadow-[0_0_15px_rgba(69,249,131,0.6)]"
      : "opacity-80 hover:scale-100 hover:opacity-100"
  }`}
>
  <img
    src={tab.img}
    alt={tab.name}
    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-[#2C3A47]"
  />
</div>

        ))}
      </div>
    </div>
  );
}

