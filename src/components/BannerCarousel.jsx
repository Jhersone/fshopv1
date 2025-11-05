import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BANNERS = [
  { img: "/img/db2.png", alt: "Promo 1", href: "#" },
  { img: "/img/db2.png", alt: "Promo 2", href: "#" },
  { img: "/img/db2.png", alt: "Promo 3", href: "#" },
  { img: "/img/db2.png", alt: "Promo 4", href: "#" },
];

export default function BannerCarousel() {
  return (
    <div className="relative w-full max-w-[1300px] mx-auto">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        centeredSlides
        grabCursor
        slidesPerView={1.1}
        spaceBetween={14}
        breakpoints={{
          640: { slidesPerView: 1.3, spaceBetween: 16 },
          768: { slidesPerView: 1.8, spaceBetween: 18 },
          1024: { slidesPerView: 2.3, spaceBetween: 22 },
          1280: { slidesPerView: 2.8, spaceBetween: 24 },
        }}
        className="pagostore-style-swiper"
      >
        {BANNERS.map((b, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full aspect-[16/8] bg-[#0f161b] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg">
              <img
                src={b.img}
                alt={b.alt}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradientes laterales (solo en desktop) 
      <div className="hidden md:block pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f161b] via-[#0f161b]/80 to-transparent z-10" />
      <div className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0f161b] via-[#0f161b]/80 to-transparent z-10" />
*/}
      <style>{`
        .pagostore-style-swiper .swiper-pagination-bullet {
          background-color: #FFFB00;
          opacity: 0.4;
        }
        .pagostore-style-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
