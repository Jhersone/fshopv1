import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageSlider() {
  const slides = [
    { img: "/img/db2.png", alt: "Promoción exclusiva", link: "#" },
    { img: "/img/diaman2.1.png", alt: "Nuevo pase disponible", link: "#" },
    { img: "/img/r1.1.png", alt: "Evento especial Fortnite", link: "#" },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden shadow-lg mb-6 bg-[#192028]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="custom-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <a href={slide.link}>
 <img
  src={slide.img}
  alt={slide.alt}
  className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
/>


            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
