import React from 'react'
import ProductImage from './ProductImage'
import ProductContent from './ProductContent'

const ProductBanner = () => {
  return (
   <section>
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <ProductImage/>
        </div>
        <div className="col-lg-6">
          <ProductContent/>
        </div>
      </div>
    </div>
   </section>
  )
}

export default ProductBanner