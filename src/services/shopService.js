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
    let type = entry.brItems?.[0]?.type?.displayValue || "Otros";
    if (type === "Otros" && (entry.tracks?.length ?? 0) > 0) type = "Música";
    if (type === "Zapatos") type = "Calzado";
    if ((entry.cars?.length ?? 0) > 0) type = "Autos";

    const vBucks = entry.finalPrice;
    const category = entry.layout?.name || "Otros";
    const item = { itemName, fallbackImage, rarity, vBucks, type };
    all.push(item);
    (byCategory[category] ??= []).push(item);
  });
  return { all, byCategory };
}
