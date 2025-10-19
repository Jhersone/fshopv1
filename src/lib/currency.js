export const COUNTRIES = {
  PE: { code: "PE", name: "Perú", flag: "🇵🇪", symbol: "S/", rates: { vbucks: 0.015, robux: 35, crew: 20 } },
  MX: { code: "MX", name: "México", flag: "🇲🇽", symbol: "$",  rates: { vbucks: 0.09,  robux: 185.5, crew: 110 } },
  BO: { code: "BO", name: "Bolivia", flag: "🇧🇴", symbol: "Bs", rates: { vbucks: 0.012, robux: 0,   crew: 140 } },
  CL: { code: "CL", name: "Chile", flag: "🇨🇱", symbol: "$",  rates: { vbucks: 0.0,   robux: 0,   crew: 6500 } },
  US: { code: "US", name: "USA",  flag: "🇺🇸", symbol: "$",  rates: { vbucks: 0.0,   robux: 0,   crew: 5.99 } },
};
export const DEFAULT_COUNTRY = COUNTRIES.PE;

export const fmt = (code, amount) => {
  const c = COUNTRIES[code] ?? DEFAULT_COUNTRY;
  return `${c.symbol} ${Number(amount).toFixed(2)}`;
};
