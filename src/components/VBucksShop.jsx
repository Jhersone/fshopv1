// src/components/VBucksShop.jsx
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { openWhatsApp } from "../utils/whatsapp";

/* ==================== PLATAFORMAS (solo logo) ==================== */
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

/* ==================== MÉTODOS DE PAGO POR PAÍS ==================== */
const PAYMENTS_BY_COUNTRY = {
  PE: [
    { id: "yape",        name: "YAPE",          note: "Sin comisión", logo: "/img/payments/yape.webp" },
    { id: "plin",        name: "PLIN",          note: "Sin comisión", logo: "/img/payments/plin.png" },
    { id: "transf_pe",   name: "TRANSFERENCIA", note: "Sin comisión", logo: "/img/payments/deposito.png" },
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
const getVisiblePayments = (code) =>
  PAYMENTS_BY_COUNTRY[code] ?? PAYMENTS_BY_COUNTRY.GLOBAL;

/* ==================== PRECIOS V-BUCKS ==================== */
const VBUCKS_RATE = {
  PE: { per1000: 20,  symbol: "S/" },
  MX: { per1000: 110, symbol: "$"  },
  BO: { per1000: 50,  symbol: "Bs" },
  US: { per1000: 7.0, symbol: "$"  },
  GLOBAL: { per1000: 20, symbol: "S/" },
};
const VBUCKS_PRICE_TABLE = {
  PE: { 1000: 20,  2800: 55,  5000: 95,  13500: 240 },
  MX: { 1000: 110, 2800: 295, 5000: 480, 13500: 1180 },
  BO: { 1000: 50,  2800: 135, 5000: 220, 13500: 540 },
  US: { 1000: 7.0, 2800: 18.5, 5000: 30.0, 13500: 75.0 },
  GLOBAL: {}
};
const VBucksPrice = (code, amount) => {
  const table = VBUCKS_PRICE_TABLE[code] ?? VBUCKS_PRICE_TABLE.GLOBAL ?? {};
  if (table[amount] != null) return table[amount];
  const per1000 = VBUCKS_RATE[code]?.per1000 ?? VBUCKS_RATE.GLOBAL.per1000;
  return (amount / 1000) * per1000;
};


  // Tamaño libre del icono de ofertas (en píxeles)
const OFFER_ICON_PX = 180; // cámbialo a lo que quieras (por ej. 64, 72, 80…)
/* ==================== PAQUETES ==================== */
const VBUCKS_OPTIONS = [1000, 2800, 5000, 13500];

/* ============ OFERTAS ESPECIALES (independientes) ============ */
/* Cada oferta tiene su propio precio por país (no toca los chips) */
const OFFERS = [
  {
    id: "pack2800",
    title: "Paquete 2,800 V-Bucks",
    img: "/img/pavos/abeja.png",
    price: { PE: 55, MX: 295, BO: 135, US: 18.5, GLOBAL: 55 },
  },
  {
    id: "pack5000",
    title: "Paquete 5,000 V-Bucks",
    img: "/img/pavos/oferta2.jpg",
    price: { PE: 95, MX: 480, BO: 220, US: 30.0, GLOBAL: 95 },
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
  // NUEVO: oferta seleccionada (independiente de los chips)
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const visiblePayments = useMemo(() => getVisiblePayments(code), [code]);
  useEffect(() => {
    if (!visiblePayments.some(pm => pm.id === payment)) {
      setPayment(visiblePayments[0]?.id || "");
    }
  }, [visiblePayments]); // eslint-disable-line

  // Total y label según si hay oferta seleccionada
  const computedTotal = selectedOfferId
    ? offerPrice(code, selectedOfferId)
    : VBucksPrice(code, amount);

  const totalText =
    code === "US"
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

  // Badge estilo pagostore
  const Badge = ({ n }) => (
    <div
      className="w-8 h-8 bg-[#45F983] text-black font-bold text-[18px] grid place-items-center"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
        borderRadius: "4px",
      }}
    >
      {n}
    </div>
  );

  return (
    <section className="max-w-[990px] mx-auto px-6 mt-2 space-y-8">
      {/* ==================== HERO ==================== */}
      <div className="rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#0f161b]">
        <Swiper modules={[Navigation]} navigation loop slidesPerView={1}>
          {[
            { img: "/img/vbucks/hero1.webp", alt: "V-Bucks Promo 1" },
            { img: "/img/vbucks/hero2.webp", alt: "V-Bucks Promo 2" },
          ].map((b, i) => (
            <SwiperSlide key={i}>
              <img
                src={b.img}
                alt={b.alt}
                className="w-full h-[180px] sm:h-[220px] md:h-[150px] object-cover"
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ==================== PASO 1: Requisitos ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Badge n={1} />
          <h2 className="text-xl font-bold">Requisitos para Activación</h2>
        </div>

        <div className="rounded-2xl bg-[#191F26] border border-[#2C3A47] p-4 md:p-5">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
              <p className="text-base text-white">Correo electrónico y contraseña</p>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
              <p className="text-base text-white">
                Debes tener acceso a tu correo electrónico
                <span className="block text-sm text-gray-400">
                  (te llegará un código de verificación)
                </span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
              <p className="text-base text-white">Tiempo aproximado: 15 minutos</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PASO 2: Plataformas ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Badge n={2} />
          <h2 className="text-xl font-bold">¿Por dónde ingresas?</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
                    ? "border-[#45F983] shadow-[0_0_20px_rgba(69,249,131,.4)]"
                    : "border-[#2C3A47] hover:border-[#45F983]"
                }`}
              >
                <div className="h-24 rounded-xl bg-[#192028] grid place-items-center">
                  <img
                    src={p.img}
                    alt={p.alt || p.id}
                    className="max-w-[70%] max-h-[70%] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

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

      {/* ==================== PASO 3: Cantidad ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Badge n={3} />
          <h2 className="text-xl font-bold">Elige la cantidad</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VBUCKS_OPTIONS.map((v) => {
            const active = !selectedOfferId && amount === v; // activo solo si NO hay oferta
            return (
              <button
                key={v}
                onClick={() => {
                  setAmount(v);
                  setSelectedOfferId(null); // deseleccionar oferta si elijo chip
                }}
                aria-pressed={active}
                style={{ overflow: "visible" }}
                className={`relative rounded-xl transition border-2 px-4 py-5 bg-[#191F26] flex items-center justify-center gap-2 ${
                  active
                    ? "border-[#45F983] shadow-[0_0_20px_rgba(69,249,131,.4)]"
                    : "border-[#2C3A47] hover:border-[#45F983]"
                }`}
              >
                <img src="/img/pavos/vbu.png" alt="V-Bucks" className="w-7 h-7 object-contain" />
                <span className="font-semibold text-[18px]">{v.toLocaleString()}</span>

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
<div className="mt-4"> {/* antes estaba mt-6, lo achiqué */}
  <div className="flex items-center gap-3 mb-3">
    <span className="text-lg font-bold text-white">Ofertas especiales</span> {/* más grande */}
    <div className="flex-1 border-t border-[#2C3A47]" />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[650px]"> {/* más chico el contenedor */}
    {OFFERS.map((of) => {
      const active = selectedOfferId === of.id;
      return (
        <button
          key={of.id}
          onClick={() =>
            setSelectedOfferId((prev) => (prev === of.id ? null : of.id))
          }
          aria-pressed={active}
          className={`relative rounded-xl border-2 bg-[#191F26] transition flex flex-col items-center justify-between p-3 h-[180px]
            ${
              active
                ? "border-[#45F983] shadow-[0_0_16px_rgba(69,249,131,.25)]"
                : "border-[#2C3A47] hover:border-[#45F983]"
            }`}
        >
          <img
            src={of.img}
            alt={of.title}
            className="w-auto h-[110px] object-contain mb-2" 
          />
          <span className="font-semibold text-base leading-tight -mt-1">
            {of.title}
          </span>

          {active && (
            <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-[#45F983] text-black grid place-items-center">
              <i className="fa-solid fa-check text-sm" />
            </span>
          )}
        </button>
      );
    })}
  </div>
</div>



      </div>

      {/* ==================== PASO 4: Métodos de pago ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Badge n={4} />
          <h2 className="text-xl font-bold">Método de Pago</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePayments.map((pm) => {
            const active = payment === pm.id;
            return (
              <button
                key={pm.id}
                onClick={() => setPayment(pm.id)}
                aria-pressed={active}
                className={[
                  "relative rounded-2xl p-4 text-left border transition flex items-center justify-between",
                  "bg-[#192028] border-[#2C3A47] hover:border-[#45F983]",
                  active && "bg-[#0f161b] border-[#45F983] ring-2 ring-[#45F983]/40",
                ].filter(Boolean).join(" ")}
              >
                <div className="pr-3">
                  <div className="text-lg font-bold">{pm.name}</div>
                  <div className="text-sm text-gray-300 mt-1">{pm.note}</div>
                </div>

                <img
                  src={pm.logo}
                  alt={pm.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                  loading="lazy"
                  decoding="async"
                />

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

      {/* ==================== RESUMEN + CTA ==================== */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl bg-[#191F26] border border-[#2C3A47] px-4 py-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <img src="/img/pavos/vbu.png" alt="" className="w-8 h-8 object-contain hidden sm:block" />
            <div className="leading-tight">
              <div className="font-semibold">{summaryLabel}</div>
              <div className="mt-1 text-[19px]">
                Total: <span className="font-bold text-[#45F983]">{totalText}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={handleBuy}
              className="w-full md:w-[220px] bg-[#45F983] hover:bg-[#36E673] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition"
            >
              <i className="fab fa-whatsapp text-xl" />
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* ==================== VIDEO YOUTUBE ==================== */}
      <div className="w-full">
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#191F26]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video V-Bucks"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* ==================== REFERENCIAS (slider) ==================== */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mt-4 mb-2">¿Necesitas Referencias?</h2>
        <p className="text-gray-300 mb-6">
          Aquí podrás visualizar algunos de los tantos pedidos que concretamos todos los días.
        </p>

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
              <div className="rounded-xl overflow-hidden border border-[#2C3A47] bg-[#0f161b]">
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
      </div>
    </section>
  );
}
