import { useEffect, useState } from "react";

export function VideoModal({ country }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Si el país es Bolivia (BO) o Ecuador (EC)
    // 2. Y el usuario NO ha cerrado el video antes en esta sesión
    const hasSeen = sessionStorage.getItem("seen_usdt_tutorial");
    
    // 👇 CAMBIO PEQUEÑO: Agregué Ecuador (EC) por si acaso, ya que también usa USDT
    if ((country?.code === "BO" || country?.code === "EC") && !hasSeen) {
      setIsOpen(true);
    }
  }, [country]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("seen_usdt_tutorial", "true");
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Botón de cerrar (X) - Ahora es blanco */}
        <button onClick={handleClose} style={closeButtonStyle}>
          ✖
        </button>

        {/* Título - Ahora es texto claro */}
        <h3 style={{ color: "#F3F4F6", marginBottom: "10px", fontSize: "1.25rem" }}>
          🇧🇴 ¿Cómo pagar con QR USDT?
        </h3>
        
        {/* Texto descriptivo - Ahora es gris claro */}
        <p style={{ color: "#D1D5DB", fontSize: "14px", marginBottom: "15px" }}>
          Mira este video rápido para aprender a transferir sin comisiones.
        </p>

        {/* Video de YouTube */}
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "8px", overflow: "hidden", border: "1px solid #374151" }}>
          <iframe
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            // 👇 ¡RECUERDA PONER TU ID DE VIDEO AQUÍ! 👇
            src="https://www.youtube.com/embed/9uOac4zYvbk" 
            title="Tutorial USDT"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <button 
            onClick={handleClose}
            style={actionButtonStyle}
        >
            ¡Entendido, quiero comprar!
        </button>
      </div>
    </div>
  );
}

// --- Estilos OSCUROS actualizados ---
const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.85)", // Un poco más oscuro el fondo
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 9999,
  padding: "20px",
  backdropFilter: "blur(3px)" // Un ligero efecto borroso elegante
};

const modalStyle = {
  // 👇 CAMBIO CLAVE: Fondo oscuro azulado (similar al header)
  backgroundColor: "#171c25ff", 
  border: "1px solid #374151", // Borde sutil para definirlo
  padding: "25px",
  borderRadius: "16px", // Bordes más redondeados
  maxWidth: "500px",
  width: "100%",
  position: "relative",
  boxShadow: "0 10px 25px rgba(0,0,0,0.6)", // Sombra más profunda
  textAlign: "center"
};

const closeButtonStyle = {
  position: "absolute", top: "15px", right: "20px",
  background: "none", border: "none", fontSize: "22px", cursor: "pointer", 
  color: "#9CA3AF", // Color gris claro para la X
  transition: "color 0.2s"
};

const actionButtonStyle = {
    marginTop: "20px",
    backgroundColor: "#FFD700", // Amarillo Fortnite
    color: "#000", // Texto negro para contraste
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "800", // Letra más gruesa
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px #B8860B", // Efecto 3D pequeño en el botón
    transition: "all 0.1s",
};