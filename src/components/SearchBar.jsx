import { useEffect, useState } from "react";

export default function SearchBar({ setSearchTerm }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchTerm]);

  return (
    <div className="w-full px-0 mt-0">
      <div className="relative">
        {/* Ícono de búsqueda */}
        <i className="fas fa-search text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>

        {/* Input */}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Buscar skins, pases..."
          className="bg-[#192028] text-white placeholder-gray-400 border border-[#2C3A47] rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-[#45f983] focus:ring-2 focus:ring-[#36e673] transition"
        />
      </div>
    </div>
  );
}
