// src/utils/messages.js

export const msgCart = (items, country, total) => {
  const itemsList = items.map((it, i) => {
    // 1. Detección de Música
    const typeRaw = it.type?.displayValue || it.type || "";
    const typeStr = JSON.stringify(typeRaw).toLowerCase();
    const isMusic = typeStr.includes("music") || typeStr.includes("música");
    const label = isMusic ? " [Música 🎵]" : "";

    // 2. Cantidad
    const qty = it.quantity || 1;
    const qtyDisplay = qty > 1 ? `(x${qty}) ` : "";

    // 3. 🛡️ CORRECCIÓN DEL PRECIO
    const unitPrice = Number(it.localPrice || it.price || 0); 
    const linePrice = (unitPrice * qty).toFixed(2);

    return `${i + 1}. ${qtyDisplay}${it.itemName}${label} - ${country.symbol} ${linePrice}`;
  }).join("\n");

  // 👇 AQUÍ SE QUITÓ LA FRASE FINAL
  return `¡Hola TioHunter! Quiero finalizar mi compra del carrito:

${itemsList}

*Total a Pagar: ${country.symbol} ${Number(total).toFixed(2)}*
País: ${country.name} ${country.flag}`;
};

// La función msgItem se queda igual
export const msgItem = (name, price, country, type = "", extra = "") => {
  const typeStr = JSON.stringify(type).toLowerCase();
  const isMusic = typeStr.includes("music") || typeStr.includes("música");
  const label = isMusic ? " [Música 🎵]" : "";

  return `¡Hola TioHunter! Me interesa: *${name}${label}*
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
País: ${country.name} ${country.flag}`;
};