'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductBanner from '@/components/productDetails/ProductBanner';
import ProductTabs from '@/components/productDetails/ProductTabs';
import RelatedProducts from '@/components/productDetails/RelatedProducts';
import { Product } from '@/types/product';
import { productService, ApiProduct } from '@/services/productService';
import { reviewService } from '@/services/reviewService';

function mapApiToProduct(api: ApiProduct, reviews: any[] = []): Product {
  const categoryName = typeof api.category === 'object' ? api.category.name : '';
  const categorySlug = typeof api.category === 'object' ? api.category.slug : '';

  // Map variants to sizes/colors
  const sizeVariants = api.variants?.filter((v) => v.type.toLowerCase() === 'size') || [];
  const colorVariants = api.variants?.filter((v) => v.type.toLowerCase() === 'color') || [];

  const originalPrice = api.discount > 0 ? api.price : undefined;
  const discountedPrice = api.discount > 0 ? api.price - (api.price * api.discount / 100) : api.price;

  return {
    id: api._id,
    slug: api.slug,
    name: api.title,
    description: api.description,
    shortDescription: api.description.substring(0, 200),
    price: discountedPrice,
    originalPrice,
    discount: api.discount,
    currency: '$',
    stock: api.stock,
    sku: api._id.slice(-8).toUpperCase(),
    availability: api.stock > 10 ? 'in_stock' : api.stock > 0 ? 'low_stock' : 'out_of_stock',
    images: api.images.map((img, i) => ({
      id: String(i + 1),
      url: img.url.startsWith('http') || img.url.startsWith('/') ? img.url : `http://localhost:5000${img.url}`,
      alt: img.alt || `${api.title} image ${i + 1}`,
      isPrimary: img.isPrimary || i === 0,
    })),
    rating: api.ratings,
    reviewCount: api.reviewCount,
    reviews: reviews.map((r: any) => ({
      id: r._id,
      userId: r.user?._id || '',
      userName: r.user?.name || 'Anonymous',
      rating: r.rating,
      title: r.title || '',
      comment: r.comment,
      date: r.createdAt,
      verified: true,
      helpful: r.helpful || 0,
    })),
    category: categoryName,
    subcategory: undefined,
    brand: api.brand,
    tags: api.tags,
    sizes: sizeVariants.length > 0 ? sizeVariants.map((v, i) => ({
      id: `s${i}`,
      name: v.label,
      value: v.value,
      available: v.stock > 0,
    })) : undefined,
    colors: colorVariants.length > 0 ? colorVariants.map((v, i) => ({
      id: `c${i}`,
      name: v.label,
      value: v.value,
      available: v.stock > 0,
    })) : undefined,
    specifications: api.specifications?.map((s) => ({
      label: s.key,
      value: s.value,
    })),
    shipping: {
      freeShipping: api.shipping?.freeShipping || false,
      estimatedDays: api.shipping?.estimatedDays ? `${api.shipping.estimatedDays} business days` : '3-5 business days',
    },
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    featured: false,
    soldCount: api.soldCount,
    _categorySlug: categorySlug,
  } as Product & { _categorySlug?: string };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<(Product & { _categorySlug?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const apiProduct = await productService.getProductBySlug(slug);
        let reviews: any[] = [];
        try {
          const reviewRes = await reviewService.getProductReviews(apiProduct._id);
          reviews = reviewRes;
        } catch { /* no reviews */ }
        setProduct(mapApiToProduct(apiProduct, reviews));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <p>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="product-page">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Product', href: '/all-products' },
              { label: product.name },
            ]}
          />
          <ProductBanner product={product} />
        </div>

        <div className="container mt-5">
          <ProductTabs product={product} />
        </div>

        <div className="mt-5 mb-5">
          <RelatedProducts
            categorySlug={product._categorySlug}
            currentProductId={product.id}
          />
        </div>
      </div>
    </React.Fragment>
  );
}