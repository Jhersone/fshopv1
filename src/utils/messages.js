// src/utils/messages.js

export const msgCart = (items, country, total) =>
`¡Hola! Estoy interesado en comprar los siguientes productos:

${items.map((it,i)=> `${i+1}. ${it.itemName} - ${it.vBucks ?? ""} ${it.vBucks ? "pavos - " : ""}${country.symbol} ${it.localPrice}`).join("\n")}

Total: ${country.symbol} ${Number(total).toFixed(2)}

¿Está disponible? ¿Cómo coordinamos?`;

// 👇 HE MODIFICADO ESTA FUNCIÓN
// Ahora recibe "type" como cuarto parámetro
export const msgItem = (name, price, country, type = "", extra = "") => {
  
  // Condición: ¿Es música? (Revisamos en inglés "Music" y español "Música")
  // Si NO es música, la etiqueta se queda vacía ("").
  const isMusic = type === "Music" || type === "Música";
  const label = isMusic ? " [Música 🎵]" : "";

  return `¡Hola! Estoy interesado en comprar *${name}${label}*.
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
¿Está disponible?`;
};