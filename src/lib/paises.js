export const COUNTRIES = {
  PE: { code: "PE", name: "Perú", flag: "🇵🇪", symbol: "S/", rates: { vbucks: 0.015, robux: 35, crew: 25 } },//precio skins via regalo
  MX: { code: "MX", name: "México", flag: "🇲🇽", symbol: "$",  rates: { vbucks: 0.09,  robux: 185.5, crew: 140 } },
  BO: { code: "BO", name: "Bolivia", flag: "🇧🇴", symbol: "USDT", rates: { vbucks: 0.0046, robux: 0,   crew: 0 } },
  CL: { code: "CL", name: "Chile", flag: "🇨🇱", symbol: "$",  rates: { vbucks: 4.59,   robux: 0,   crew: 6500 } },
  US: { code: "US", name: "USA",  flag: "🇺🇸", symbol: "$",  rates: { vbucks: 0.0046,   robux: 0,   crew: 7.50 } },
  CO: { code: "CO", name: "Colombia",  flag: "co", symbol: "$",  rates: { vbucks: 19.20,   robux: 0,   crew: 7.50 } },
};
export const DEFAULT_COUNTRY = COUNTRIES.PE;

export const fmt = (code, amount) => {
  const c = COUNTRIES[code] ?? DEFAULT_COUNTRY;
  return `${c.symbol} ${Number(amount).toFixed(2)}`;
};
