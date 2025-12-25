// src/components/VBucksShop.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { openWhatsApp } from "../utils/whatsapp";
import StickyCTA_vbuck from "./StickyCTA_vbuck";

// ==== 1. MobileBleed ESTÁNDAR ====
function MobileBleed({ children, className = "" }) {
  return (
    <div className={["-mx-9 sm:-mx-4 md:-mx-14 lg:mx-0", className].join(" ")}>
      <div className="px-3 sm:px-4 md:px-6 lg:px-0">{children}</div>
    </div>
  );
}

// ==== 2. HeroBleed (PARA LA IMAGEN) ====
function HeroBleed({ children, className = "" }) {
  return (
    <div className={["-mx-9 sm:-mx-4 md:-mx-14 lg:mx-0", className].join(" ")}>
      <div className="w-full">{children}</div>
    </div>
  );
}

/* ==================== PLATAFORMAS ==================== */
const PLATFORMS = [
  { id: "epic",     img: "/img/platforms/epic.webp",        alt: "Epic Games" },
  { id: "ps",       img: "/img/platforms/playstation.webp",  alt: "PlayStation" },
  { id: "xbox",     img: "/img/platforms/xbox.webp",         alt: "Xbox" },
  { id: "nintendo", img: "/img/platforms/nintendo.webp",     alt: "Nintendo" },
  { id: "steam",    img: "/img/platforms/steam.webp",        alt: "Steam" },
  { id: "google",   img: "/img/platforms/google.webp",       alt: "Google" },
  { id: "apple",    img: "/img/platforms/apple.webp",        alt: "Apple" },
  { id: "facebook", img: "/img/platforms/facebook.webp",     alt: "Facebook" },
  { id: "lego",     img: "/img/platforms/lego.webp",         alt: "LEGO" },
];

