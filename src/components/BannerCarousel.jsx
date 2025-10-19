import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Banners: cambia imágenes y links
const BANNERS = [
  { img: "/img/db2.png", alt: "Promo 1", href: "#" },
  { img: "/img/F1.1.png", alt: "Promo 2", href: "#" },
  { img: "/img/banner-3.jpg", alt: "Promo 3", href: "#" },
  { img: "/img/banner-4.jpg", alt: "Promo 4", href: "#" },
];

export default function BannerCarousel() {
  return (
    <div className="relative w-full max-w-[1200px] mx-auto">
      {/* sombras laterales sutiles */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0f161b] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0f161b] to-transparent z-10" />

      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        navigation
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        // 👇 Este setup logra “uno completo + siguiente asomado”, responsive
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 1.4, spaceBetween: 18 },
          768: { slidesPerView: 1.8, spaceBetween: 20 },
          1024:{ slidesPerView: 2.3, spaceBetween: 22 },
          1280:{ slidesPerView: 2.6, spaceBetween: 24 },
        }}
        className="pagostore-swiper"
      >
        {BANNERS.map((b, i) => (
          <SwiperSlide key={i}>
            <a href={b.href} className="block">
              <img
                src={b.img}
                alt={b.alt}
                className="w-full h-[160px] sm:h-[220px] md:h-[250px] lg:h-[280px] object-cover rounded-2xl shadow-lg border border-[#22303C]"
                loading="lazy"
                decoding="async"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
