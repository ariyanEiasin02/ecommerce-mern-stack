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

      {/* ── CTA buttons ── */}
      <div className="product-actions__ctas">
        <button
          type="button"
          className="product-actions__buy-btn btn"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy this Item'}
        </button>

        <button
          type="button"
          className={`product-actions__cart-btn btn${cartFeedback ? ' product-actions__cart-btn--added' : ''}`}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {cartFeedback ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              &nbsp;Added!
            </>
          ) : (
            'Add to Bag'
          )}
        </button>
      </div>

      {/* ── Secondary actions ── */}
      <div className="product-actions__secondary">
        <button
          type="button"
          className="product-actions__action-link"
          onClick={() => {/* open chat */}}
          aria-label="Chat with seller"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat
        </button>

        <button
          type="button"
          className="product-actions__action-link"
          onClick={onAddToWishlist}
          aria-label="Add to wishlist"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Wishlist
        </button>

        <button
          type="button"
          className="product-actions__action-link"
          onClick={handleShare}
          aria-label="Share product"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
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
