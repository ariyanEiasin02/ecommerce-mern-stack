'use client';

import React, { useEffect, useState } from 'react'
import CategoryCard from '../card/CategoryCard';
import { categoryService, ApiCategory } from '@/services/categoryService';

const Category = () => {
    const [categories, setCategories] = useState<ApiCategory[]>([]);

    useEffect(() => {
      categoryService.getCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }, []);

  return (
    <section className="category-section">
        <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
            <div className="category-wrapper">
                {
                    categories.map(category => (
                        <CategoryCard key={category._id} category={{ id: category._id, name: category.name, image: category.image || '/hero1.webp', slug: category.slug }} />
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Category