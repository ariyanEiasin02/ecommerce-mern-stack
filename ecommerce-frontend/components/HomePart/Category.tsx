import React from 'react'
import CategoryCard from '../card/CategoryCard';

const Category = () => {
    const categories = [
        { id: 1, name: 'Electronics', image: '/mobile-phone.png' },
        { id: 2, name: 'Fashion', image: '/hero2.webp' },
        { id: 3, name: 'Home & Garden', image: '/hero3.webp' },
        { id: 4, name: 'Health & Beauty', image: '/hero1.webp' },
        { id: 5, name: 'Toys & Games', image: '/hero2.webp' },
        { id: 6, name: 'Sports', image: '/hero3.webp' },
        { id: 7, name: 'Automotive', image: '/hero1.webp' },
        { id: 8, name: 'Automotive', image: '/hero1.webp' },
        { id: 9, name: 'Automotive', image: '/hero1.webp' },
        { id: 10, name: 'Automotive', image: '/hero1.webp' },
    ];
  return (
    <section className="category-section">
        <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
            <div className="category-wrapper">
                {
                    categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Category