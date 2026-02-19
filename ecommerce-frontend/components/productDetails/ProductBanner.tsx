'use client';

import React, { useState } from 'react';
import ProductGallery from './ProductGallery';
import PriceBox from './PriceBox';
import VariantSelector from './VariantSelector';
import ProductActions from './ProductActions';
import { Product } from '@/types/product';

interface ProductBannerProps {
  product: Product;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.find((c) => c.available)?.value ?? ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.find((s) => s.available)?.value ?? ''
  );

  const handleAddToCart = (qty: number, size?: string, color?: string) => {
    console.log('Add to cart:', { productId: product.id, qty, size, color });
  };

  const handleBuyNow = (qty: number, size?: string, color?: string) => {
    console.log('Buy now:', { productId: product.id, qty, size, color });
  };

  const handleAddToWishlist = () => {
    console.log('Add to wishlist:', product.id);
  };

  return (
    <section className="product-banner" aria-label="Product details">
      <div className="row g-4 g-lg-5 align-items-start">
        {/* ── Left: Image Gallery ── */}
        <div className="col-12 col-lg-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* ── Right: Product Info ── */}
        <div className="col-12 col-lg-6">
          <div className="product-info">
            {/* Brand */}
            {product.brand && (
              <p className="product-info__brand">
                <a href={`/brands/${product.brand.toLowerCase()}`} className="product-info__brand-link">
                  {product.brand}
                </a>
              </p>
            )}

            {/* Title – SEO H1 */}
            <h1 className="product-info__title">{product.name}</h1>

            {/* Rating + Price */}
            <PriceBox
              price={product.price}
              originalPrice={product.originalPrice}
              currency={product.currency}
              soldCount={product.soldCount}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            <hr className="product-info__divider" />

            {/* Variant Selectors */}
            <VariantSelector
              colors={product.colors}
              sizes={product.sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
            />

            <hr className="product-info__divider" />

            {/* CTA Buttons + Sticky Mobile */}
            <ProductActions
              productId={product.id}
              productName={product.name}
              availability={product.availability}
              stock={product.stock}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />

            {/* Seller info */}
            {product.seller && (
              <div className="product-info__seller mt-4">
                <div className="product-info__seller-avatar">
                  <span>{product.seller.name.charAt(0)}</span>
                </div>
                <div className="product-info__seller-details">
                  <span className="product-info__seller-name">
                    {product.seller.name}
                    {product.seller.verified && (
                      <svg
                        className="product-info__seller-badge"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#3b82f6"
                        aria-label="Verified seller"
                      >
                        <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" fill="none" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    )}
                  </span>
                  <span className="product-info__seller-status">Online</span>
                </div>
                <div className="product-info__seller-actions">
                  <button type="button" className="product-info__seller-btn">Follow</button>
                  <button type="button" className="product-info__seller-btn product-info__seller-btn--outline">
                    Visit Store
                  </button>
                </div>
              </div>
            )}

            {product.seller && (
              <div className="product-info__seller-stats">
                {product.seller.rating !== undefined && (
                  <span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Rating Store: {product.seller.rating}%
                  </span>
                )}
                {product.seller.location && (
                  <span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {product.seller.location}
                  </span>
                )}
                {product.seller.chatReply !== undefined && (
                  <span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Chat Reply: {product.seller.chatReply}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;