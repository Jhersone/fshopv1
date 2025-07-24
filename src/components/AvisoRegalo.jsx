import { useState } from "react";

export default function AvisoRegalo() {
  const [open, setOpen] = useState(false);

  const ids = [
    "TIOHUNTER1",
    "TIOHUNTER2",
    "TIOHUNTER3",
    "TIOHUNTER4",
    "TIOHUNTER5",
    "TIOHUNTER6",
    "TIOHUNTER8",
    "TIOHUNTER9",
    "TIOHUNTER10",
    "TIOHUNTER13",
  ];

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(ids.join(", "));
    const toast = document.createElement("div");
    toast.textContent = "✅ ¡Todos los IDs copiados!";
    toast.className =
      "fixed bottom-5 right-5 bg-[#45f983] text-black px-4 py-2 rounded shadow-md font-semibold animate-fadeIn";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  return (
    <>
      {/* Aviso ajustado */}
      <div className="bg-[#192028] text-white text-sm p-4 rounded-xl shadow-md text-center w-full max-w-xl mx-auto mt-2 mb-0">
        <p className="block font-semibold text-base mb-3">
          Agrega todas mis ID para enviarte regalos
        </p>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#45f983] hover:bg-[#36e673] text-black font-semibold px-4 py-2 rounded w-full transition"
        >
          Ver IDs
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#192028] text-white rounded-lg p-6 w-[90%] max-w-md shadow-xl animate-fadeIn">
            <h2 className="text-lg font-bold mb-4 text-center">
              Nuestros IDs de Fortnite
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {ids.map((id, index) => (
                <div
                  key={index}
                  className="bg-[#22303C] px-3 py-2 rounded text-center font-mono text-sm font-semibold border border-[#2C3A47]"
                >
                  {id}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={copyAllToClipboard}
                className="bg-[#45f983] hover:bg-[#36e673] text-black py-2 rounded text-sm font-semibold transition"
              >
                Copiar todos los IDs
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-[#2C3A47] hover:bg-[#374151] py-2 rounded text-sm text-white transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
