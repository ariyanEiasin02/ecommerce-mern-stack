# 🎯 Quick Reference - Flaticons & Swiper Usage

## 📍 Flaticons Reference

### Available Icon Styles:
- `fi-rr-*` - Regular (outline)
- `fi-ss-*` - Solid (filled)
- `fi-rs-*` - Rounded

### Product Details Icons Used:

#### ⭐ Ratings & Reviews
```html
<!-- Filled star -->
<i className="fi fi-ss-star"></i>

<!-- Empty star -->
<i className="fi fi-rr-star"></i>
```

#### 🛒 Shopping Actions
```html
<!-- Shopping cart -->
<i className="fi fi-rr-shopping-cart"></i>

<!-- Heart (empty) -->
<i className="fi fi-rr-heart"></i>

<!-- Heart (filled) -->
<i className="fi fi-ss-heart"></i>

<!-- Check/verified -->
<i className="fi fi-rr-check"></i>
```

#### 🚚 Product Features
```html
<!-- Truck/shipping -->
<i className="fi fi-rr-truck-side"></i>

<!-- Refresh/returns -->
<i className="fi fi-rr-refresh"></i>

<!-- Shield/security -->
<i className="fi fi-rr-shield-check"></i>

<!-- Search/zoom -->
<i className="fi fi-rr-search-alt"></i>
```

#### 👍 Social Actions
```html
<!-- Thumbs up -->
<i className="fi fi-rr-thumbs-up"></i>

<!-- Share -->
<i className="fi fi-rr-share"></i>

<!-- Link -->
<i className="fi fi-rr-link"></i>
```

### 🎨 Styling Flaticons

```scss
// Size
i {
  font-size: 1.5rem; // Adjust as needed
}

// Color
i {
  color: #0d6efd; // Primary blue
}

// Gold stars
.fi-ss-star {
  color: #ffc107;
}

// Empty stars
.fi-rr-star {
  color: #dee2e6;
}
```

---

## 🎢 Swiper.js Reference

### Basic Setup

```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

### Product Image Gallery Pattern

```tsx
const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

// Main Swiper
<Swiper
  modules={[Navigation, Thumbs]}
  thumbs={{ swiper: thumbsSwiper }}
  navigation
>
  {images.map((img) => (
    <SwiperSlide key={img.id}>
      <Image src={img.url} alt={img.alt} />
    </SwiperSlide>
  ))}
</Swiper>

// Thumbs Swiper
<Swiper
  modules={[FreeMode, Thumbs]}
  onSwiper={setThumbsSwiper}
  slidesPerView={4}
  freeMode
  watchSlidesProgress
>
  {images.map((img) => (
    <SwiperSlide key={img.id}>
      <Image src={img.url} alt={img.alt} />
    </SwiperSlide>
  ))}
</Swiper>
```

### Product Carousel Pattern

```tsx
<Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={20}
  slidesPerView={1}
  navigation
  pagination={{ clickable: true }}
  autoplay={{ delay: 3500 }}
  breakpoints={{
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  }}
>
  {products.map((product) => (
    <SwiperSlide key={product.id}>
      <ProductCard product={product} />
    </SwiperSlide>
  ))}
</Swiper>
```

### Common Swiper Options

```typescript
// Navigation arrows
navigation={true}

// Pagination dots
pagination={{ clickable: true }}

// Auto-play
autoplay={{
  delay: 3500,
  disableOnInteraction: false,
}}

// Loop mode
loop={true}

// Spacing between slides
spaceBetween={20}

// Speed (ms)
speed={600}

// Free mode (for thumbnails)
freeMode={true}

