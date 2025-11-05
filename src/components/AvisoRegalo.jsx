// src/components/AvisoRegalo.jsx

function MobileBleed({ children, className = "" }) {
  return (
    <div className={["-mx-4 sm:-mx-6 md:-mx-8 lg:mx-0", className].join(" ")}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-0">{children}</div>
    </div>
  );
}

export default function AvisoRegalo() {
  return (
    <MobileBleed className="mt-3 sm:mt-4 md:mt-6">  {/* 👈 margen superior agregado */}
      <div
        className="
          overflow-hidden bg-[#0f161b]
          rounded-none md:rounded-2xl
          border-0 md:border md:border-[#2C3A47]
          max-w-[990px] mx-auto
        "
      >
        <img
          src="/img/regalosb.png"
          alt="Banner Amigos"
          className="
            w-full 
            h-[75px] sm:h-[160px] md:h-[150px]
            object-cover
          "
          loading="lazy"
          decoding="async"
        />
      </div>
    </MobileBleed>
  );
}
