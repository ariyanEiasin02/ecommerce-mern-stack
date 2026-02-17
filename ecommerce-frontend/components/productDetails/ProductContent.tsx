'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types/product';

interface ProductContentProps {
  product: Product;
  onAddToCart?: (quantity: number, size?: string, color?: string) => void;
  onAddToWishlist?: () => void;
}

const ProductContent: React.FC<ProductContentProps> = ({
  product,
  onAddToCart,
  onAddToWishlist
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getStockStatus = () => {
    if (product.availability === 'out_of_stock') {
      return { text: 'Out of Stock', className: 'danger' };
    } else if (product.availability === 'low_stock' || product.stock < 10) {
      return { text: `Only ${product.stock} left!`, className: 'warning' };
    } else if (product.availability === 'pre_order') {
      return { text: 'Pre-Order', className: 'info' };
    }
    return { text: 'In Stock', className: 'success' };
  };

  const stockStatus = getStockStatus();

  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    if (action === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity, selectedSize, selectedColor);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="product-content">
      {/* Brand */}
      {product.brand && (
        <div className="product-content__brand">
          <span className="text-muted">Brand: </span>
          <a href={`/brands/${product.brand}`} className="product-content__brand-link">
            {product.brand}
          </a>
        </div>
      )}

      {/* Product Title */}
      <h1 className="product-content__title">{product.name}</h1>

      {/* Rating & Reviews */}
      <div className="product-content__rating">
        <div className="product-content__stars">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={index < Math.floor(product.rating) ? 'fi fi-ss-star' : 'fi fi-rr-star'}
            ></i>
          ))}
        </div>
        <span className="product-content__rating-text">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="product-content__description">{product.shortDescription}</p>
      )}

      {/* Price Section */}
      <div className="product-content__price-section">
        <div className="product-content__price-wrapper">
          <span className="product-content__price">
            {product.currency} {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <>
              <span className="product-content__original-price">
                {product.currency} {product.originalPrice.toFixed(2)}
              </span>
              <span className="product-content__discount-badge badge bg-danger">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>
        
        {/* Stock Status */}
        <div className={`product-content__stock alert alert-${stockStatus.className} mb-0`}>
          <i className="fi fi-rr-check"></i>
          {stockStatus.text}
        </div>
      </div>

      {/* SKU */}
      <div className="product-content__sku">
        <span className="text-muted">SKU: </span>
        <span>{product.sku}</span>
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="product-content__variants">
          <label className="product-content__variant-label">
            Size: {selectedSize && <strong>{selectedSize}</strong>}
          </label>
          <div className="product-content__size-options">
            {product.sizes.map((size: ProductVariant) => (
              <button
                key={size.id}
                onClick={() => handleSizeSelect(size.value)}
                disabled={!size.available}
                className={`product-content__size-btn ${
                  selectedSize === size.value ? 'product-content__size-btn--active' : ''
                } ${!size.available ? 'product-content__size-btn--disabled' : ''}`}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="product-content__variants">
          <label className="product-content__variant-label">
            Color: {selectedColor && <strong>{selectedColor}</strong>}
          </label>
          <div className="product-content__color-options">
            {product.colors.map((color: ProductVariant) => (
              <button
                key={color.id}
                onClick={() => handleColorSelect(color.value)}
                disabled={!color.available}
                className={`product-content__color-btn ${
                  selectedColor === color.value ? 'product-content__color-btn--active' : ''
                } ${!color.available ? 'product-content__color-btn--disabled' : ''}`}
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
                title={color.name}
              >
                {selectedColor === color.value && <i className="fi fi-rr-check"></i>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="product-content__quantity">
        <label className="product-content__quantity-label">Quantity:</label>
        <div className="product-content__quantity-selector">
          <button
            onClick={() => handleQuantityChange('decrement')}
            className="product-content__quantity-btn"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="product-content__quantity-input"
            aria-label="Quantity"
          />
          <button
            onClick={() => handleQuantityChange('increment')}
            className="product-content__quantity-btn"
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-content__actions">
        <button
          onClick={handleAddToCart}
          disabled={product.availability === 'out_of_stock' || isAddedToCart}
          className={`btn product-content__add-to-cart ${
            isAddedToCart ? 'btn-success' : 'btn-primary'
          }`}
        >
          {isAddedToCart ? (
            <>
              <i className="fi fi-rr-check me-2"></i>
              Added to Cart
            </>
          ) : (
            <>
              <i className="fi fi-rr-shopping-cart me-2"></i>
              Add to Cart
            </>
          )}
        </button>
        
        <button
          onClick={onAddToWishlist}
          className="btn btn-outline-secondary product-content__wishlist-btn"
          aria-label="Add to wishlist"
        >
          <i className="fi fi-rr-heart"></i>
        </button>
      </div>

      {/* Product Features */}
      <div className="product-content__features">
        {product.shipping.freeShipping && (
          <div className="product-content__feature">
            <i className="fi fi-rr-truck-side product-content__feature-icon"></i>
            <div className="product-content__feature-text">
              <strong>Free Shipping</strong>
              <span>Estimated delivery: {product.shipping.estimatedDays}</span>
            </div>
          </div>
        )}
        
        <div className="product-content__feature">
          <i className="fi fi-rr-refresh product-content__feature-icon"></i>
          <div className="product-content__feature-text">
            <strong>30 Day Returns</strong>
            <span>Easy returns within 30 days</span>
          </div>
        </div>
        
        <div className="product-content__feature">
          <i className="fi fi-rr-shield-check product-content__feature-icon"></i>
          <div className="product-content__feature-text">
            <strong>Secure Payment</strong>
            <span>100% secure payment</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="product-content__tags">
          <span className="text-muted me-2">Tags:</span>
          {product.tags.map((tag, index) => (
            <a key={index} href={`/tags/${tag}`} className="product-content__tag badge bg-light text-dark">
              {tag}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductContent;
