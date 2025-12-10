export default function FloatingButtons() {
  return (
    <div 
      className="
        fixed 
        bottom-28      /* MÓVIL: Lo subimos bastante (7rem) para que no tape el botón de comprar */
        md:bottom-5    /* PC: Lo bajamos a su lugar normal */
        right-5 
        flex flex-col gap-3 z-50
      "
    >
      {/* Botón TikTok */}
      <a
        href="https://www.tiktok.com/@tio_hunter1"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <i className="fab fa-tiktok text-2xl"></i>
      </a>
    </div>
  );
}