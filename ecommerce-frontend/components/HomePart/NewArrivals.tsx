import React from 'react'
import SectionTop from '../common/SectionTop'
import ProductCard from '../card/ProductCard'

const NewArrivals = () => {
  return (
    <section>
        <div className="container">
            <SectionTop />
            <div className="row g-4">
                {
                    [1,2,3,4,5,6,7,8].map((item)=>(
                        <div className="col-lg-3" key={item}>
                            <ProductCard />
                        </div>
                    ))
                }
            </div>
            </div>
    </section>
  )
}

export default NewArrivals