export default function FilterBar({ types = [], currentFilter, setCurrentFilter }) {
  return (
    <div className="flex flex-wrap justify-start gap-2 w-full">
      {types.map((typeObj) => {
        const label = typeof typeObj === "string" ? typeObj : typeObj.label;
        const value = typeof typeObj === "string" ? typeObj : typeObj.value;
        return (
          <button
            key={value}
            onClick={() => setCurrentFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-burbank transition-all duration-300 ${
              currentFilter === value
                ? "bg-[#FAF600] text-[#101820] shadow-lg"
                : "bg-[#192028] text-white hover:bg-[#22303C]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
