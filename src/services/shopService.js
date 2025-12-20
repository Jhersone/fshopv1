const KEY = "fortniteShopData";
const TTL = 5 * 60 * 1000; // 5 min

export async function getShop(language = "es-419") {
  const now = Date.now();
  const cached = localStorage.getItem(KEY);
  if (cached) {
    const { ts, all, byCategory } = JSON.parse(cached);
    if (now - ts < TTL) return { all, byCategory };
  }

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`https://fortnite-api.com/v2/shop?language=${language}`, { signal: ctrl.signal });
    const json = await res.json();
    const parsed = parseShop(json?.data);
    localStorage.setItem(KEY, JSON.stringify({ ts: now, ...parsed }));
    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

function parseShop(data) {
  const all = [];
  const byCategory = {};
  
  // Para ver todos los tipos únicos en texto plano (sin desplegar array)
  const tiposUnicos = new Set();

  (data?.entries ?? []).forEach((entry) => {
    const fallbackImage = entry.bundle?.image
      || entry.displayAsset?.image
      || entry.albumArt
      || entry.brItems?.[0]?.images?.icon
      || entry.tracks?.[0]?.albumArt
      || "";
    if (!fallbackImage) return;

    const itemName = entry.bundle?.name
      || entry.brItems?.[0]?.name
      || entry.tracks?.[0]?.title
      || "SIN NOMBRE";

    const rarity = entry.brItems?.[0]?.rarity?.displayValue || "Común";
    
    // --- 🕵️‍♂️ ZONA DE DETECCIÓN ---
    // Obtenemos el tipo "crudo" que viene de la API
    let rawType = entry.brItems?.[0]?.type?.displayValue || "Otros";
    const rawTypeBackend = entry.brItems?.[0]?.type?.backendValue || ""; // Valor interno en inglés
    const tags = entry.brItems?.[0]?.gameplayTags || []; // Etiquetas internas

    // Guardamos el tipo para verlo en consola
    tiposUnicos.add(rawType);

    // 🚨 ESPÍA DE BOB ESPONJA Y MASCOTAS 🚨
    // Si el item se llama Bob Esponja, o es la Mochila Gary, imprimimos sus datos
    if (itemName.toLowerCase().includes("bob") || itemName.toLowerCase().includes("gary") || rawType === "Mascota") {
        console.warn(`🚨 INSPECCIONANDO: ${itemName}`);
        console.warn(`   - Tipo Visual (displayValue): "${rawType}"`);
        console.warn(`   - Tipo Interno (backendValue): "${rawTypeBackend}"`);
        console.warn(`   - Tags:`, tags);
    }
    // -----------------------------

    let type = rawType;

    // Normalizaciones existentes
    if (type === "Otros" && (entry.tracks?.length ?? 0) > 0) type = "Música";
    if (type === "Zapatos") type = "Calzado";
    if ((entry.cars?.length ?? 0) > 0) type = "Autos";

    // INTENTO DE FILTRO DE MASCOTAS (Ajustaremos esto cuando veamos la consola)
    // Buscamos si es "Mochilero" (Back Bling) Y tiene tag de mascota
    const isPet = tags.some(t => t.toLowerCase().includes("pet") || t.toLowerCase().includes("carrier"));
    
    if (type === "Mochilero" && isPet) {
        type = "Mascotas";
    }
    // Si la API explícitamente dice "Mascota"
    if (type === "Mascota") {
        type = "Mascotas";
    }

    const vBucks = entry.finalPrice;
    const category = entry.layout?.name || "Otros";
    const item = { itemName, fallbackImage, rarity, vBucks, type };
    all.push(item);
    (byCategory[category] ??= []).push(item);
  });

  // Imprimimos la lista de tipos como TEXTO para leerla fácil
  console.log("📋 TIPOS DE HOY:", Array.from(tiposUnicos).join(" | "));

  return { all, byCategory };
}