// 📂 Archivo: src/utils/shopSorter.js

// 🎛️ TU TABLERO DE CONTROL
// Edita esto para subir o bajar categorías
const PRIORITY_CONFIG = {
  // ⬆️ ALTA PRIORIDAD (Saldrán primero)
  HIGH: [
      "kizunaai",
      "SOUTH PARK",
      "volver al futuro",
      "hatsune miku",
      "bob esponja",   // Bob Esponja
      "kardashian",
      "BLEACH",
      "avatar",
      "marvel",
      "star wars",
      "tortugas",
      "destacado"      // Skins principales
  ],
  // ⬇️ BAJA PRIORIDAD (Saldrán al final)
  LOW: [
      "pistas",             
      "jam tracks",
      "festival",
      "música",
      "autos",
      "lotes de instrumentos"
  ]
};

/**
 * Función que recibe las categorías desordenadas y las devuelve ordenadas
 */
export function sortShopCategories(categories) {
  const sortedKeys = Object.keys(categories).sort((a, b) => {
    const nameA = a.toLowerCase();
    const nameB = b.toLowerCase();

    // Calculamos puntos
    const getScore = (name) => {
        // 1. Buscamos la posición exacta en la lista HIGH
        const indexHigh = PRIORITY_CONFIG.HIGH.findIndex(key => name.includes(key));
        
        // Si está en la lista HIGH...
        if (indexHigh !== -1) {
            // Le damos puntos según su posición. 
            // El puesto 0 (primero) recibe 1000 puntos. El puesto 1 recibe 999.
            return 1000 - indexHigh; 
        }

        // -100 Puntos si está en LOW
        if (PRIORITY_CONFIG.LOW.some(key => name.includes(key))) return -100;
        
        // 0 Puntos si es normal
        return 0;
    };

    const scoreA = getScore(nameA);
    const scoreB = getScore(nameB);

    // Ordenamos de Mayor a Menor puntaje
    return scoreB - scoreA;
  });

  // Reconstruimos el objeto ordenado
  const sortedCategories = {};
  sortedKeys.forEach(key => {
    sortedCategories[key] = categories[key];
  });

  return sortedCategories;
}