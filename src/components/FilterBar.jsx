export default function FilterBar({ types = [], currentFilter, setCurrentFilter }) {
  const filters = types.length ? types : ["Todos", "Atuendo", "Gesto", "Calzado", "Música", "Autos", "Pases"];
  return (
    <div className="flex flex-wrap justify-start gap-2 w-full">
      {filters.map((type) => (
        <button
          key={type}
          onClick={() => setCurrentFilter(type)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            currentFilter === type
              ? "bg-[#45f983] text-[#101820] shadow-lg"
              : "bg-[#192028] text-white hover:bg-[#22303C]"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
