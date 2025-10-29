// src/utils/categoryGradients.js

/**
 * Devuelve una clase Tailwind para aplicar el gradiente
 * según el nombre de la categoría detectado desde la API.
 * 
 * Ejemplo: "Pesadilla Descerebrada" → bg-pesadilla
 */

export function getCategoryGradient(category = "") {
  const name = category.toLowerCase();

  // 🎃 Eventos y temáticas
  if (name.includes("pesadilla")) return "bg-pesadilla";
  if (name.includes("halloween")) return "bg-pesadilla";
  if (name.includes("navidad") || name.includes("winter") || name.includes("festiva")) return "bg-navidad";
  if (name.includes("doja cat")) return "bg-doja";
  if (name.includes("sin límite")) return "bg-sinlimite";

  // 🧩 Colaboraciones
  if (name.includes("scooby")) return "bg-scoobydoo";
  if (name.includes("dragon") || name.includes("goku") || name.includes("ball")) return "bg-dragonball";
  if (name.includes("marvel") || name.includes("spider") || name.includes("avenger")) return "bg-marvel";
  if (name.includes("dc") || name.includes("batman") || name.includes("joker")) return "bg-dc";
  if (name.includes("star wars") || name.includes("jedi") || name.includes("vader")) return "bg-starwars";
  if (name.includes("icon") || name.includes("colaboración") || name.includes("creator")) return "bg-iconseries";
  if (name.includes("gaming") || name.includes("legends") || name.includes("halo") || name.includes("kratos")) return "bg-gaminglegends";

  // 🦸 Series o rarezas
  if (name.includes("epic") || name.includes("épico")) return "bg-epic";
  if (name.includes("rare") || name.includes("raro")) return "bg-rare";
  if (name.includes("legendary") || name.includes("legendario")) return "bg-legendary";
  if (name.includes("uncommon") || name.includes("poco común")) return "bg-uncommon";

  // 🎯 Default fallback
  return "bg-default";
}
