// src/components/FreeFireShop.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { openWhatsApp } from "../utils/whatsapp";
import StickyFreeFireCTA from "./StickyFreeFireCTA";


// ==== Helper: full-bleed SOLO en móvil/tablet (en desktop no cambia nada)
function MobileBleed({ children, className = "" }) {
  return (
    <div className={["-mx-12 sm:-mx-4 md:-mx-14 lg:mx-0", className].join(" ")}>
      <div className="px-3 sm:px-4 md:px-6 lg:px-0">{children}</div>
    </div>
  );
}

// ===================== MÉTODOS DE PAGO POR PAÍS =====================
const PAYMENTS_BY_COUNTRY = {
  PE: [
    { id: "yape",        name: "YAPE",          note: "Sin comisión", logo: "/img/payments/yape.webp" },
    { id: "plin",        name: "PLIN",          note: "Sin comisión", logo: "/img/payments/plin.png" },
    { id: "transf_pe",   name: "TRANSFER", note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "deposito_pe", name: "DEPÓSITO",      note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "paypal_pe",   name: "PAYPAL",        note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  MX: [
    { id: "oxxo",      name: "OXXO",    note: "Con comisión", logo: "/img/payments/oxxo.png" },
    { id: "spei",      name: "SPEI",    note: "Sin comisión", logo: "/img/payments/spei.png" },
    { id: "paypal_mx", name: "PAYPAL",  note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  BO: [
    { id: "qr_bo", name: "Pago con QR", note: "Sin comisión", logo: "/img/payments/qr.webp" },
  ],
  US: [
    { id: "coinbase_us", name: "COINBASE", note: "Sin comisión", logo: "/img/payments/coinbase.webp" },
    { id: "meru_us",     name: "MERU",     note: "Con comisión", logo: "/img/payments/meru.webp" },
    { id: "card_us",     name: "TARJETA",  note: "Con comisión", logo: "/img/payments/card.webp" },
    { id: "paypal_us",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  GLOBAL: [
    { id: "coinbase", name: "COINBASE", note: "Sin comisión", logo: "/img/payments/coinbase.webp" },
    { id: "meru",     name: "MERU",     note: "Con comisión", logo: "/img/payments/meru.webp" },
    { id: "card",     name: "TARJETA",  note: "Con comisión", logo: "/img/payments/card.webp" },
    { id: "paypal",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
    { id: "binance",  name: "BINANCE",  note: "Sin comisión", logo: "/img/payments/binance.webp" },
  ],
};
const getVisiblePayments = (code) => PAYMENTS_BY_COUNTRY[code] ?? PAYMENTS_BY_COUNTRY.GLOBAL;

// ===================== PRECIOS DIAMANTES (fallback por 100) =====================
const DIAMOND_RATE = {
  PE: { per100: 3.5,  symbol: "S/"  },
  MX: { per100: 18.0, symbol: "$"  },
  US: { per100: 1.20, symbol: "$"  },
  BO: { per100: 12.0, symbol: "Bs" },
  GLOBAL: { per100: 3.5, symbol: "S/" }
};

/**
 * ===================== TABLA DE PRECIOS MANUAL =====================
 * Si un paquete no está definido para el país, se calcula con DIAMOND_RATE.
 */
const DIAMOND_PRICE_TABLE = {
  PE: {
    110: 3.5,   220: 7,     341: 10,    451: 13.5,  572: 16,
    913: 26,    1023: 30,   1168: 32,   1507: 42,   1738: 48,
    2398: 62,   3584: 94,   5137: 134,  6160: 140,  8558: 202,
    9724: 234,  10065: 244
  },
  MX: {
    110: 15,    220: 30,    341: 39.9,  451: 52,    572: 63,
    913: 100,   1023: 115,  1168: 126,  1507: 162,  1738: 180,
    2398: 252,  3584: 394,  5137: 534,  6160: 560,  8558: 820,
    9724: 950,  10065: 980
  },
  BO: {
    110: 11,    220: 22,    341: 30,    451: 39,    572: 46,
    913: 73,    1023: 85,   1168: 92,   1507: 120,  1738: 138,
    2398: 184,  3584: 290,  5137: 392,  6160: 400,  8558: 600,
    9724: 680,  10065: 700
  },
  US: {
    110: 1.0,  220: 2.3,   341: 3.2,   451: 4.0,   572: 5.2,
    913: 8.3,   1023: 9.5,  1168: 10.2, 1507: 13.5, 1738: 15.0,
    2398: 20.0, 3584: 31.5, 5137: 42.0, 6160: 45.0, 8558: 65.0,
    9724: 74.0, 10065: 76.0
  },
  GLOBAL: {}
};

const priceForDiamonds = (code, amount) => {
  const table = DIAMOND_PRICE_TABLE[code] ?? DIAMOND_PRICE_TABLE.GLOBAL ?? {};
  if (table && table[amount] != null) return table[amount];
  const per100 = (DIAMOND_RATE[code]?.per100 ?? DIAMOND_RATE.GLOBAL.per100);
  return (amount / 100) * per100;
};

// ===================== PAQUETES RÁPIDOS =====================
const DIAMOND_OPTIONS = [
  110, 220, 341, 451, 572, 913, 1023, 1168, 1507, 1738,
  2398, 3584, 5137, 6160, 8558, 9724, 10065
];

// ===================== OFERTAS ESPECIALES =====================
const OFFERS = [
  { id: "weekly",  title: "Tarjeta Semanal", img: "/img/t.semanal.png"  },
  { id: "monthly", title: "Tarjeta Mensual", img: "/img/t.mensual.png"  },
];

/** Precios de ofertas por país (ajústalos a tus valores) */
const OFFER_PRICE_TABLE = {
  PE: { weekly: 5.0, monthly: 20.0 },
  MX: { weekly: 25.0, monthly: 95.0 },
  BO: { weekly: 18.0, monthly: 70.0 },
  US: { weekly: 1.49, monthly: 5.99 },
  GLOBAL: { weekly: 5.0, monthly: 20.0 }
};

export default function FreeFireShop({ selectedCountry }) {
  const code   = selectedCountry?.code ?? "PE";
  const symbol = selectedCountry?.symbol ?? (DIAMOND_RATE[code]?.symbol || "S/");

  const [playerId, setPlayerId]     = useState("");
  const [amount, setAmount]         = useState(DIAMOND_OPTIONS[0]);
  const [payment, setPayment]       = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);

  // 👇 CTA flotante: estado de fin de sección
  const endRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  const visiblePayments = useMemo(() => getVisiblePayments(code), [code]);

  useEffect(() => {
    if (!visiblePayments.some(pm => pm.id === payment)) {
      setPayment(visiblePayments[0]?.id || "");
    }
  }, [visiblePayments]); // eslint-disable-line

  // 👇 Observa el final para ocultar/mostrar CTA flotante
  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -90px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Totales
  const offerTable = OFFER_PRICE_TABLE[code] ?? OFFER_PRICE_TABLE.GLOBAL;
  const offerTotal = selectedOffer ? offerTable?.[selectedOffer] : null;
  const diamondsTotal = priceForDiamonds(code, amount);
  const finalTotal = (offerTotal ?? diamondsTotal);

  const totalText =
    code === "US"
      ? `${symbol}${(finalTotal ?? 0).toFixed(2)}`
      : `${symbol} ${Number.isInteger(finalTotal) ? finalTotal.toFixed(0) : finalTotal.toFixed(2)}`;

  const handleChoose = (val) => {
    setAmount(val);
  };

  const handleBuy = () => {
    const pm = visiblePayments.find(p => p.id === payment);
    const name = selectedOffer
      ? (selectedOffer === "weekly" ? "Tarjeta Semanal" : "Tarjeta Mensual")
      : `${amount} diamantes`;

    const msg = `¡Hola! Quiero *${name}*.
ID de jugador: ${playerId || "-"}
País: ${code}
Método de pago: ${pm?.name || "-"} (${pm?.note || ""})
Total: ${totalText}
¿Disponible?`;
    openWhatsApp(msg);
  };

  return (
    <>
      <section className="max-w-[990px] mx-auto px-6 mt-2 space-y-8">
        {/* ===================== HERO — full-bleed en móvil/tablet ===================== */}
        <MobileBleed>
          <div className="rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#0f161b]">
            <Swiper modules={[Navigation]} navigation loop slidesPerView={1}>
              {[
                { img: "/img/freefire/hero1.webp", alt: "Free Fire Promo 1" },
                { img: "/img/freefire/hero2.webp", alt: "Free Fire Promo 2" },
              ].map((b, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={b.img}
                    alt={b.alt}
                    className="w-full h-[75px] sm:h-[160px] md:h-[150px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </MobileBleed>

        {/* ===================== PASO 1: Ingresar (full-bleed en móvil/tablet) ===================== */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 bg-[#45F983] text-black font-bold text-[18px] grid place-items-center"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
                  borderRadius: "4px",
                }}
              >
                1
              </div>
              <h2 className="text-xl font-bold">Ingresar</h2>
            </div>

            {/* Card angosta alineada a la izquierda */}
            <div className="rounded-2xl bg-[#191F26] border border-[#2C3A47] p-4 md:p-5 max-w-[360px]">
              <label className="block text-sm font-semibold mb-2">
                ID de jugador <i className="fa-regular fa-circle-question opacity-70" />
              </label>
              <input
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Introduce el ID del jugador aquí."
                className="w-full bg-[#0f161b] border border-[#2C3A47] focus:border-[#45F983] focus:ring-2 focus:ring-[#45F983]/30 text-white rounded-xl px-4 py-3 outline-none"
              />
            </div>
          </div>
        </MobileBleed>

        {/* ===================== PASO 2: Cantidad (full-bleed en móvil/tablet) ===================== */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 bg-[#45F983] text-black font-bold text-[18px] grid place-items-center"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
                  borderRadius: "4px",
                }}
              >
                2
              </div>
              <h2 className="text-xl font-bold">Elige la cantidad</h2>
            </div>

       <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-3">

              {DIAMOND_OPTIONS.map((d) => {
                const active = !selectedOffer && amount === d;
                return (
                  <button
                    key={d}
                    onClick={() => { setSelectedOffer(null); handleChoose(d); }}
                    aria-pressed={active}
                    style={{ overflow: "visible" }}
                    className={`relative rounded-xl transition border-2 px-4 py-3 bg-[#191F26] flex items-center justify-center gap-2
                      ${active ? "border-[#45F983] shadow-[0_0_20px_rgba(69,249,131,.4)]" : "border-[#2C3A47] hover:border-[#45F983]"}`}
                  >
                    <img
                      src="/img/diama.png"
                      alt="Diamante"
                      className="object-contain"
                      style={{ width: "40px", height: "29px" }}
                    />
                    <span className="font-semibold" style={{ fontSize: "18px" }}>
                      {d.toLocaleString()}
                    </span>

                    {active && (
                      <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-[#45F983] text-black grid place-items-center shadow-lg">
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
                <span className="text-sd text-gray-300">Ofertas especiales</span>
                <div className="flex-1 border-t border-[#2C3A47]" />
              </div>

              <div className="grid grid-cols-2 gap-3">

                {OFFERS.map((of) => {
                  const active = selectedOffer === of.id;
                  return (
                    <button
                      key={of.id}
                      onClick={() => setSelectedOffer(of.id)}
                      aria-pressed={active}
                      className={`relative rounded-xl border-2 px-4 py-4 bg-[#191F26] transition flex items-center gap-3 h-[60px]
                        ${active ? "border-[#45F983] shadow-[0_0_20px_rgba(69,249,131,.4)]" : "border-[#2C3A47] hover:border-[#45F983]"}`}
                    >
                      <img
                        src={of.img}
                        alt={of.title}
                        className="w-12 h-12 object-contain rounded-md"
                      />
                      <span className="font-semibold">{of.title}</span>

                      {active && (
                        <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-[#45F983] text-black grid place-items-center shadow-lg">
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
          </div>
        </MobileBleed>

        {/* ===================== PASO 3: Métodos de pago (full-bleed en móvil/tablet) ===================== */}
        <MobileBleed>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 bg-[#45F983] text-black font-bold text-[18px] grid place-items-center"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
                  borderRadius: "4px",
                }}
              >
                3
              </div>
              <h2 className="text-xl font-bold">Método de Pago</h2>
            </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {visiblePayments.map((pm) => {
                const active = payment === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPayment(pm.id)}
                    aria-pressed={active}
                    className={[
                      "relative rounded-2xl p-3 text-left border transition flex items-center justify-between",
                      "bg-[#192028] border-[#2C3A47] hover:border-[#45F983]",
                      active && "bg-[#0f161b] border-[#45F983] ring-2 ring-[#45F983]/40",
                    ].filter(Boolean).join(" ")}
                  >
                    <div className="pr-3">
                      <div className="text-lg font-bold">{pm.name}</div>
                      <div className="text-sm text-gray-300 mt-1">{pm.note}</div>
                    </div>
                    <img src={pm.logo} alt={pm.name} className="w-12 h-12 md:w-14 md:h-14 object-contain" loading="lazy" decoding="async" />
                    {active && (
                      <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-[#45F983] text-black grid place-items-center font-bold shadow-lg">
                        <i className="fa-solid fa-check text-base" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </MobileBleed>

      

        {/* ===================== VIDEO YOUTUBE — full-bleed en móvil/tablet ===================== */}
        <MobileBleed>
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#191F26]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video Free Fire"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </MobileBleed>

        {/* ===================== REFERENCIAS (slider) — full-bleed en móvil/tablet ===================== */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mt-4 mb-2">¿Necesitas Referencias?</h2>
          <p className="text-gray-300 mb-6">
            Aquí podrás visualizar algunos de los tantos pedidos que concretamos todos los días.
          </p>
        </div>
        <MobileBleed>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 14 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 18 },
            }}
            className="rounded-xl referencias-slider"
          >
            {[
              "/img/club/ref1.webp",
              "/img/club/ref2.webp",
              "/img/club/ref3.webp",
              "/img/club/ref4.webp",
              "/img/club/ref5.webp",
              "/img/club/ref6.webp",
              "/img/club/ref7.webp",
            ].map((src, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#0f161b]">
                  <img
                    src={src}
                    alt={`Referencia ${i + 1}`}
                    className="w-full h-[320px] object-contain bg-[#0f161b]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </MobileBleed>

     {/* Marcador para el final de la sección */}
<div ref={endRef} className="h-0" />

{/* Espaciador SOLO cuando el CTA flotante está visible (para no tapar contenido) */}
{!atEnd && <div aria-hidden className="h-24" />}

{/* CTA ACOPLADA (en el flujo) cuando estamos al final — full-bleed SOLO en mobile/tablet */}
{atEnd && (
  <MobileBleed className="mt-0">
    <StickyFreeFireCTA
     variant="static"
      amount={amount}
      selectedOffer={selectedOffer}
      totalText={totalText}
      onClick={handleBuy}
      showOnDesktop
    />
  </MobileBleed>
)}
</section>

{/* CTA FLOTANTE (para mobile y desktop) mientras NO estás al final */}
{!atEnd && (
  <StickyFreeFireCTA
    variant="fixed"
  amount={amount}
  selectedOffer={selectedOffer}
  totalText={totalText}
  onClick={handleBuy}
  showOnDesktop
  />
)}
</>
);
}
