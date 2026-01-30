import React from 'react'
import ProductCard from '../card/ProductCard'
import SideBar from './SideBar'

const ProductList = () => {
  return (
    <section className="product-list-section">
      <div className="container">
        <div className="row">
            <div className="col-lg-2">
                <SideBar />
            </div>
            <div className="col-lg-10">
                        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="col-xl-2-5 col-lg-3 col-md-4 col-6" key={item}>
              <ProductCard
                name="Basic High-Neck Puff Jacket"
                price={69.0}
                originalPrice={89.0}
                discount={23}
                images={[
                  "/hero1.webp",
                  "https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg"
                ]}
                isTrending={true}
              />
            </div>
          ))}
        </div>
            </div>
        </div>
        </div>
    </section>
  )
}

export default ProductList