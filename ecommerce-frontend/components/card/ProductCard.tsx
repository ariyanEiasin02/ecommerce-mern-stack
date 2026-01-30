"use client";
import Image from "next/image";
import React, { useState } from "react";
import SoldBar from "./SoldBar";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  isTrending?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  images,
  isTrending = false,
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
    setCurrentImageIndex(0); // optional reset
  };

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
        <div className="product-image-container">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${name} image ${index + 1}`}
              width={400}
              height={500}
              className={`product-image ${
                currentImageIndex === index ? "active" : ""
              }`}
              priority={index === 0}
            />
          ))}
        </div>

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
            ❤
          </button>
          <button className="action-btn quickview-btn" aria-label="Quick view">
            ⤢
          </button>
          <button className="action-btn compare-btn" aria-label="Compare">
            ⇄
          </button>
          <button className="action-btn addtocart-btn" aria-label="Add to cart">
            🛒
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
        <h3 className="product-name">{name}</h3>
          <SoldBar sold={750} total={1000} />
      </div>
    </div>
  );
};

export default ProductCard;
