import { useEffect, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/config";

export function useCountry(initial = DEFAULT_COUNTRY) {
  
  // 1. INICIALIZACIÓN: Leemos el CÓDIGO guardado, pero cargamos el objeto NUEVO
  const [country, setCountry] = useState(() => {
    try {
      // Buscamos si hay un código guardado (ej: "BO")
      const savedCode = localStorage.getItem("user_country_code");
      
      // Si existe y está en nuestra lista actualizada, usamos esa info FRESCA
      if (savedCode && COUNTRIES[savedCode]) {
        return COUNTRIES[savedCode];
      }
    } catch (e) {
      console.error(e);
    }
    // Si no hay nada guardado, usamos el default
    return initial;
  });

  // 2. EFECTO: Cada vez que cambiamos de país, guardamos solo su CÓDIGO
  useEffect(() => {
    if (country?.code) {
      localStorage.setItem("user_country_code", country.code);
    }
  }, [country]);

  // 3. EFECTO: Detección por IP (Solo corre si NO hay un país guardado previamente)
  useEffect(() => {
    const savedCode = localStorage.getItem("user_country_code");
    if (savedCode) return; // Si el usuario ya tiene país, no lo molestamos

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        // Buscamos en la lista ACTUALIZADA
        const found = COUNTRIES[data?.country_code];
        
        if (!cancelled && found) {
          setCountry(found);
          // Opcional: Guardarlo automáticamente
          localStorage.setItem("user_country_code", found.code);
        }
      } catch { /* noop */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return [country, setCountry];
}