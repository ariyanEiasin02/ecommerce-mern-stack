"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface SlideData {
  _id: string;
  image: string;
  link?: string;
}

interface CustomSliderProps {
  slides?: SlideData[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

const resolveImage = (src: string) =>
  src.startsWith('http') || src.startsWith('/uploads') ? src.replace(/^\/uploads/, `${BACKEND_URL}/uploads`) : src;

const CustomSlider = ({ slides }: CustomSliderProps) => {
  const fallbackSlides: SlideData[] = [
    { _id: '1', image: '/hero1.webp' },
    { _id: '2', image: '/hero2.webp' },
    { _id: '3', image: '/hero3.webp' },
  ];

  const displaySlides = slides && slides.length > 0 ? slides : fallbackSlides;

  return (
    <div className="custom-slider">
      <Swiper
        modules={[Pagination, Autoplay]}
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
        {displaySlides.map((slide, idx) => (
          <SwiperSlide key={slide._id}>
            {slide.link ? (
              <Link href={slide.link} className="slider-item">
                <Image
                  src={resolveImage(slide.image)}
                  alt={`Slide ${idx + 1}`}
                  width={1200}
                  height={500}
                  priority={idx === 0}
                  className="slider-image"
                />
              </Link>
            ) : (
              <div className="slider-item">
                <Image
                  src={resolveImage(slide.image)}
                  alt={`Slide ${idx + 1}`}
                  width={1200}
                  height={500}
                  priority={idx === 0}
                  className="slider-image"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSlider;