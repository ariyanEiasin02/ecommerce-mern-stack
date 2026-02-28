'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '../card/ProductCard';
import SectionTop from '../common/SectionTop';
import { productService, ApiProduct } from '@/services/productService';

const BestSellingProducts = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    productService.getBestSelling(8)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="section-header">
      <div className="container">
        <SectionTop title="Best Selling Products"/>
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
          {products.length === 0 &&
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div className="col-xl-2-5 col-lg-3 col-md-4 col-6" key={i}>
                <div style={{ height: 320, borderRadius: 8, background: '#f0f0f0' }} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
export default BestSellingProducts;