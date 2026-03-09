import React from 'react';
import SectionTop from '../common/SectionTop';
import ProductCard from '../card/ProductCard';
import { ProductItem } from '@/types/home';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

function resolveImages(images?: string[]): string[] {
  if (!images || images.length === 0) return ['/hero1.webp'];
  return images.map((src) => {
    if (src.startsWith('http')) return src;
    if (src.startsWith('/uploads')) return `${BACKEND_URL}${src}`;
    return src;
  });
}

interface TopRatedProductsProps {
  products?: ProductItem[];
}

const TopRatedProducts = ({ products }: TopRatedProductsProps) => {
  const displayProducts = products && products.length > 0 ? products : [];

  return (
    <section className="section-header">
      <div className="container">
        <SectionTop title="Top Rated Products" />
        <div className="row g-4">
          {displayProducts.map((product,index) => (
            <div className="col-xl-2-5 col-lg-3 col-md-4 col-6" key={index}>
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                images={resolveImages(product.images)}
                isTrending={product.isTrending}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedProducts;