// Lista rápida; si ya usas COUNTRIES en lib/currency, puedes importarlo de ahí
const OPTIONS = [
  { code: "PE", name: "Perú",   flag: "🇵🇪", symbol: "S/" },
  { code: "MX", name: "México", flag: "🇲🇽", symbol: "$"  },
  { code: "US", name: "USA",    flag: "🇺🇸", symbol: "$"  },
];

export default function CountryMenu({ current, onSelect, onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-44 bg-[#192028] rounded-lg shadow-xl border border-[#2C3A47] z-50 p-2">
      {OPTIONS.map(opt => (
        <button
          key={opt.code}
          onClick={() => { onSelect(opt); onClose?.(); }}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded hover:bg-[#22303C] text-left ${
            current?.code === opt.code ? "bg-[#22303C]" : ""
          }`}
        >
          <span className="text-lg">{opt.flag}</span>
          <span className="text-sm font-semibold">{opt.name}</span>
          <span className="text-xs text-gray-400">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}
