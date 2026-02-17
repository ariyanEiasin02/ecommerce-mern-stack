# Product Details Page - Component Architecture

## 🏗️ Component Hierarchy

```
📄 page.tsx (/product/[slug])
│
├─ 🍞 Breadcrumb
│   └─ Home > Shop > Category > Product Name
│
├─ 📦 ProductBanner
│   ├─ 🖼️ ProductImage (Left Column)
│   │   ├─ Main Image Display
│   │   │   ├─ Full-size image
│   │   │   ├─ Zoom button
│   │   │   ├─ Wishlist button
│   │   │   └─ Product badges
│   │   ├─ Thumbnail Gallery
│   │   │   └─ 4+ clickable thumbnails
│   │   └─ Zoom Modal (conditional)
│   │       └─ Full-screen image viewer
│   │
│   └─ 📝 ProductContent (Right Column)
│       ├─ Brand & SKU
│       ├─ Product Title (H1)
│       ├─ Rating & Reviews
│       ├─ Short Description
│       ├─ Price Section
│       │   ├─ Current price
│       │   ├─ Original price (strikethrough)
│       │   ├─ Discount badge
│       │   └─ Stock status alert
│       ├─ Variants
│       │   ├─ Size selector
│       │   └─ Color picker
│       ├─ Quantity Selector
│       │   ├─ Decrease button
│       │   ├─ Quantity input
│       │   └─ Increase button
│       ├─ Action Buttons
│       │   ├─ Add to Cart (primary)
│       │   └─ Wishlist (secondary)
│       ├─ Features Section
│       │   ├─ Free Shipping
│       │   ├─ 30 Day Returns
│       │   └─ Secure Payment
│       └─ Product Tags
│
├─ 📑 ProductTabs
│   ├─ Tab Navigation
│   │   ├─ Description
│   │   ├─ Specifications
│   │   └─ Reviews
│   └─ Tab Content
│       ├─ Description Panel
│       │   ├─ Rich HTML content
│       │   └─ Key features list
│       ├─ Specifications Panel
│       │   └─ Technical specs table
│       └─ Reviews Panel
│           ├─ Rating Summary
│           │   ├─ Overall score
│           │   └─ Rating distribution
│           └─ Reviews List
│               └─ Individual reviews
│                   ├─ User info
│                   ├─ Rating stars
│                   ├─ Review text
│                   ├─ Review images
│                   └─ Helpful button
│
└─ 🔗 RelatedProducts
    └─ Product Grid (4 columns)
        └─ Product Cards (4-8 items)
            ├─ Product image
            ├─ Quick add button
            ├─ Product badges
            ├─ Category
            ├─ Product name
            ├─ Rating
            ├─ Price
            └─ Stock warning
```

## 🎨 Visual Layout (Desktop View)

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Shop > Electronics > Headphones             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────┐  ┌────────────────────────────┐  │
│  │                          │  │  Brand: AudioTech          │  │
│  │                          │  │  ★★★★★ 4.7 (328 reviews)  │  │
│  │    Main Product Image    │  │                            │  │
│  │       [600x600]          │  │  Premium Wireless          │  │
│  │                          │  │  Headphones                │  │
│  │   [🔍 Zoom] [❤️ Like]    │  │                            │  │
│  │                          │  │  💰 $299.99  ~~$399.99~~  │  │
│  └──────────────────────────┘  │  🏷️ -25%                   │  │
│                                 │  ✅ In Stock               │  │
│  [📷] [📷] [📷] [📷]           │                            │  │
│  Thumbnails                     │  Size: [ M ] [ L ] [XL]    │  │
│                                 │  Color: ⚫ ⚪ 🔵          │  │
│                                 │                            │  │
│                                 │  Quantity: [➖][2][➕]      │  │
│                                 │                            │  │
│                                 │  [🛒 Add to Cart] [❤️]     │  │
│                                 │                            │  │
│                                 │  🚚 Free Shipping          │  │
│                                 │  🔄 30 Day Returns         │  │
│                                 │  🛡️ Secure Payment         │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Description] [Specifications] [Reviews (328)]                  │
│  ───────────────────────────────────────────────────────────     │
│                                                                   │
│  Experience superior sound quality...                            │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit...      │
│                                                                   │
│  Key Features:                                                    │
│  ✅ Active Noise Cancellation                                    │
│  ✅ 30 Hour Battery Life                                         │
│  ✅ Bluetooth 5.0                                                │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Related Products                                                 │
│  Customers who viewed this item also viewed                      │
│                                                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │ 📷   │  │ 📷   │  │ 📷   │  │ 📷   │                        │
│  │ Prod │  │ Prod │  │ Prod │  │ Prod │                        │
│  │ $99  │  │ $149 │  │ $199 │  │ $249 │                        │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Mobile Layout

