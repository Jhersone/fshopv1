export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 animate-fade-in">
      {/* WhatsApp */}
      <a
        href="https://wa.me/51931646873"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-green-500 hover:bg-green-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-2xl"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded shadow-md transition-opacity duration-300">
          WhatsApp
        </span>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/tuusuario" // 🔴 Cambia por tu enlace de Messenger
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-2xl"
      >
        <i className="fab fa-facebook-messenger text-2xl"></i>
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded shadow-md transition-opacity duration-300">
          Messenger
        </span>
      </a>
    </div>
  );
}
