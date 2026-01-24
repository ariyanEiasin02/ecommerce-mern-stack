import Image from 'next/image'
import React from 'react'

const ProductCard = () => {
  return (
    <div className="product-card">
        <div className="product-image">
            <Image
                src="/hero1.webp" 
                alt="Product Image" 
                width={400} 
                height={250} 
                className="product-image"
            />
        </div>
        <div className="product-details">
            <h3 className="product-name">Product Title</h3>
            <p className="product-price">$99.99 <span>$119.99</span></p>
        </div>
    </div>
  )
}

export default ProductCard