import { useEffect, useState } from "react";

export default function SearchBar({ setSearchTerm }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 400); // ✅ Debounce: 400ms

    return () => clearTimeout(handler);
  }, [inputValue, setSearchTerm]);

  return (
    <div className="w-full px-0 mt-0">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        placeholder="Buscar skins, pases..."
        className="bg-[#202224] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-600"
      />
    </div>
  );
}