/* ==================== MÉTODOS DE PAGO ==================== */
const PAYMENTS_BY_COUNTRY = {
  PE: [
    { id: "yape",        name: "YAPE",          note: "Sin comisión", logo: "/img/payments/yape.webp" },
    { id: "plin",        name: "PLIN",          note: "Sin comisión", logo: "/img/payments/plin.png" },
    { id: "transf_pe",   name: "TRANSFER",      note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "deposito_pe", name: "DEPÓSITO",      note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "paypal_pe",   name: "PAYPAL",        note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  MX: [
    { id: "oxxo",      name: "OXXO",     note: "Sin comisión", logo: "/img/payments/oxxo.png" },
    { id: "spei",      name: "TRANSFER", note: "Sin comisión", logo: "/img/payments/spei.png" },
    { id: "paypal_mx", name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  BO: [
    // Bolivia ahora usa Dólares (QR y Binance)
    
    { id: "binance", name: "BINANCE",     note: "Sin comisión", logo: "/img/payments/binance.webp" },
  ],
  US: [
      { id: "binance",  name: "BINANCE",  note: "Sin comisión", logo: "/img/payments/binance.png" },
   // { id: "coinbase_us", name: "COINBASE", note: "Sin comisión", logo: "/img/payments/coinbase.webp" },
    { id: "meru_us",     name: "MERU",     note: "Con comisión", logo: "/img/payments/meru.webp" },
   // { id: "binance",  name: "BINANCE",  note: "Sin comisión", logo: "/img/payments/binance.png" },
    //{ id: "card_us",     name: "TARJETA",  note: "Con comisión", logo: "/img/payments/card.webp" },
    { id: "paypal_us",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  GLOBAL: [
    //{ id: "coinbase", name: "COINBASE", note: "Sin comisión", logo: "/img/payments/coinbase.webp" },
    { id: "meru",     name: "MERU",     note: "Con comisión", logo: "/img/payments/meru.webp" },
    { id: "card",     name: "TARJETA",  note: "Con comisión", logo: "/img/payments/card.webp" },
    { id: "paypal",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
    { id: "binance",  name: "BINANCE",  note: "Sin comisión", logo: "/img/payments/binance.webp" },
  ],

    CL: [
    { id: "global66",  name: "GLOBAL66",  note: "Sin comisión", logo: "/img/payments/global66.webp" },
    { id: "paypal",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
};

const getVisiblePayments = (code) =>
  PAYMENTS_BY_COUNTRY[code] ?? PAYMENTS_BY_COUNTRY.GLOBAL;

/* ==================== PRECIOS ==================== */
const VBUCKS_RATE = {
  PE: { per1000: 20,  symbol: "S/" },
  MX: { per1000: 110, symbol: "$"  },
  BO: { per1000: 7.0, symbol: "US$" }, // Bolivia en Dólares
  US: { per1000: 7.0, symbol: "$"  },
  CL: { per1000: 6000, symbol: "$" }, // Chile (Ejemplo)
  CO: { per1000: 25000, symbol: "$" }, // Colombia (Ejemplo)
  GLOBAL: { per1000: 20, symbol: "S/" },
};

const VBUCKS_PRICE_TABLE = {
  PE: { 1000: 22,   2800: 54,    5000: 85,   13500: 200 },
  MX: { 1000: 121,  2800: 297,   5000: 468,  13500: 1100 },
  BO: { 1000: 6.63, 2800: 16.30, 5000: 25.6, 13500: 60.30 }, // Bolivia = Precios US
  US: { 1000: 6.63, 2800: 16.30, 5000: 25.6, 13500: 60.30 },
  CL: { 1000: 6550, 2800: 16300, 5000: 25100, 13500: 57900 }, // Precios Chile (Ejemplo)
  CO: { 1000: 28000, 2800: 65000, 5000: 110000, 13500: 250000 }, // Precios Colombia (Ejemplo)
  GLOBAL: {}
};

const VBucksPrice = (code, amount) => {
  const table = VBUCKS_PRICE_TABLE[code] ?? VBUCKS_PRICE_TABLE.GLOBAL ?? {};
  if (table[amount] != null) return table[amount];
  const per1000 = VBUCKS_RATE[code]?.per1000 ?? VBUCKS_RATE.GLOBAL.per1000;
  return (amount / 1000) * per1000;
};

const VBUCKS_OPTIONS = [1000, 2800, 5000, 13500];

/* ============ OFERTAS ESPECIALES ============ */
const OFFERS = [
  {
    id: "pack1",
    title: "Surfeo Shaka",
    img: "/img/pavos/paquete-surf.webp",
    // Recuerda editar estos precios de CL y CO con tus valores reales
    price: { PE: 13, MX: 72, BO: 3.92, US: 3.92, CL: 3700, CO: 15000, GLOBAL: 95 },
  },
  {
    id: "pack2",
    title: "Leyendas Polares",
    img: "/img/pavos/paquete-polares.jpg",
    price: { PE: 51, MX: 280, BO: 15.37, US: 15.37, CL: 15500, CO: 60000, GLOBAL: 55 },
  },
  {
    id: "pack3",
    title: "Elite Dorada",
     img: "/img/pavos/paquete-dorado.webp",
    price: { PE: 40, MX: 220, BO: 12.1, US: 12.1, CL: 12300, CO: 50000, GLOBAL: 55 },
  },
   {
    id: "pack4",
    title: "Leyendas congeladas",
     img: "/img/pavos/paquete-congeladas.webp",
    price: { PE: 41, MX: 226, BO: 12.35, US: 12.35, CL: 12600, CO: 52000, GLOBAL: 55 },
  },
   {
    id: "pack5",
    title: "Renegados Agencia",
     img: "/img/pavos/paquete-agencia.webp",
    price: { PE: 48, MX: 264, BO: 14.5, US: 14.5, CL: 14650, CO: 58000, GLOBAL: 55 },
  },
  {
    id: "pack6",
    title: "Clip Completo",
     img: "/img/pavos/paquete-clip.webp",
    price: { PE: 43, MX: 237, BO: 13.0, US: 13.0, CL: 13200, CO: 55000, GLOBAL: 55 },
  },
];

const offerPrice = (code, id) => {
  const of = OFFERS.find((o) => o.id === id);
  if (!of) return null;
  return of.price[code] ?? of.price.GLOBAL ?? null;
};

export default function VBucksShop({ selectedCountry }) {
  const code   = selectedCountry?.code ?? "PE";
  const symbol = selectedCountry?.symbol ?? (VBUCKS_RATE[code]?.symbol || "S/");

  // Estado
  const [platform, setPlatform] = useState("nintendo");
  const [amount, setAmount]     = useState(VBUCKS_OPTIONS[0]);
  const [payment, setPayment]   = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const endRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  const visiblePayments = useMemo(() => getVisiblePayments(code), [code]);

  useEffect(() => {
    if (!visiblePayments.some(pm => pm.id === payment)) {
      setPayment(visiblePayments[0]?.id || "");
    }
  }, [visiblePayments]);

  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -90px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const computedTotal = selectedOfferId
    ? offerPrice(code, selectedOfferId)
    : VBucksPrice(code, amount);

  const totalText =
    (code === "US" || code === "BO") // BO ahora usa formato de dólar
      ? `${symbol}${(computedTotal ?? 0).toFixed(2)}`
      : `${symbol} ${
          Number.isInteger(computedTotal)
            ? (computedTotal ?? 0).toFixed(0)
            : (computedTotal ?? 0).toFixed(2)
        }`;

  const summaryLabel = selectedOfferId
    ? (OFFERS.find(o => o.id === selectedOfferId)?.title ?? "")
    : `${amount.toLocaleString()} V-Bucks`;

  const selectedPlatform = useMemo(
    () => PLATFORMS.find(p => p.id === platform),
    [platform]
  );

  const handleBuy = () => {
    const pm = visiblePayments.find(p => p.id === payment);
    const msg = `¡Hola! Quiero comprar *${summaryLabel}*.
País: ${code}
Plataforma: ${selectedPlatform?.alt || selectedPlatform?.id}
Método de pago: ${pm?.name || "-"} (${pm?.note || ""})
Total: ${totalText}
¿Disponible?`;
    openWhatsApp(msg);
  };

  const Badge = ({ n }) => (
    <div
      className="w-8 h-8 bg-[#FFFB00] text-black font-bold text-[18px] grid place-items-center"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
        borderRadius: "4px",
      }}
    >
      {n}
    </div>
  );

  return (
    <>
      <section 
        className="
          w-full 
          md:max-w-[990px] md:mx-auto 
          space-y-6 sm:space-y-7 
          px-3 sm:px-4 md:px-6 
          mt-0
        "
      >
        {/* HERO */}
        <MobileBleed>
          <div
            className="
              overflow-hidden bg-[#0f161b]
              rounded-none md:rounded-2xl
              border-0 md:border md:border-[#2C3A47]
            "
          >
            <img
              src="/img/banerpav.webp" 
              alt="Fortnite Crew"
              className="w-full h-[75px] sm:h-[160px] md:h-[150px] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </MobileBleed>

        {/* PASO 1: Requisitos */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge n={1} />
              <h2 className="text-xl font-bold">Requisitos para Activación</h2>
            </div>

            <div className="rounded-2xl bg-[#191F26] border border-[#2C3A47] p-4 md:p-5">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-[#FFFB00]" />
                  <p className="text-base text-white">Correo electrónico y contraseña</p>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-[#FFFB00]" />
                  <p className="text-base text-white">
                    Debes tener acceso a tu correo electrónico
                    <span className="block text-sm text-gray-400">
                      (te llegará un código de verificación)
                    </span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-[#FFFB00]" />
                  <p className="text-base text-white">Tiempo aproximado: 15 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </MobileBleed>

        {/* PASO 2: Plataformas */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Badge n={2} />
              <h2 className="text-xl font-bold">¿Por dónde ingresas?</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {PLATFORMS.map((p) => {
                const active = platform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    aria-pressed={active}
                    style={{ overflow: "visible" }}
                    className={`relative rounded-xl transition border-2 ${
                      active
                        ? "border-[#FFFB00] shadow-[0_0_16px_rgba(255,251,0,.35)]"
                        : "border-[#2C3A47] hover:border-[#FFFB00]"
                    }`}
                  >
                    <div className="h-[75px] sm:h-24 rounded-xl bg-[#192028] grid place-items-center">
                      <img
                        src={p.img}
                        alt={p.alt || p.id}
                        className="max-w-[70%] max-h-[70%] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {active && (
                      <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-[#FFFB00] text-black grid place-items-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </MobileBleed>

        {/* PASO 3: Cantidad + Ofertas */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Badge n={3} />
              <h2 className="text-xl font-bold">Elige la cantidad</h2>
            </div>

            {/* Grid Cantidades */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {VBUCKS_OPTIONS.map((v) => {
                const active = !selectedOfferId && amount === v;
                return (
                  <button
                    key={v}
                    onClick={() => {
                      setAmount(v);
                      setSelectedOfferId(null);
                    }}
                    aria-pressed={active}
                    style={{ overflow: "visible" }}
                    className={`relative rounded-xl transition border-2 px-1 py-3 sm:px-4 sm:py-5 bg-[#191F26] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                      active
                        ? "border-[#FFFB00] shadow-[0_0_16px_rgba(255,251,0,.35)]"
                        : "border-[#2C3A47] hover:border-[#FFFB00]"
                    }`}
                  >
                    <img src="/img/pavos/vbu.png" alt="V-Bucks" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                    <span className="font-semibold text-[15px] sm:text-[18px]">{v.toLocaleString()}</span>

                    {active && (
                      <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-[#FFFB00] text-black grid place-items-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ofertas especiales */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-bold text-white">Ofertas especiales</span>
                <div className="flex-1 border-t border-[#2C3A47]" />
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {OFFERS.map((of) => {
                  const active = selectedOfferId === of.id;
                  return (
                    <button
                      key={of.id}
                      onClick={() =>
                        setSelectedOfferId((prev) => (prev === of.id ? null : of.id))
                      }
                      aria-pressed={active}
                      className={`relative rounded-xl border-2 bg-[#191F26] transition flex flex-col items-center justify-center p-2 h-[150px] sm:h-[180px]
                        ${
                          active
                            ? "border-[#FFFB00] shadow-[0_0_16px_rgba(255,251,0,.35)]"
                            : "border-[#2C3A47] hover:border-[#FFFB00]"
                        }`}
                    >
                      <img
                        src={of.img}
                        alt={of.title}
                        className="w-auto h-[120px] sm:h-[160px] object-contain mb-2" 
                      />
                      
                      {active && (
                        <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-[#FFFB00] text-black grid place-items-center">
                          <i className="fa-solid fa-check text-sm" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </MobileBleed> 

        {/* PASO 4: Métodos de pago */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Badge n={4} />
              <h2 className="text-xl font-bold">Método de Pago</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {visiblePayments.map((pm) => {
                const active = payment === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPayment(pm.id)}
                    aria-pressed={active}
                    className={[
                      "relative rounded-2xl p-3 sm:p-4 text-left border transition flex items-center justify-between",
                      "bg-[#192028] hover:border-[#FFFB00]",
                      active 
                        ? "bg-[#0f161b] border-[#FFFB00] ring-2 ring-[#FFFB00]/40"
                        : "border-[#2C3A47]"
                    ].filter(Boolean).join(" ")}
                  >
                    <div className="pr-2 sm:pr-3">
                      <div className="text-[15px] sm:text-lg font-bold leading-tight">{pm.name}</div>
                      <div className="text-xs sm:text-sm text-gray-300 mt-1">{pm.note}</div>
                    </div>

                    <img
                      src={pm.logo}
                      alt={pm.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                      loading="lazy"
                      decoding="async"
                    />

                    {active && (
                      <span className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FFFB00] text-black grid place-items-center font-bold shadow-lg">
                        <i className="fa-solid fa-check text-sm sm:text-base" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </MobileBleed>

        <div ref={endRef} className="h-0" />

        {/* Espaciador CTA */}
        {!atEnd && <div aria-hidden className="h-24" />}

        {/* CTA Estática */}
        {atEnd && (
          <MobileBleed className="mt-0">
            <StickyCTA_vbuck
              variant="static"
              onClick={handleBuy}
              totalText={totalText}
              summaryLabel={summaryLabel}
            />
          </MobileBleed>
        )}
      </section>

      {/* CTA Flotante */}
      {!atEnd && (
        <StickyCTA_vbuck
          variant="fixed"
          onClick={handleBuy}
          totalText={totalText}
          summaryLabel={summaryLabel}
        />
      )}
    </>
  );
}