'use client';

import React from 'react';
import { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  colors?: ProductVariant[];
  sizes?: ProductVariant[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (value: string) => void;
  onSizeChange: (value: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) => {
  const hasColors = colors && colors.length > 0;
  const hasSizes = sizes && sizes.length > 0;

  if (!hasColors && !hasSizes) return null;

  return (
    <div className="variant-selector">
      {/* ── Color Swatches ── */}
      {hasColors && (
        <div className="variant-selector__group">
          <div className="variant-selector__label">
            Color
            {selectedColor && (
              <span className="variant-selector__selected-name">
                {colors!.find((c) => c.value === selectedColor)?.name}
              </span>
            )}
          </div>
          <div className="variant-selector__swatches" role="radiogroup" aria-label="Select color">
            {colors!.map((color) => (
              <button
                key={color.id}
                type="button"
                role="radio"
                aria-checked={selectedColor === color.value}
                aria-label={color.name}
                title={color.name}
                disabled={!color.available}
                onClick={() => color.available && onColorChange(color.value)}
                className={[
                  'variant-selector__swatch',
                  selectedColor === color.value ? 'variant-selector__swatch--active' : '',
                  !color.available ? 'variant-selector__swatch--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ backgroundColor: color.value }}
              >
                {selectedColor === color.value && (
                  <svg
                    className="variant-selector__swatch-check"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Size Buttons ── */}
      {hasSizes && (
        <div className="variant-selector__group">
          <div className="variant-selector__label">
            Select Size
            <a href="#size-guide" className="variant-selector__size-guide">
              Size Guide
            </a>
          </div>
          <div className="variant-selector__sizes" role="radiogroup" aria-label="Select size">
            {sizes!.map((size) => (
              <button
                key={size.id}
                type="button"
                role="radio"
                aria-checked={selectedSize === size.value}
                aria-label={`Size ${size.value}${!size.available ? ', unavailable' : ''}`}
                disabled={!size.available}
                onClick={() => size.available && onSizeChange(size.value)}
                className={[
                  'variant-selector__size-btn',
                  selectedSize === size.value ? 'variant-selector__size-btn--active' : '',
                  !size.available ? 'variant-selector__size-btn--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
