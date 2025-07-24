export default function CrewInfo() {
  return (
   <div className="bg-[#0D1F1E] border border-[#00FF7F33] rounded-xl shadow-[0_0_15px_#00FF7F55] max-w-lg w-full mx-auto p-4">

      {/* Tiempo de Entrega */}
      <div className="flex justify-between items-center border-b border-[#00FF7F33] pb-3 mb-3">
        <span className="text-gray-200 flex items-center gap-2">
          <i className="fas fa-clock text-[#00FF7F]"></i>
          Tiempo de Entrega
        </span>
        <span className="text-white font-bold">10 minutos</span>
      </div>

      {/* Plataformas */}
      <div className="flex justify-between items-center border-b border-[#00FF7F33] pb-3 mb-3">
        <span className="text-gray-200 flex items-center gap-2">
          <i className="fas fa-gamepad text-[#00FF7F]"></i>
          Plataforma
        </span>
        <span className="text-white font-semibold">PC, PS, Xbox, Switch</span>
      </div>

      {/* Requisitos */}
      <div>
        <p className="text-gray-200 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle text-[#00FF7F]"></i>
          Requisitos
        </p>
        <ul className="list-disc pl-5 text-gray-300 text-sm space-y-2">
          <li>Acceso a tu correo y contraseña de EpicGames para realizar el club.</li>
          <li>Debes tener acceso a tu correo (te llegará un código y me lo enviaras).</li>
          <li>Válido para cuentas que no han cambiado su región en EpicGames en 6 meses o cuentas en región Turquía.</li>
        </ul>
      </div>
    </div>
  );
}
