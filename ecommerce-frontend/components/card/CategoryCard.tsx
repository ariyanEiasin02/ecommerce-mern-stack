import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CategoryCardProps {
    category: {
        id: number | string;
        name: string;
        image: string;
        slug?: string;
    }
}
const CategoryCard = ({category}: CategoryCardProps) => {
  return (
    <Link href={`/all-products?category=${category.slug || category.name.toLowerCase()}`} className="category-card">
         <div className="image-wrapper">
            <Image 
          src={category.image} 
          alt={category.name} 
          width={106} 
          height={80} 
          className="banner-image"
        />
         </div>
        <h3>{category.name}</h3>
    </Link>
  )
}

export default CategoryCard