export default function CrewInfo() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 mt-4 text-sm border border-gray-700 shadow-lg">
      {/* Tiempo de Entrega */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
        <span className="text-gray-300 flex items-center gap-2">
          <i className="fas fa-clock text-red-500"></i>
          Tiempo de Entrega
        </span>
        <span className="text-white font-bold">10 minutos</span>
      </div>

      {/* Plataformas */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
        <span className="text-gray-300 flex items-center gap-2">
          <i className="fas fa-gamepad text-red-500"></i>
          Plataforma
        </span>
        <span className="text-white font-semibold">PC, PS, Xbox, Switch</span>
      </div>

      {/* Requisitos */}
      <div>
        <p className="text-gray-300 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle text-red-500"></i>
          Requisitos
        </p>
        <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2">
          <li>Acceso a tu correo y contraseña de EpicGames para realizar el club.</li>
          <li>Debes tener acceso a tu correo (te llegará un código y me lo enviaras).</li>
          <li>Valido para cuentas que no han cambiado su region en EpicGames en 6 meses o cuentas en region Turquia.</li>
        </ul>
      </div>
    </div>
  );
}
