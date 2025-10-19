// src/components/RobuxShop.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { openWhatsApp } from "../utils/whatsapp";
import StickyCTA from "./StickyCTA";

/* ===== Helper: full-bleed SOLO en móvil/tablet (desktop intacto) ===== */
function MobileBleed({ children, className = "" }) {
  return (
    <div className={["-mx-9 sm:-mx-4 md:-mx-14 lg:mx-0", className].join(" ")}>
      <div className="px-3 sm:px-4 md:px-6 lg:px-0">{children}</div>
    </div>
  );
}

/* ===== Métodos de pago por país ===== */
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
  BO: [{ id: "qr_bo", name: "Pago con QR", note: "Sin comisión", logo: "/img/payments/qr.webp" }],
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

/* ===== Precio Robux por 1000 ===== */
const ROBUX_RATE = {
  PE: { per1000: 35,   symbol: "S/" },
  MX: { per1000: 185.5, symbol: "$" },
  US: { per1000: 7.0,  symbol: "$" },
  BO: { per1000: 50,   symbol: "Bs" },
};

/* ===== Montos rápidos ===== */
const ROBUX_OPTIONS = [1000, 1500, 2000, 2500, 3000, 4000, 5000];

export default function RobuxShop({ selectedCountry }) {
  const code = selectedCountry?.code ?? "PE";
  const symbol = selectedCountry?.symbol ?? (ROBUX_RATE[code]?.symbol || "S/");

  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [payment, setPayment] = useState("");

  // Para CTA flotante que se acopla al final
  const endRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  const visiblePayments = useMemo(() => getVisiblePayments(code), [code]);

  useEffect(() => {
    if (!visiblePayments.some((pm) => pm.id === payment)) {
      setPayment(visiblePayments[0]?.id || "");
    }
  }, [visiblePayments]); // eslint-disable-line

  // Observa el final para esconder/pegar el CTA
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

  const per1000 = ROBUX_RATE[code]?.per1000 ?? ROBUX_RATE.PE.per1000;
  const total = (amount / 1000) * per1000;
  const totalText =
    code === "US"
      ? `${symbol}${total.toFixed(2)}`
      : `${symbol} ${Number.isInteger(total) ? total.toFixed(0) : total.toFixed(2)}`;

  const handleChoose = (val) => {
    setAmount(val);
    setCustom("");
  };

  const handleCustom = (val) => {
    const n = parseInt(val || "0", 10);
    setCustom(val);
    if (Number.isFinite(n) && n >= 1000) setAmount(n);
  };

  const handleBuy = () => {
    const pm = visiblePayments.find((p) => p.id === payment);
    const msg = `¡Hola! Quiero comprar *${amount} Robux*.
País: ${code}
Método de pago: ${pm?.name || "-"} (${pm?.note || ""})
Total: ${totalText}
(Requisitos: estar en mis grupos 14 días)
¿Disponible?`;
    openWhatsApp(msg);
  };

  return (
    <>
      <section className="w-full md:max-w-[990px] md:mx-auto space-y-8 px-3 sm:px-4 md:px-6 mt-2">
        {/* === HERO (misma altura que Crew) — full-bleed en mobile/tablet === */}
        <MobileBleed>
          <div className="rounded-2xl overflow-hidden border md:border border-[#2C3A47] bg-[#0f161b]">
            <Swiper modules={[Navigation]} navigation loop slidesPerView={1}>
              {[
                { img: "/img/robux/hero1.webp", alt: "Robux Promo 1" },
                { img: "/img/robux/hero2.webp", alt: "Robux Promo 2" },
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
 <MobileBleed>
        {/* === PASO 1: Requisitos === */}
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
            <h2 className="text-xl font-bold">Requisitos para Robux</h2>
          </div>

          <div className="rounded-2xl bg-[#191F26] border border-[#2C3A47] p-4 md:p-5">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
                <p className="text-base text-white">
                  Debes estar en mi grupo por 14 días para enviar Robux al instante.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
                <p className="text-base text-white">No se entrega por Gamepass (solo por Grupo).</p>
              </div>
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-check mt-0.5 text-[#45F983]" />
                <p className="text-base text-white">Robux 100% legales.</p>
              </div>
            </div>
          </div>
        </div>
</MobileBleed>

 <MobileBleed>
        {/* === PASO 2: Montos (3 cols en celular) === */}
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

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {ROBUX_OPTIONS.map((r) => {
              const active = amount === r && !custom;
              return (
                <button
                  key={r}
                  onClick={() => handleChoose(r)}
                  aria-pressed={active}
                  style={{ overflow: "visible" }}
                  className={`relative rounded-xl transition border-2 px-4 py-4 bg-[#191F26] flex items-center justify-center gap-2
                    ${active ? "border-[#45F983] shadow-[0_0_20px_rgba(69,249,131,.4)]" : "border-[#2C3A47] hover:border-[#45F983]"}`}
                >
                  <img src="/img/robux-icon.png" alt="Robux" className="w-6 h-6 object-contain" />
                  <span className="font-semibold text-[16px]">{r.toLocaleString()}</span>

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

          {/* Monto personalizado */}
          <div className="mt-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sd text-gray-300">Monto personalizado (mínimo 1000)</span>
              <div className="flex-1 border-t border-[#2C3A47]" />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1000}
                step={100}
                value={custom}
                onChange={(e) => handleCustom(e.target.value)}
                placeholder="Ej: 1800"
                className="flex-1 bg-[#0f161b] border border-[#2C3A47] focus:border-[#45F983] focus:ring-2 focus:ring-[#45F983]/30 text-white rounded-xl px-4 py-3 outline-none"
              />
              <button
                onClick={() => handleCustom(String(Math.max(Number(custom) || 0, 1000)))}
                className="px-4 py-3 rounded-xl bg-[#192028] border border-[#2C3A47] hover:border-[#45F983] text-white"
              >
                Usar
              </button>
            </div>
          </div>
        </div>
</MobileBleed>

 <MobileBleed>
        {/* === PASO 3: Métodos de pago (2 cols en celular) === */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    <div className="text-[15px] sm:text-base font-bold">{pm.name}</div>
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
        {/* === VIDEO — full-bleed en mobile/tablet === */}
        <MobileBleed>
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#191F26]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video Robux"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </MobileBleed>

        {/* === REFERENCIAS === */}
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
        </MobileBleed>

         {/* Marcador para el final de la sección */}
               <div ref={endRef} className="h-0" />
       
               {/* Espaciador SOLO cuando el CTA flotante está visible (para no tapar contenido) */}
               {!atEnd && <div aria-hidden className="h-24" />}
       
               {/* CTA ACOPLADA (en el flujo) cuando estamos al final — full-bleed SOLO en mobile/tablet */}
               {atEnd && (
                 <MobileBleed className="mt-0">
                   <StickyCTA
                     variant="static"
                     title="Robux"
                     totalText={totalText}
                     onClick={handleBuy}
                     showOnDesktop
                   />
                 </MobileBleed>
               )}
             </section>
       
             {/* CTA FLOTANTE (para mobile y desktop) mientras NO estás al final */}
             {!atEnd && (
               <StickyCTA
                 variant="fixed"
                 title="Robux"
                 totalText={totalText}
                 onClick={handleBuy}
                 showOnDesktop
               />
             )}
           </>
         );
       }
       