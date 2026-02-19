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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;