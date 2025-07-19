export default function CountrySelector({ country, setCountry }) {
  const countries = [
    { code: "PE", flag: "🇵🇪", symbol: "S/", rate: 0.015 },
    { code: "MX", flag: "🇲🇽", symbol: "$", rate: 0.08 },
    { code: "BO", flag: "🇧🇴", symbol: "Bs", rate: 0.012 },
  ];

  const handleSelect = (code) => {
    setCountry(code);
  };

  return (
    <div className="relative inline-block">
      <button className="bg-white text-black px-3 py-1 rounded flex items-center gap-2">
        <span>{countries.find(c => c.code === country)?.flag}</span>
        <span>{country}</span>
        <i className="fas fa-chevron-down"></i>
      </button>
      <div className="absolute bg-black text-white w-32 rounded mt-1 shadow-lg">
        {countries.map((c) => (
          <div
            key={c.code}
            onClick={() => handleSelect(c.code)}
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            {c.flag} {c.code}
          </div>
        ))}
      </div>
    </div>
  );
}