```
┌──────────────────────────────┐
│  Breadcrumb (collapsed)      │
├──────────────────────────────┤
│                              │
│    ┌──────────────────┐      │
│    │                  │      │
│    │  Product Image   │      │
│    │   [Full Width]   │      │
│    │                  │      │
│    └──────────────────┘      │
│    [📷] [📷] [📷] [📷]       │
│                              │
├──────────────────────────────┤
│  Brand: AudioTech            │
│  Premium Wireless            │
│  Headphones                  │
│  ★★★★★ 4.7                  │
│                              │
│  $299.99 ~~$399.99~~ -25%   │
│  ✅ In Stock                 │
│                              │
│  Size: [M] [L] [XL]          │
│  Color: ⚫ ⚪ 🔵            │
│  Qty: [➖][2][➕]            │
│                              │
│  ┌────────────────────┐      │
│  │  🛒 Add to Cart    │      │
│  └────────────────────┘      │
│  ┌────────────────────┐      │
│  │  ❤️ Wishlist       │      │
│  └────────────────────┘      │
│                              │
│  🚚 Free Shipping            │
│  🔄 30 Day Returns           │
│  🛡️ Secure Payment           │
│                              │
├──────────────────────────────┤
│  [Description] [Specs] [★]   │
│  ──────────────────────       │
│  Content here...             │
│                              │
├──────────────────────────────┤
│  Related Products            │
│  ┌────┐ ┌────┐              │
│  │📷 │ │📷 │              │
│  └────┘ └────┘              │
│  ┌────┐ ┌────┐              │
│  │📷 │ │📷 │              │
│  └────┘ └────┘              │
└──────────────────────────────┘
```

## 🎯 Data Flow

```
API/Database
     ↓
getProduct(slug)
     ↓
Product Data (TypeScript typed)
     ↓
     ├→ ProductBanner
     │   ├→ ProductImage
     │   │   • images[]
     │   │   • productName
     │   └→ ProductContent
     │       • product (all data)
     │       • onAddToCart callback
     │       • onWishlist callback
     │
     ├→ ProductTabs
     │   • product.description
     │   • product.specifications
     │   • product.reviews
     │
     └→ RelatedProducts
         • relatedProducts[]
```

## 🔄 User Interactions

```
User Action              →  Component               →  Result
─────────────────────────────────────────────────────────────────
Click thumbnail          →  ProductImage            →  Change main image
Click zoom              →  ProductImage            →  Open zoom modal
Click wishlist          →  ProductImage/Content    →  Toggle wishlist
Select size             →  ProductContent          →  Update selection
Select color            →  ProductContent          →  Update selection
Change quantity         →  ProductContent          →  Update quantity
Click Add to Cart       →  ProductContent          →  Add to cart + animation
Click tab               →  ProductTabs             →  Switch tab content
Click helpful           →  ProductTabs (Review)    →  Increment helpful count
Click related product   →  RelatedProducts         →  Navigate to product
Quick add               →  RelatedProducts         →  Add to cart (modal)
```

## 📦 Component Props

### ProductImage
```typescript
{
  images: ProductImage[];
  productName: string;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}
```

### ProductContent
```typescript
{
  product: Product;
  onAddToCart?: (qty: number, size?: string, color?: string) => void;
  onAddToWishlist?: () => void;
}
```

### ProductTabs
```typescript
{
  product: Product;
}
```

### RelatedProducts
```typescript
{
  products: Product[];
  title?: string;
}
```

## 🎨 Styling Structure (BEM)

```
_productDetails.scss
├─ .product-page
├─ .product-image
│  ├─ .product-image__main
│  ├─ .product-image__thumbnail
│  ├─ .product-image__thumbnail--active
│  └─ .product-image__zoom-modal
├─ .product-content
│  ├─ .product-content__title
│  ├─ .product-content__price
│  ├─ .product-content__size-btn
│  ├─ .product-content__size-btn--active
│  └─ .product-content__add-to-cart
├─ .product-tabs
│  ├─ .product-tabs__nav
│  ├─ .product-tabs__pane
│  └─ .product-tabs__review-item
└─ .related-products
   ├─ .related-products__card
   └─ .related-products__quick-add
```

---

**This architecture ensures:**
- ✅ Component reusability
- ✅ Clean separation of concerns
- ✅ Easy maintenance and updates
- ✅ Scalable structure
- ✅ Type safety with TypeScript
- ✅ Responsive design at every level
