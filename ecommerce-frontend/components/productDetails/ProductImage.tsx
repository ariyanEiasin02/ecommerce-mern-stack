'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { ProductImage as ProductImageType } from '@/types/product';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ProductImageGalleryProps {
  images: ProductImageType[];
  productName: string;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}

const ProductImage: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName,
  onWishlistToggle,
  isWishlisted = false
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images || images.length === 0) {
    return (
      <div className="product-image__placeholder">
        <div className="product-image__no-image">No Image Available</div>
      </div>
    );
  }

  return (
    <div className="product-image">
      {/* Main Image Swiper */}
      <div className="product-image__main">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={10}
          slidesPerView={1}
          className="product-image__main-swiper"
          onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <div className="product-image__main-wrapper">
                <Image
                  src={image.url || '/placeholder.jpg'}
                  alt={image.alt || productName}
                  width={600}
                  height={600}
                  className="product-image__main-img"
                  priority={index === 0}
                  quality={90}
                />
                
                {/* Badges */}
                {index === 0 && (
                  <div className="product-image__badges">
                    {image.isPrimary && (
                      <span className="badge bg-primary">Featured</span>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Action Buttons */}
        <div className="product-image__actions">
          <button
            onClick={handleZoomToggle}
            className="product-image__action-btn product-image__action-btn--zoom"
            aria-label="Zoom image"
            title="Zoom"
          >
            <i className="fi fi-rr-search-alt"></i>
          </button>
          
          <button
            onClick={onWishlistToggle}
            className={`product-image__action-btn product-image__action-btn--wishlist ${
              isWishlisted ? 'product-image__action-btn--active' : ''
            }`}
            aria-label="Add to wishlist"
            title="Add to Wishlist"
          >
            <i className={isWishlisted ? 'fi fi-ss-heart' : 'fi fi-rr-heart'}></i>
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery Swiper */}
      {images.length > 1 && (
        <div className="product-image__thumbnails">
          <Swiper
            modules={[FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            className="product-image__thumbnails-swiper"
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id || index}>
                <div className="product-image__thumbnail">
                  <Image
                    src={image.url}
                    alt={image.alt || `${productName} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="product-image__thumbnail-img"
                    quality={70}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="product-image__zoom-modal" 
          onClick={handleZoomToggle}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <div className="product-image__zoom-content">
            <button 
              className="product-image__zoom-close" 
              onClick={handleZoomToggle}
              aria-label="Close zoom"
            >
              ×
            </button>
            <Image
              src={images[selectedImage]?.url || '/placeholder.jpg'}
              alt={images[selectedImage]?.alt || productName}
              width={1200}
              height={1200}
              className="product-image__zoom-img"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;