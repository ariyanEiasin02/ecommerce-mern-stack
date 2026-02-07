import Breadcrumb from '@/components/common/Breadcrumb'
import ProductBanner from '@/components/productDetails/ProductBanner'
import React from 'react'

const page = () => {
  return (
    <React.Fragment>
      <div className="container">
      <Breadcrumb
          items={[{ label: "Shop", href: "/shop" }, { label: "All Products" }]}
        />
      <ProductBanner />
      </div>
    </React.Fragment>
  )
}

export default page