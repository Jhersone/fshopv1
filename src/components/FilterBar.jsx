export default function FilterBar({ types = [], currentFilter, setCurrentFilter }) {
  return (
    <div className="flex flex-wrap justify-start gap-2 w-full">
      {types.map((typeObj) => {
        const label = typeof typeObj === "string" ? typeObj : typeObj.label;
        const value = typeof typeObj === "string" ? typeObj : typeObj.value;
        
        // Verificamos si este botón está activo
        const isActive = currentFilter === value;

        return (
          <button
            key={value}
            onClick={() => setCurrentFilter(value)}
            // Agregamos 'uppercase', 'font-bold' y 'border-2' para dar estructura
            className={`
              px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 border-2
              ${
                isActive
                  ? "bg-[#FAF600] text-[#101820] border-[#FAF600] shadow-[0_0_15px_rgba(250,246,0,0.4)] scale-105"
                  : "bg-[#192028] text-gray-400 border-[#2C3A47] hover:border-gray-300 hover:text-white hover:bg-[#22303C]"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}