// Responsive breakpoints
breakpoints={{
  320: { slidesPerView: 1 },
  640: { slidesPerView: 2 },
  1024: { slidesPerView: 4 },
}}
```

---

## 🎨 Custom Swiper Styling

### Navigation Buttons

```scss
.swiper-button-next,
.swiper-button-prev {
  width: 44px;
  height: 44px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &::after {
    font-size: 18px;
    font-weight: 700;
    color: #212529;
  }

  &:hover {
    background-color: #0d6efd;
    
    &::after {
      color: white;
    }
  }
}
```

### Pagination Dots

```scss
.swiper-pagination {
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background-color: #dee2e6;
    opacity: 1;

    &-active {
      background-color: #0d6efd;
      width: 24px;
      border-radius: 5px;
    }
  }
}
```

### Thumbnail Active State

```scss
.swiper-slide-thumb-active {
  .product-image__thumbnail {
    border-color: #0d6efd;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
  }
}
```

---

## 🔍 Common Patterns

### 1. Star Rating Component

```tsx
const StarRating = ({ rating }: { rating: number }) => (
  <div className="star-rating">
    {[...Array(5)].map((_, index) => (
      <i
        key={index}
        className={
          index < Math.floor(rating) 
            ? 'fi fi-ss-star' 
            : 'fi fi-rr-star'
        }
      ></i>
    ))}
  </div>
);

// CSS
.star-rating {
  display: flex;
  gap: 0.25rem;
  
  i {
    font-size: 1rem;
    
    &.fi-ss-star {
      color: #ffc107; // Gold
    }
    
    &.fi-rr-star {
      color: #dee2e6; // Gray
    }
  }
}
```

### 2. Action Button with Icon

```tsx
<button className="action-btn">
  <i className="fi fi-rr-shopping-cart"></i>
  <span>Add to Cart</span>
</button>

// CSS
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1.25rem;
  }
}
```

### 3. Feature List

```tsx
<div className="feature">
  <i className="fi fi-rr-truck-side"></i>
  <div>
    <strong>Free Shipping</strong>
    <span>Delivery in 2-3 days</span>
  </div>
</div>

// CSS
.feature {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
  i {
    font-size: 1.5rem;
    color: #0d6efd;
    flex-shrink: 0;
  }
}
```

### 4. Wishlist Toggle

```tsx
const [isWishlisted, setIsWishlisted] = useState(false);

<button 
  onClick={() => setIsWishlisted(!isWishlisted)}
  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
>
  <i className={isWishlisted ? 'fi fi-ss-heart' : 'fi fi-rr-heart'}></i>
</button>

// CSS
.wishlist-btn {
  i {
    transition: all 0.3s ease;
  }
  
  &.active {
    background-color: #dc3545;
    
    i {
      color: white;
    }
  }
}
```

---

## 📱 Responsive Swiper

### Mobile-First Approach

```tsx
<Swiper
  breakpoints={{
    // Mobile (default)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Tablet
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    // Desktop
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }}
>
```

### Touch Gestures

```typescript
// Enable touch gestures (default: true)
touchRatio={1}
touchAngle={45}
simulateTouch={true}

// Prevent clicks during swipe
preventClicksPropagation={true}
preventClicks={true}
```

---

## 🎯 Best Practices

### Icons
✅ Use solid (`fi-ss-*`) for active states
✅ Use regular (`fi-rr-*`) for inactive states
✅ Keep consistent sizing (1rem - 1.5rem)
✅ Add proper color contrast
✅ Use semantic meaning

### Swiper
✅ Use Navigation for image galleries
✅ Use Autoplay for product showcases
✅ Set appropriate delays (3-5 seconds)
✅ Add loop for infinite scroll
✅ Use FreeMode for thumbnails
✅ Add keyboard navigation
✅ Enable touch gestures on mobile

### Performance
✅ Use `next/image` for optimization
✅ Lazy load images
✅ Limit autoplay speed
✅ Clean up Swiper instances
✅ Use CSS animations over JS

---

## 🔧 Troubleshooting

### Icons Not Showing?
Check if Flaticons CDN is loaded in `layout.tsx`:
```html
<link rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons/css/all/all.css" />
```

### Swiper Not Working?
1. Import required modules
2. Import CSS files
3. Check Swiper version (v12+)
4. Verify breakpoints syntax

### Thumbnails Not Syncing?
```typescript
// Correct pattern:
const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

<Swiper
  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
>
```

---

## 📚 Additional Resources

- **Flaticons**: https://www.flaticon.com/uicons
- **Swiper Docs**: https://swiperjs.com/react
- **Next.js Image**: https://nextjs.org/docs/api-reference/next/image

---

**Quick Tip**: All Flaticons follow the pattern `fi fi-{style}-{name}` where style is `rr` (regular), `ss` (solid), or `rs` (rounded).
