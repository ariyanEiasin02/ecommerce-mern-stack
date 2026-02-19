'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ProductImage as ProductImageType } from '@/types/product';

import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  // Main swiper ref — lets thumb clicks drive the main swiper
  const mainSwiperRef = useRef<SwiperType | null>(null);
  // Thumb swiper instance — passed to Swiper Thumbs module on main swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Zoom state
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomBg, setZoomBg] = useState('50% 50%');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - r.top) / r.height) * 100, 0), 100);
    setZoomBg(`${x}% ${y}%`);
  }, []);

  /** Clicking a thumbnail must slide the MAIN swiper to match */
  const handleThumbClick = (idx: number) => {
    mainSwiperRef.current?.slideTo(idx);
  };

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery__empty">
        <span>No images available</span>
      </div>
    );
  }

  const currentSrc = images[activeIndex]?.url || images[0]?.url || '';

  return (
    <div className="product-gallery">
      <div className="product-gallery__inner">

        {/* ── Vertical thumbnails (desktop) ── */}
        <div className="product-gallery__thumbs-col d-none d-lg-flex">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="vertical"
            spaceBetween={10}
            slidesPerView={5}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Thumbs]}
            className="product-gallery__thumb-swiper"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={img.id || idx}>
                <button
                  type="button"
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => handleThumbClick(idx)}
                  className={`product-gallery__thumb-btn${activeIndex === idx ? ' product-gallery__thumb-btn--active' : ''}`}
                >
                  <Image
                    src={img.url || '/placeholder.jpg'}
                    alt={img.alt || `${productName} ${idx + 1}`}
                    width={80}
                    height={80}
                    className="product-gallery__thumb-img"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    quality={60}
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Main Image ── */}
        <div className="product-gallery__main-col">
          {/* Zoom overlay — background-image magnifier, no Swiper transform hacks */}
          <div
            ref={wrapRef}
            className={`product-gallery__main-wrap${isZooming ? ' product-gallery__main-wrap--zoomed' : ''}`}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Swiper for swiping between images */}
            <Swiper
              onSwiper={(s) => { mainSwiperRef.current = s; }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Thumbs, Navigation, FreeMode]}
              navigation={images.length > 1}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              className="product-gallery__main-swiper"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={img.id || idx}>
                  <div className="product-gallery__slide-inner">
                    <Image
                      src={img.url || '/placeholder.jpg'}
                      alt={img.alt || productName}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="product-gallery__main-img"
                      priority={idx === 0}
                      quality={90}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Magnified zoom overlay — CSS background approach, zero transform hacks */}
            {isZooming && currentSrc && (
              <div
                className="product-gallery__zoom-overlay"
                style={{
                  backgroundImage: `url(${currentSrc})`,
                  backgroundPosition: zoomBg,
                }}
                aria-hidden="true"
              />
            )}

            {/* Zoom icon hint */}
            <span className="product-gallery__zoom-hint" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>

            {/* Counter */}
            <div className="product-gallery__counter" aria-live="polite">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile horizontal thumbnails ── */}
      <div className="product-gallery__mobile-thumbs d-flex d-lg-none mt-3">
        <Swiper
          spaceBetween={8}
          slidesPerView="auto"
          freeMode
          modules={[FreeMode]}
          className="product-gallery__mobile-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={img.id || idx} style={{ width: 64, height: 64 }}>
              <button
                type="button"
                aria-label={`View image ${idx + 1}`}
                onClick={() => handleThumbClick(idx)}
                className={`product-gallery__thumb-btn product-gallery__thumb-btn--mobile${activeIndex === idx ? ' product-gallery__thumb-btn--active' : ''}`}
              >
                <Image
                  src={img.url || '/placeholder.jpg'}
                  alt={img.alt || `${productName} ${idx + 1}`}
                  width={64}
                  height={64}
                  className="product-gallery__thumb-img"
                  loading="lazy"
                  quality={60}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductGallery;
