import { useEffect, useState } from "react";
// 👇 IMPORTANTE: Asegúrate de que aquí diga 'config' o 'paises' según como se llame tu archivo actual
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/config"; 

export function useCountry(initial = DEFAULT_COUNTRY) {
  
  const [country, setCountry] = useState(() => {
    try {
      const savedCode = localStorage.getItem("user_country_code");
      if (savedCode && COUNTRIES[savedCode]) {
        return COUNTRIES[savedCode];
      }
    } catch (e) {
      console.error(e);
    }
    return initial;
  });

  useEffect(() => {
    if (country?.code) {
      localStorage.setItem("user_country_code", country.code);
    }
  }, [country]);

  // Lógica de detección automática mejorada
  useEffect(() => {
    const savedCode = localStorage.getItem("user_country_code");
    if (savedCode) return; 

    let cancelled = false;
    (async () => {
      try {
        console.log("🔍 Detectando país...");
        
        // 👇 CAMBIO CLAVE: Usamos 'ipwho.is' que es mucho más robusto y no suele bloquearse
        const res = await fetch("https://ipwho.is/"); 
        const data = await res.json();
        
        console.log("📍 País detectado:", data.country_code);

        const found = COUNTRIES[data?.country_code];
        
        if (!cancelled && found) {
          setCountry(found);
          localStorage.setItem("user_country_code", found.code);
        }
      } catch (error) { 
        console.error("❌ Error al detectar país:", error);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return [country, setCountry];
}