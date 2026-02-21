'use client';

import React, { useState } from 'react';

interface ProductActionsProps {
  productId: string;
  productName: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  stock: number;
  selectedSize?: string;
  selectedColor?: string;
  onBuyNow?: (qty: number, size?: string, color?: string) => void;
  onAddToCart?: (qty: number, size?: string, color?: string) => void;
  onAddToWishlist?: () => void;
  onShare?: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  productId,
  availability,
  stock,
  selectedSize,
  selectedColor,
  onBuyNow,
  onAddToCart,
  onAddToWishlist,
  onShare,
}) => {
  const [qty, setQty] = useState(1);
  const [cartFeedback, setCartFeedback] = useState(false);

  const isOutOfStock = availability === 'out_of_stock' || stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart?.(qty, selectedSize, selectedColor);
    setCartFeedback(true);
    setTimeout(() => setCartFeedback(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onBuyNow?.(qty, selectedSize, selectedColor);
  };

  const handleShare = () => {
    if (onShare) return onShare();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: document.title, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* ── Quantity selector ── */}
      <div className="product-actions__qty-row">
        <span className="product-actions__qty-label">Qty:</span>
        <div className="product-actions__qty-ctrl">
          <button
            type="button"
            className="product-actions__qty-btn"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="product-actions__qty-val" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="product-actions__qty-btn"
            aria-label="Increase quantity"
            disabled={qty >= stock}
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
          >
            +
          </button>
        </div>
        {availability === 'low_stock' && (
          <span className="product-actions__low-stock">Only {stock} left!</span>
        )}
      </div>

      {/* ── Sticky mobile CTA ── */}
      <div className="product-actions__sticky d-flex d-lg-none" role="complementary" aria-label="Quick purchase actions">
        <button
          type="button"
          className="product-actions__sticky-cart btn flex-grow-1"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {cartFeedback ? '✓ Added to Bag' : isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>
    </>
  );
};

export default ProductActions;
