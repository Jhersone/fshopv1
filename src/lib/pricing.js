import { COUNTRIES, DEFAULT_COUNTRY } from "./paises";

export function vbucksToLocal(code, vbucks) {
  const country = COUNTRIES[code] ?? DEFAULT_COUNTRY;
  const rate = country?.rates?.vbucks ?? 0;
  return (Number(vbucks || 0) * rate).toFixed(2);
}