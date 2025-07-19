export default function NavBar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-[#0D1321] flex justify-center gap-8 py-3 border-b-2 border-yellow-400">
      <button
        className={`nav-tab flex items-center gap-2 px-4 py-2 font-bold ${
          activeTab === "regalo" ? "text-yellow-400 border-b-4 border-yellow-400" : "text-white"
        }`}
        onClick={() => setActiveTab("regalo")}
      >
        <img src="/img/regalo-icon.png" alt="Regalo" className="w-6 h-6" />
        REGALO
      </button>
      <button
        className={`nav-tab flex items-center gap-2 px-4 py-2 font-bold ${
          activeTab === "pavos" ? "text-yellow-400 border-b-4 border-yellow-400" : "text-white"
        }`}
        onClick={() => setActiveTab("pavos")}
      >
        <img src="/img/vbucks-icon.png" alt="Pavos" className="w-6 h-6" />
        PAVOS
      </button>
    </nav>
  );
}
