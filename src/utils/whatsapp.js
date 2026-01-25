export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP || "51931646873";

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

