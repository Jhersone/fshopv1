import { useEffect, useState } from "react";
// Asegúrate de que esto apunte a 'config' (tu archivo bueno)
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

  // Guardamos la elección
  useEffect(() => {
    if (country?.code) {
      localStorage.setItem("user_country_code", country.code);
    }
  }, [country]);

  // Lógica de detección (MODIFICADA PARA FORZAR IP)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // ❌ BORRÉ EL BLOQUE QUE DECÍA "if (savedCode) return"
      // Ahora revisará la IP siempre.
      
      try {
        console.log("🌍 Buscando ubicación...");
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        
        console.log("📍 IPAPI dice que estás en:", data.country_code);

        // Si la IP dice un país distinto al que tenemos puesto, LO CAMBIAMOS
        const found = COUNTRIES[data?.country_code];
        
        // Obtenemos el actual de la memoria para comparar
        const currentCode = localStorage.getItem("user_country_code");

        if (!cancelled && found && found.code !== currentCode) {
          console.log(`✅ Cambio detectado: ${currentCode} -> ${found.code}`);
          setCountry(found);
          localStorage.setItem("user_country_code", found.code);
        }
      } catch (error) { 
        console.error("❌ Error detectando IP:", error);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return [country, setCountry];
}