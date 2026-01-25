// src/utils/messages.js

export const msgCart = (items, country, total) => {
  console.log("📢 --- INICIANDO REPORTE DE CARRITO PARA WHATSAPP ---");
  
  const itemsList = items.map((it, i) => {
    // 🔍 AQUÍ ESTÁ LA CÁMARA DE SEGURIDAD
    console.log(`📦 Item ${i + 1}: ${it.itemName}`);
    console.log(`   👉 Tipo crudo (it.type):`, it.type);
    console.log(`   👉 Tipo Display (it.type.displayValue):`, it.type?.displayValue);
    
    // 1. INTENTO DE DETECCIÓN (Copiamos tu lógica actual)
    const typeRaw = it.type?.displayValue || it.type || "";
    
    // TRUCO: Convertimos a texto sí o sí para evitar errores
    let typeStr = "";
    try {
        typeStr = JSON.stringify(typeRaw).toLowerCase();
    } catch(e) {
        console.log("   ❌ Error convirtiendo tipo a texto:", e);
    }
    
    console.log(`   🔍 Texto analizado: "${typeStr}"`);

    const isMusic = typeStr.includes("music") || typeStr.includes("música");
    console.log(`   🎵 ¿Es música?: ${isMusic ? "SÍ" : "NO"}`);
    
    const label = isMusic ? " [Música 🎵]" : "";

    // 2. CANTIDAD
    const qty = it.quantity || 1;
    const qtyDisplay = qty > 1 ? `(x${qty}) ` : "";

    // 3. PRECIO
    const linePrice = (Number(it.localPrice) * qty).toFixed(2);

    return `${i + 1}. ${qtyDisplay}${it.itemName}${label} - ${it.vBucks ? `${it.vBucks} pavos - ` : ""}${country.symbol} ${linePrice}`;
  }).join("\n");

  console.log("✅ Mensaje generado exitosamente");
  console.log("----------------------------------------------------");

  return `¡Hola TioHunter! Quiero finalizar mi compra del carrito:

${itemsList}

*Total a Pagar: ${country.symbol} ${Number(total).toFixed(2)}*

¿Está disponible? ¿Cómo coordinamos?`;
};

// 👇 ESTA NO LA TOCAMOS PORQUE DIJISTE QUE SÍ FUNCIONA
export const msgItem = (name, price, country, type = "", extra = "") => {
  const typeStr = JSON.stringify(type).toLowerCase();
  const isMusic = typeStr.includes("music") || typeStr.includes("música");
  const label = isMusic ? " [Música 🎵]" : "";

  return `¡Hola TioHunter! Me interesa: *${name}${label}*
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
País: ${country.name} ${country.flag}`;
};