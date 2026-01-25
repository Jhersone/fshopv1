// src/utils/messages.js

export const msgCart = (items, country, total) =>
`¡Hola! Estoy interesado en comprar los siguientes productos:

${items.map((it, i) => {
    // 1. DETECCIÓN DE MÚSICA (Lógica Todoterreno)
    // Convertimos el tipo a texto y minúsculas para buscar "music" o "música"
    const typeRaw = it.type?.displayValue || it.type || "";
    const typeStr = JSON.stringify(typeRaw).toLowerCase();
    const isMusic = typeStr.includes("music") || typeStr.includes("música");
    
    const label = isMusic ? " [Música]" : "";

    // 2. DETECCIÓN DE CANTIDAD
    // Si la cantidad es mayor a 1, mostramos (x2), (x3), etc.
    const qty = it.quantity || 1;
    const qtyDisplay = qty > 1 ? `(x${qty}) ` : "";

    // 3. PRECIO TOTAL DE LA LÍNEA
    const linePrice = (Number(it.localPrice) * qty).toFixed(2);

    // ARMAMOS LA LÍNEA FINAL
    // Ejemplo: "1. (x2) Hello Morning [Música 🎵] - 500 pavos - S/ 15.00"
    return `${i + 1}. ${qtyDisplay}${it.itemName}${label} - ${it.vBucks ? `${it.vBucks} pavos - ` : ""}${country.symbol} ${linePrice}`;
}).join("\n")}

Total: ${country.symbol} ${Number(total).toFixed(2)}

¿Está disponible? ¿Cómo coordinamos?`;


// 👇 ESTA ES LA FUNCIÓN INDIVIDUAL (La dejamos igual o mejorada)
export const msgItem = (name, price, country, type = "", extra = "") => {
  
  // Usamos la misma lógica robusta para detectar música
  const typeStr = JSON.stringify(type).toLowerCase();
  const isMusic = typeStr.includes("music") || typeStr.includes("música");
  const label = isMusic ? " [Música]" : "";

  return `¡Hola! Estoy interesado en comprar *${name}${label}*.
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
¿Está disponible?`;
};