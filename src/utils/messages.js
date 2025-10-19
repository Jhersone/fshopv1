export const msgCart = (items, country, total) =>
`¡Hola! Estoy interesado en comprar los siguientes productos:

${items.map((it,i)=> `${i+1}. ${it.itemName} - ${it.vBucks ?? ""} ${it.vBucks ? "pavos - " : ""}${country.symbol} ${it.localPrice}`).join("\n")}

Total: ${country.symbol} ${Number(total).toFixed(2)}

¿Está disponible? ¿Cómo coordinamos?`;

export const msgItem = (name, price, country, extra = "") =>
`¡Hola! Estoy interesado en comprar *${name}*.
Precio: ${country.symbol} ${Number(price).toFixed(2)}
${extra ? `\n${extra}\n` : ""}
¿Está disponible?`;
