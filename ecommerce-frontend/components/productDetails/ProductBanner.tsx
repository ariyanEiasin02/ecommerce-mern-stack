'use client';

import React from 'react';
import ProductImage from './ProductImage';
import ProductContent from './ProductContent';
import { Product } from '@/types/product';

interface ProductBannerProps {
  product: Product;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ product }) => {
  const handleAddToCart = (quantity: number, size?: string, color?: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', { productId: product.id, quantity, size, color });
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  return (
    <section className="product-banner">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <ProductImage
              images={product.images}
              productName={product.name}
              onWishlistToggle={handleAddToWishlist}
            />
          </div>
          <div className="col-12 col-lg-6">
            <ProductContent
              product={product}
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