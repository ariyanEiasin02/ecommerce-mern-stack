'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../card/ProductCard';
import SectionTop from '../common/SectionTop';
import { productService, ApiProduct } from '@/services/productService';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categorySlug, currentProductId }) => {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const params: Record<string, unknown> = { limit: 8 };
    if (categorySlug) params.category = categorySlug;
    productService.getProducts(params as any)
      .then((res) => {
        const filtered = currentProductId
          ? res.data.filter((p) => p._id !== currentProductId)
          : res.data;
        setProducts(filtered.slice(0, 8));
      })
      .catch(() => setProducts([]));
  }, [categorySlug, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section>
      <div className="container">
        <SectionTop title="Related Products"/>
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-xl-2-5 col-lg-3 col-md-4 col-6" key={product._id}>
              <ProductCard
                id={product._id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                images={product.images}
                rating={product.rating}
                soldCount={product.soldCount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
