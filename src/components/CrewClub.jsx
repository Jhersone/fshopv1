// src/components/CrewClub.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { openWhatsApp } from "../utils/whatsapp";
import StickyCTA from "./StickyCTA";

// ==== Helper: full-bleed SOLO en móvil/tablet (en desktop no cambia nada) ====
function MobileBleed({ children, className = "" }) {
  // -mx-* cancela el padding del <section> en móvil/tablet; en lg lo deja intacto
  return (
    <div className={["-mx-9 sm:-mx-4 md:-mx-14 lg:mx-0", className].join(" ")}>
      {/* margen controlado para que no quede "pegado-pegado" */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-0">{children}</div>
    </div>
  );
}

// ==== PLATAFORMAS ====
const PLATFORMS = [
  { id: "epic",     img: "/img/platforms/epic.webp",        alt: "Epic Games" },
  { id: "ps",       img: "/img/platforms/playstation.webp", alt: "PlayStation" },
  { id: "nintendo", img: "/img/platforms/nintendo.webp",    alt: "Nintendo" },
  { id: "xbox",     img: "/img/platforms/xbox.webp",        alt: "Xbox" },
  { id: "google",   img: "/img/platforms/google.webp",      alt: "Google" },
  { id: "steam",    img: "/img/platforms/steam.webp",       alt: "Steam" },
  { id: "apple",    img: "/img/platforms/apple.webp",       alt: "Apple" },
  { id: "facebook", img: "/img/platforms/facebook.webp",    alt: "Facebook" },
  { id: "lego",     img: "/img/platforms/lego.webp",        alt: "LEGO" },
];

// ==== MÉTODOS DE PAGO ====
const PAYMENTS_BY_COUNTRY = {
  PE: [
    { id: "yape",        name: "YAPE",     note: "Sin comisión", logo: "/img/payments/yape.webp" },
    { id: "plin",        name: "PLIN",     note: "Sin comisión", logo: "/img/payments/plin.png" },
    { id: "transf_pe",   name: "TRANSFER", note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "deposito_pe", name: "DEPÓSITO", note: "Sin comisión", logo: "/img/payments/deposito.png" },
    { id: "paypal_pe",   name: "PAYPAL",   note: "Con comisión", logo: "/img/payments/paypal.webp" },
  ],
  MX: [
    { id: "oxxo",      name: "OXXO",   note: "Con comisión", logo: "/img/payments/oxxo.png" },
    { id: "spei",      name: "SPEI",   note: "Sin comisión", logo: "/img/payments/spei.png" },
    { id: "paypal_mx", name: "PAYPAL", note: "Con comisión", logo: "/img/payments/paypal.webp" },
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

const getVisiblePayments = (code) =>
  PAYMENTS_BY_COUNTRY[code] ?? PAYMENTS_BY_COUNTRY.GLOBAL;

// ==== PRECIOS ====
const CREW_PRICE = { PE: 20.0, MX: 110.0, BO: 140.0, CL: 6500.0, US: 5.99 };

export default function CrewClub({ selectedCountry }) {
  const [platform, setPlatform] = useState("nintendo");
  const [payment, setPayment] = useState("");
  const endRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false); // true cuando llegamos al final

  const code = selectedCountry?.code ?? "PE";
  const symbol = selectedCountry?.symbol ?? "S/";
  const price = CREW_PRICE[code] ?? CREW_PRICE.PE;
  const priceText =
    code === "US"
      ? `${symbol}${price.toFixed(2)}`
      : `${symbol} ${Number.isInteger(price) ? price.toFixed(0) : price.toFixed(2)}`;

  const visiblePayments = useMemo(() => getVisiblePayments(code), [code]);

  useEffect(() => {
    if (!visiblePayments.some((pm) => pm.id === payment)) {
      setPayment(visiblePayments[0]?.id || "");
    }
  }, [visiblePayments]); // eslint-disable-line react-hooks/exhaustive-deps

  // Detecta cuando llegamos al final para alternar fixed/static
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

  const selectedPlatform = useMemo(
    () => PLATFORMS.find((p) => p.id === platform),
    [platform]
  );
  const selectedPayment = useMemo(
    () => visiblePayments.find((p) => p.id === payment),
    [payment, visiblePayments]
  );

  const handleBuy = () => {
    const msg = `¡Hola! Quiero el *Fortnite Crew*.
País: ${code}
Plataforma: ${selectedPlatform?.alt}
Pago: ${selectedPayment?.name} (${selectedPayment?.note})
Total: ${priceText}`;
    openWhatsApp(msg);
  };

  return (
    <>
      <section
        className="
          w-full
          md:max-w-[990px] md:mx-auto
          space-y-6 sm:space-y-7
          px-3 sm:px-4 md:px-6  /* 👈 padding normal del section */
          mt-0
        "
      >
        {/* HERO – full-bleed SOLO en mobile/tablet */}
        <MobileBleed>
          <div
            className="
              overflow-hidden bg-[#0f161b]
              rounded-none md:rounded-2xl
              border-0 md:border md:border-[#2C3A47]
            "
          >
            <Swiper modules={[Navigation]} navigation loop slidesPerView={1}>
              {[
                { img: "/img/crew2.png", alt: "Fortnite Crew A" },
                { img: "/img/crew.jpg",  alt: "Fortnite Crew B" },
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
        {/* PASO 1: Requisitos (se mantiene con padding del section en todos los tamaños) */}
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
        </MobileBleed>
         <MobileBleed>
        {/* PASO 2: Plataformas (grid igual; si quieres, puedes envolver con <MobileBleed> también) */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 bg-[#45F983] text-black font-bold text-[18px] grid place-items-center"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
                borderRadius: "4px",
              }}
            >
              2
            </div>
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
                  className={`relative rounded-xl transition border ${
                    active
                      ? "border-[#45F983] shadow-[0_0_16px_rgba(69,249,131,.35)]"
                      : "border-[#2C3A47] hover:border-[#45F983]"
                  }`}
                >
                  <div className="h-[67px] sm:h-24 rounded-xl bg-[#192028] grid place-items-center">
                    <img
                      src={p.img}
                      alt={p.alt || p.id}
                      className="max-w-[66%] max-h-[66%] object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {active && (
                    <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-[#45F983] text-black grid place-items-center shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
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

 <MobileBleed>
        {/* PASO 3: Métodos de pago */}
        
        <div>
          <div className="flex items-center gap-3 mb-4">
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {visiblePayments.map((pm) => {
              const active = payment === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setPayment(pm.id)}
                  aria-pressed={active}
                  className={[
                    "relative rounded-2xl p-3 sm:p-4 text-left border transition flex items-center justify-between",
                    "bg-[#192028] border-[#2C3A47] hover:border-[#45F983]",
                    active && "bg-[#0f161b] border-[#45F983] ring-2 ring-[#45F983]/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="pr-2">
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
                    <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-[#45F983] text-black grid place-items-center font-bold shadow-lg">
                      <i className="fa-solid fa-check text-sm" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
</MobileBleed>
        {/* VIDEO – full-bleed SOLO en mobile/tablet */}
        <MobileBleed>
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#2C3A47] bg-[#191F26]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video de referencia"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </MobileBleed>

        {/* REFERENCIAS – slider full-bleed SOLO mobile/tablet */}
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
              title="Fortnite Crew"
              totalText={priceText}
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
          title="Fortnite Crew"
          totalText={priceText}
          onClick={handleBuy}
          showOnDesktop
        />
      )}
    </>
  );
}
