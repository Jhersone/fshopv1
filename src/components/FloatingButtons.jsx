export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      {/* Botón Messenger */}
      <a
        href="https://www.facebook.com/hunter.shopz" // ✅ Chat directo en Messenger
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <i className="fab fa-facebook-messenger text-2xl"></i>
      </a>

      {/* Botón TikTok */}
      <a
        href="https://www.tiktok.com/@tio_hunter1" // ✅ Tu enlace de TikTok
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <i className="fab fa-tiktok text-2xl"></i>
      </a>
    </div>
  );
}
