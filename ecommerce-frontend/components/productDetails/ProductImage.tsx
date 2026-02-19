'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage as ProductImageType } from '@/types/product';

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
    <div className="product-image-gallery">
      <div className="product-image-gallery__container">
        {/* Vertical Thumbnails - Left Side */}
        {images.length > 1 && (
          <div className="product-image-gallery__thumbnails">
            <div className="product-image-gallery__thumbnails-wrapper">
              {images.map((image, index) => (
                <div
                  key={image.id || index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`product-image-gallery__thumbnail ${
                    selectedImage === index ? 'product-image-gallery__thumbnail--active' : ''
                  }`}
                >
                  <div className="product-image-gallery__thumbnail-inner">
                    <Image
                      src={image.url || '/hero2.webp'}
                      alt={image.alt || `${productName} view ${index + 1}`}
                      width={100}
                      height={100}
                      className="product-image-gallery__thumbnail-img"
                      quality={70}
                    />
                    {/* Video Play Icon Indicator */}
                    {image.url?.includes('video') && (
                      <div className="product-image-gallery__video-indicator">
                        <i className="fi fi-rr-play"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Image Display */}
        <div className="product-image-gallery__main">
          <div className="product-image-gallery__main-bg">
            {/* Gradient Background Circle */}
            <div className="product-image-gallery__gradient-circle"></div>
            
            {/* Main Product Image */}
            <div className="product-image-gallery__main-wrapper">
              <Image
                src={images[selectedImage]?.url || '/hero2.webp'}
                alt={images[selectedImage]?.alt || productName}
                width={700}
                height={700}
                className="product-image-gallery__main-img"
                priority={selectedImage === 0}
                quality={95}
              />
              
              {/* Badges */}
              {images[selectedImage]?.isPrimary && (
                <div className="product-image-gallery__badges">
                  <span className="badge bg-primary">
                    <i className="fi fi-rr-star me-1"></i>
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Top Right */}
            <div className="product-image-gallery__actions">
              <button
                onClick={handleZoomToggle}
                className="product-image-gallery__action-btn product-image-gallery__action-btn--zoom"
                aria-label="Zoom image"
                title="Zoom to full size"
              >
                <i className="fi fi-rr-search-plus"></i>
              </button>
              
              <button
                onClick={onWishlistToggle}
                className={`product-image-gallery__action-btn product-image-gallery__action-btn--wishlist ${
                  isWishlisted ? 'product-image-gallery__action-btn--active' : ''
                }`}
                aria-label="Add to wishlist"
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <i className={isWishlisted ? 'fi fi-ss-heart' : 'fi fi-rr-heart'}></i>
              </button>
            </div>

            {/* Image Counter */}
            <div className="product-image-gallery__counter">
              <span className="product-image-gallery__counter-text">
                {selectedImage + 1} / {images.length}
              </span>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                  className="product-image-gallery__nav product-image-gallery__nav--prev"
                  aria-label="Previous image"
                >
                  <i className="fi fi-rr-angle-left"></i>
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                  className="product-image-gallery__nav product-image-gallery__nav--next"
                  aria-label="Next image"
                >
                  <i className="fi fi-rr-angle-right"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="product-image-gallery__zoom-modal" 
          onClick={handleZoomToggle}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <div className="product-image-gallery__zoom-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="product-image-gallery__zoom-close" 
              onClick={handleZoomToggle}
              aria-label="Close zoom view"
            >
              <i className="fi fi-rr-cross"></i>
            </button>
            <div className="product-image-gallery__zoom-wrapper">
              <Image
                src={images[selectedImage]?.url || '/placeholder.jpg'}
                alt={images[selectedImage]?.alt || productName}
                width={1200}
                height={1200}
                className="product-image-gallery__zoom-img"
                quality={100}
              />
            </div>
            {/* Zoom Navigation */}
            {images.length > 1 && (
              <div className="product-image-gallery__zoom-nav">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
                  }}
                  className="product-image-gallery__zoom-nav-btn"
                >
                  <i className="fi fi-rr-angle-left"></i>
                </button>
                <span className="product-image-gallery__zoom-counter">
                  {selectedImage + 1} / {images.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="product-image-gallery__zoom-nav-btn"
                >
                  <i className="fi fi-rr-angle-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;