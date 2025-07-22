export default function FilterBar({ currentFilter, setCurrentFilter }) {
  const filters = ["Todos", "Atuendo", "Gesto", "Calzado", "Música", "Autos","Pases"];

  return (
    <div className="flex flex-wrap justify-start px-0 py-0 gap-2 w-full">
      {filters.map((type, index) => (
        <button
          key={index}
          onClick={() => setCurrentFilter(type)}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
            currentFilter === type
              ? "bg-white text-black shadow-md"
              : "bg-[#202224] text-white hover:bg-[#2f3136]"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
