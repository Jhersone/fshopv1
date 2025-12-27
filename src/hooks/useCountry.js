import { useEffect, useState } from "react";
// 👇 IMPORTANTE: Asegúrate de que apunte a 'config' (tu archivo actual)
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/config"; 

export function useCountry(initial = DEFAULT_COUNTRY) {
  
  const [country, setCountry] = useState(() => {
    try {
      const savedCode = localStorage.getItem("user_country_code");
      // Si hay algo guardado, lo usamos de inicio para que no parpadee
      if (savedCode && COUNTRIES[savedCode]) {
        return COUNTRIES[savedCode];
      }
    } catch (e) {
      console.error(e);
    }
    return initial;
  });

  // Guardamos la elección manual del usuario
  useEffect(() => {
    if (country?.code) {
      localStorage.setItem("user_country_code", country.code);
    }
  }, [country]);

  // Lógica de detección automática
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 👇 TRUCO: Verificamos si es la PRIMERA VEZ en esta sesión para forzar la IP
      // o si no hay nada guardado.
      const savedCode = localStorage.getItem("user_country_code");
      
      // Si quieres probar la VPN, comenta esta línea de abajo temporalmente:
      if (savedCode) {
          console.log("💾 País cargado de memoria:", savedCode);
          return; 
      }

      try {
        console.log("🌍 Iniciando detección por IPAPI...");
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        
        console.log("📍 IPAPI detectó:", data.country_code);

        const found = COUNTRIES[data?.country_code];
        
        if (!cancelled && found) {
          // Si detectamos un país diferente al que tenemos, lo actualizamos
          console.log("✅ Actualizando país a:", found.name);
          setCountry(found);
          localStorage.setItem("user_country_code", found.code);
        } else if (!found) {
            console.warn("⚠️ El país detectado no está en tu lista de tiendas:", data.country_code);
        }
      } catch (error) { 
        console.error("❌ Error en detección de IP:", error);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return [country, setCountry];
}