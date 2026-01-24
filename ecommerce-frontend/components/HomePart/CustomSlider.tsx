"use client";

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CustomSlider = () => {
  const slides = [
    {
      id: 1,
      image: '/hero1.webp',
      alt: 'Home Appliances Sale',
    },
    {
      id: 2,
      image: '/hero2.webp',
      alt: 'Electronics Deal',
    },
    {
      id: 3,
      image: '/hero3.webp',
      alt: 'Special Offer',
    },
  ];

  return (
    <div className="custom-slider">
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={600}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slider-item">
              <Image
                src={slide.image}
                alt={slide.alt}
                width={1200}
                height={500}
                priority={slide.id === 1}
                className="slider-image"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSlider;