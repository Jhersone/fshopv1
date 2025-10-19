import { useEffect, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/currency";

export function useCountry(initial = DEFAULT_COUNTRY) {
  const [country, setCountry] = useState(initial);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const found = COUNTRIES[data?.country_code];
        if (!cancelled && found) setCountry(found);
      } catch { /* noop */ }
    })();
    return () => { cancelled = true; };
  }, []);
  return [country, setCountry];
}
