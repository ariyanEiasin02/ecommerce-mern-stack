/**
 * Product Types & Interfaces
 * Professional E-Commerce Type Definitions
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  available: boolean;
  price?: number;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductShipping {
  freeShipping: boolean;
  estimatedDays: string;
  cost?: number;
}

export interface ProductSeller {
  id: string;
  name: string;
  verified?: boolean;
  rating?: number;   // percentage e.g. 96
  location?: string;
  chatReply?: number; // percentage e.g. 98
  avatarUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  
  // Inventory
  stock: number;
  sku: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  
  // Media
  images: ProductImage[];
  video?: string;
  
  // Ratings & Reviews
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  
  // Categories & Tags
  category: string;
  subcategory?: string;
  brand?: string;
  tags?: string[];
  
  // Variants
  sizes?: ProductVariant[];
  colors?: ProductVariant[];
  
  // Specifications
  specifications?: ProductSpecification[];
  
  // Shipping & Delivery
  shipping: ProductShipping;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Additional
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  relatedProducts?: string[];
  soldCount?: number;
  seller?: ProductSeller;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
