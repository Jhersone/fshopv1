// src/utils/messages.js

export const msgCart = (items, country, total) => {
  // Construimos la lista de productos con lógica inteligente
  const itemsList = items.map((it, i) => {
    // 1. DETECCIÓN DE MÚSICA (Lógica Todoterreno)
    // Convertimos el tipo a texto y minúsculas para buscar "music" o "música"
    const typeRaw = it.type?.displayValue || it.type || "";
    const typeStr = JSON.stringify(typeRaw).toLowerCase();
    
    // Si dice "music" es música. Si dice "emote" o "gesto", NO es música.
    const isMusic = typeStr.includes("music") || typeStr.includes("música");
    const label = isMusic ? " [Música 🎵]" : "";

    // 2. DETECCIÓN DE CANTIDAD
    const qty = it.quantity || 1;
    const qtyDisplay = qty > 1 ? `(x${qty}) ` : "";

    // 3. PRECIO TOTAL DE LA LÍNEA
    const linePrice = (Number(it.localPrice) * qty).toFixed(2);

    // Retornamos la línea formateada
    // Ejemplo: "1. (x2) Hello Morning [Música 🎵] - S/ 15.00"
    return `${i + 1}. ${qtyDisplay}${it.itemName}${label} - ${it.vBucks ? `${it.vBucks} pavos - ` : ""}${country.symbol} ${linePrice}`;
  }).join("\n");

  return `¡Hola TioHunter! Quiero finalizar mi compra del carrito:

${itemsList}

*Total a Pagar: ${country.symbol} ${Number(total).toFixed(2)}*

¿Está disponible? ¿Cómo coordinamos?`;
};

// 👇 FUNCIÓN INDIVIDUAL (Para cuando compran 1 solo item directo)
export const msgItem = (name, price, country, type = "", extra = "") => {
  const typeStr = JSON.stringify(type).toLowerCase();
  const isMusic = typeStr.includes("music") || typeStr.includes("música");
  const label = isMusic ? " [Música 🎵]" : "";

  return `¡Hola TioHunter! Me interesa: *${name}${label}*
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
País: ${country.name} ${country.flag}`;
};