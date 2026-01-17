// src/utils/categoryGradients.js

/**
 * Devuelve una clase Tailwind para aplicar el gradiente
 * según el nombre de la categoría detectado desde la API.
 * 
 * Ejemplo: "Pesadilla Descerebrada" → bg-pesadilla
 */

// src/utils/categoryGradients.js

export function getCategoryGradient(category = "") {
  // Convertimos a minúsculas para evitar errores
  const name = category.toLowerCase();

  // 🧽 SERIE NICKELODEON (Bob Esponja, Avatar, Tortugas Ninja)
  if (name.includes("bob esponja") || name.includes("spongebob") || name.includes("patricio") || name.includes("patrick")) return "bg-spongebob";
  if (name.includes("nickelodeon") || name.includes("tortugas") || name.includes("tmnt")) return "bg-navidad"; // Verde para tortugas
  if (name.includes("avatar")) return "bg-harrypoter"; // Azul místico para Avatar
  if (name.includes("kizunaai")) return "bg-kizunaai"; // Azul místico para Avatar
  if (name.includes("south park")) return "bg-southpark"; // Azul místico para Avatar
  if (name.includes("hora de aventura")) return "bg-horadeaventura"; // Azul místico para Avatar

  // 🎃 Eventos y temáticas
  if (name.includes("invierno")) return "bg-harrypoter";
  if (name.includes("miku")) return "bg-harrypoter";
 
  // 🎵 Música / Icon Series
  if (name.includes("doja cat")) return "bg-doja";
  if (name.includes("sin límite") || name.includes("the weeknd") || name.includes("lady gaga")) return "bg-sinlimite";
  if (name.includes("k-pop") || name.includes("bts")) return "bg-kpop";
  if (name.includes("playboi") || name.includes("carti")) return "bg-playboicarti";
  if (name.includes("daft punk")) return "bg-daftpunk";
  if (name.includes("eminem") || name.includes("icon") || name.includes("ídolos") || name.includes("colaboración")) return "bg-playboicarti"; // Naranja/Amarillo genérico para ídolos

  // 📺 Series Animadas / TV
  if (name.includes("simpson") || name.includes("futurama") || name.includes("family guy") || name.includes("padre de familia")) return "bg-simpson";
  if (name.includes("titanes") || name.includes("raven")) return "bg-simpson"; // Morado
  if (name.includes("rick") || name.includes("morty")) return "bg-navidad"; // Verde tóxico

  // 🧙‍♂️ Fantasía / Magia
  if (name.includes("hogwarts") || name.includes("harry") || name.includes("potter")) return "bg-harrypoter";
  
  // 🧩 Colaboraciones
  if (name.includes("scooby")) return "bg-scoobydoo";
  if (name.includes("dragon") || name.includes("goku") || name.includes("vegeta")) return "bg-dragonball";
  if (name.includes("marvel") || name.includes("spider") || name.includes("avenger") || name.includes("deadpool")) return "bg-marvel";
  if (name.includes("dc") || name.includes("batman") || name.includes("joker") || name.includes("superman")) return "bg-dc";
  if (name.includes("star wars") || name.includes("jedi") || name.includes("sith") || name.includes("vader")) return "bg-fortnite-rare"; // Usamos uno azul espacial

  // 🎮 Gaming Legends
  if (name.includes("gaming") || name.includes("leyendas") || name.includes("halo") || name.includes("kratos") || name.includes("resident")) return "bg-fortnite-rare";

  // 💎 Rarezas Estándar (Fallback)
  if (name.includes("épico") || name.includes("epic")) return "bg-daftpunk"; // Morado
  if (name.includes("legendario") || name.includes("legendary")) return "bg-playboicarti"; // Dorado/Naranja
  if (name.includes("raro") || name.includes("rare")) return "bg-harrypoter"; // Azul
  if (name.includes("poco común") || name.includes("uncommon")) return "bg-navidad"; // Verde

  // Si no encuentra nada, devuelve undefined (o puedes poner una clase por defecto)
  return ""; 
}