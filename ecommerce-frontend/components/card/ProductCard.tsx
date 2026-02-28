"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SoldBar from "./SoldBar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  id?: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: (string | { url: string }|{ url: string; alt?: string; isPrimary?: boolean })[];
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
  const [cartAdded, setCartAdded] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = id ? isInWishlist(id) : false;

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    await addToCart(id, 1);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1800);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    await toggleWishlist(id);
  };

  const productLink = slug ? `/product/${slug}` : '#';
  // Normalize images: backend returns objects { url, alt }, old data may be strings
  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? img : img.url
  );
  const displayImages = normalizedImages.length > 0 ? normalizedImages : ['/hero1.webp'];

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
            {normalizedImages.map((_, index) => (
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
          <button
            className={`action-btn wishlist-btn${inWishlist ? ' active' : ''}`}
            aria-label="Wishlist"
            onClick={handleWishlist}
          >
            <i className={inWishlist ? 'fi fi-ss-bookmark' : 'fi fi-rr-bookmark'}></i>
          </button>
          <button
            className="action-btn addtocart-btn"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <i className={cartAdded ? 'fi fi-rr-check' : 'fi fi-rr-shopping-cart-add'}></i>
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
