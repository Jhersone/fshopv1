export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex justify-center mt-0 px-4">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Buscar cosmético..."
        className="bg-[#202224] text-white border border-gray-700 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
      />
    </div>
  );
}
