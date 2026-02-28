"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import SoldBar from "./SoldBar";

interface ProductCardProps {
  id?: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  isTrending?: boolean;
  soldCount?: number;
  rating?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  name,
  price,
  originalPrice,
  discount,
  images,
  isTrending = false,
  soldCount,
  rating,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev < images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const productLink = slug ? `/product/${slug}` : '#';
  const displayImages = images.length > 0 ? images : ['/hero1.webp'];

  return (
    <div
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-wrapper">
        {/* Discount Badge */}
        {discount && <div className="discount-badge">{discount}%</div>}

        {/* Trending Badge */}
        {isTrending && <div className="trending-badge">TRENDING</div>}

        {/* Product Image */}
        <Link href={productLink} className="product-image-container">
          {displayImages.map((img, index) => (
            <Image
              key={index}
              src={img.startsWith('http') || img.startsWith('/') ? img : `http://localhost:5000${img}`}
              alt={`${name} image ${index + 1}`}
              width={400}
              height={500}
              className={`product-image ${
                currentImageIndex === index ? "active" : ""
              }`}
              priority={index === 0}
            />
          ))}
        </Link>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="image-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator-dot ${
                  currentImageIndex === index ? "active" : ""
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="product-actions">
          <button className="action-btn wishlist-btn" aria-label="Wishlist">
            <i className="fi fi-rr-bookmark"></i>
          </button>
          {/* <button className="action-btn quickview-btn" aria-label="Quick view">
            ⤢
          </button>
          <button className="action-btn compare-btn" aria-label="Compare">
            ⇄
          </button> */}
          <button className="action-btn addtocart-btn" aria-label="Add to cart">
            <i className="fi fi-rr-shopping-cart-add"></i>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-details">
        <div className="product-price">
          <span className="current-price">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="original-price">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Link href={productLink}>
          <h3 className="product-name">{name}</h3>
        </Link>
        {soldCount !== undefined && soldCount > 0 && (
          <SoldBar sold={soldCount} total={Math.max(soldCount * 1.3, 1000)} />
        )}
        {rating !== undefined && rating > 0 && (
          <div className="product-rating-stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={i < Math.round(rating) ? 'fi fi-ss-star' : 'fi fi-rr-star'}></i>
            ))}
            <span>({rating.toFixed(1)})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
