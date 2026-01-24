import Image from 'next/image'
import React from 'react'
interface CategoryCardProps {
    category: {
        id: number;
        name: string;
        image: string;
    }
}
const CategoryCard = ({category}: CategoryCardProps) => {
  return (
    <div className="category-card">
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
    </div>
  )
}

export default CategoryCard