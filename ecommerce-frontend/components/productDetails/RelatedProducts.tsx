'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Product } from '@/types/product';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  products, 
  title = 'Related Products' 
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={index < Math.floor(rating) ? 'fi fi-ss-star' : 'fi fi-rr-star'}
      ></i>
    ));
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section className="related-products">
      <div className="container">
        <div className="related-products__header">
          <h2 className="related-products__title">{title}</h2>
          <p className="related-products__subtitle">
            Customers who viewed this item also viewed
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="related-products__swiper"
        >
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            
            return (
              <SwiperSlide key={product.id}>
                <div className="related-products__card">
                  <Link 
                    href={`/product/${product.slug}`} 
                    className="related-products__card-link"
                  >
                    {/* Product Image */}
                    <div className="related-products__image-wrapper">
                      <Image
                        src={product.images[0]?.url || '/placeholder.jpg'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="related-products__image"
                        quality={80}
                      />
                      
                      {/* Badges */}
                      <div className="related-products__badges">
                        {discount > 0 && (
                          <span className="badge bg-danger related-products__badge">
                            -{discount}%
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="badge bg-success related-products__badge">
                            New
                          </span>
                        )}
                        {product.bestseller && (
                          <span className="badge bg-warning text-dark related-products__badge">
                            Bestseller
                          </span>
                        )}
                      </div>

                      {/* Quick Add to Cart */}
                      <button 
                        className="related-products__quick-add"
                        aria-label="Quick add to cart"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle quick add to cart
                        }}
                      >
                        <i className="fi fi-rr-shopping-cart"></i>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="related-products__info">
                      {/* Category */}
                      {product.category && (
                        <span className="related-products__category">
                          {product.category}
                        </span>
                      )}

                      {/* Product Name */}
                      <h3 className="related-products__name">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="related-products__rating">
                        <div className="related-products__stars">
                          {renderStars(product.rating)}
                        </div>
                        <span className="related-products__rating-text">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="related-products__price">
                        <span className="related-products__current-price">
                          {product.currency} {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="related-products__original-price">
                            {product.currency} {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.availability === 'low_stock' && (
                        <span className="related-products__stock-warning">
                          Only {product.stock} left!
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default RelatedProducts;
