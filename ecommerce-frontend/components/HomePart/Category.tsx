import React from 'react';
import CategoryCard from '../card/CategoryCard';
import { CategoryItem } from '@/types/home';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

function resolveImage(src?: string): string {
  if (!src) return '/hero1.webp';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads')) return `${BACKEND_URL}${src}`;
  return src;
}

interface CategoryProps {
  categories?: CategoryItem[];
}

const Category = ({ categories }: CategoryProps) => {
  const displayCategories = categories && categories.length > 0 ? categories : [];

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-wrapper">
          {displayCategories.map((category,index) => (
            <CategoryCard
              key={index}
              category={{
                id: category._id,
                name: category.name,
                image: resolveImage(category.image),
                slug: category.slug,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;