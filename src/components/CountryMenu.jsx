/* ==================== SELECTOR DE PAÍSES (NUEVO) ==================== */
const OPTIONS = [
  { code: "PE", name: "Perú",     flag: "🇵🇪", symbol: "S/" },
  { code: "MX", name: "México",   flag: "🇲🇽", symbol: "$"  },
  { code: "US", name: "USA",      flag: "🇺🇸", symbol: "$"  },
  { code: "BO", name: "Bolivia",  flag: "🇧🇴", symbol: "USDT" },
  { code: "CL", name: "Chile",    flag: "🇨🇱", symbol: "$"  },
  { code: "CO", name: "Colombia", flag: "🇨🇴", symbol: "$"  },
];

export function CountryMenu({ current, onSelect, onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-[#192028] rounded-lg shadow-xl border border-[#2C3A47] z-50 p-2 overflow-hidden">
      <div className="flex flex-col gap-1">
        {OPTIONS.map(opt => (
          <button
            key={opt.code}
            onClick={() => { onSelect(opt); onClose?.(); }}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded hover:bg-[#22303C] text-left transition-colors ${
              current?.code === opt.code ? "bg-[#22303C] border border-[#2C3A47]" : "border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{opt.flag}</span>
              <span className="text-sm font-bold text-white">{opt.name}</span>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-[#0f161b] px-1.5 py-0.5 rounded">
              {opt.code}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}