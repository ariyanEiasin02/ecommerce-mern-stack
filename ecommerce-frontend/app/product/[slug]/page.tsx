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
  const sizeVariant = api.variants?.find((v) => v.name.toLowerCase() === 'size');
  const colorVariant = api.variants?.find((v) => v.name.toLowerCase() === 'color');

  return {
    id: api._id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    shortDescription: api.shortDescription || api.description.substring(0, 200),
    price: api.price,
    originalPrice: api.originalPrice,
    discount: api.discount,
    currency: '$',
    stock: api.stock,
    sku: api.sku || '',
    availability: api.stock > 10 ? 'in_stock' : api.stock > 0 ? 'low_stock' : 'out_of_stock',
    images: api.images.map((url, i) => ({
      id: String(i + 1),
      url: url.startsWith('http') || url.startsWith('/') ? url : `http://localhost:5000${url}`,
      alt: `${api.name} image ${i + 1}`,
      isPrimary: i === 0,
    })),
    rating: api.rating,
    reviewCount: api.numReviews,
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
    sizes: sizeVariant?.options.map((opt, i) => ({
      id: `s${i}`,
      name: opt,
      value: opt,
      available: true,
    })),
    colors: colorVariant?.options.map((opt, i) => ({
      id: `c${i}`,
      name: opt,
      value: opt,
      available: true,
    })),
    specifications: api.specifications?.map((s) => ({
      label: s.key,
      value: s.value,
    })),
    shipping: {
      freeShipping: api.shipping?.freeShipping || false,
      estimatedDays: '2-4 business days',
    },
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    featured: api.isFeatured,
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