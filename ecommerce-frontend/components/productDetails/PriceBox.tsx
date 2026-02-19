'use client';

import React from 'react';

interface PriceBoxProps {
  price: number;
  originalPrice?: number;
  currency: string;
  soldCount?: number;
  rating?: number;
  reviewCount?: number;
}

const PriceBox: React.FC<PriceBoxProps> = ({
  price,
  originalPrice,
  currency,
  soldCount,
  rating,
  reviewCount,
}) => {
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  /**
   * Format number to Indonesian Rupiah style: Rp187.500
   * Uses id-ID locale for the period thousand-separator, then strips any
   * extra whitespace that Intl injects between the currency symbol and digits.
   */
  const formatPrice = (value: number): string => {
    if (currency === 'Rp' || currency === 'IDR') {
      // toLocaleString('id-ID') → "187.500"  (period = thousand sep, no decimal)
      const formatted = value.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `Rp${formatted}`;
    }
    // Fallback for other currencies
    return `${currency}${value.toFixed(2)}`;
  };

  const renderStars = (r: number) =>
    [...Array(5)].map((_, i) => (
      <svg
        key={i}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={i < Math.round(r) ? '#f59e0b' : 'none'}
        stroke="#f59e0b"
        strokeWidth="2"
        className="pb-star"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));

  return (
    <div className="price-box">
      {/* ── Sold · Stars · Review count ── */}
      {(soldCount !== undefined || rating !== undefined) && (
        <div className="price-box__meta">
          {soldCount !== undefined && (
            <span className="price-box__sold">
              {soldCount >= 1000
                ? `${Math.floor(soldCount / 1000)}K+`
                : soldCount.toLocaleString()}{' '}
              Sold
            </span>
          )}

          {rating !== undefined && (
            <>
              <span className="price-box__dot" aria-hidden="true">•</span>
              <span
                className="price-box__stars"
                aria-label={`Rating ${rating.toFixed(1)} out of 5`}
              >
                {renderStars(rating)}
              </span>
              <strong className="price-box__rating-val">{rating.toFixed(1)}</strong>
            </>
          )}

          {reviewCount !== undefined && (
            <>
              <span className="price-box__dot" aria-hidden="true">•</span>
              <span className="price-box__review-count">
                {reviewCount.toLocaleString()} Reviews
              </span>
            </>
          )}
        </div>
      )}

      {/* ── Current price ── */}
      <div className="price-box__current" aria-label={`Price: ${formatPrice(price)}`}>
        {formatPrice(price)}
      </div>

      {/* ── Original price + discount badge (same line) ── */}
      {originalPrice && originalPrice > price && (
        <div className="price-box__row">
          <s className="price-box__original">
            {formatPrice(originalPrice)}
          </s>
          <span className="price-box__badge">
            {discountPct}% off
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceBox;
