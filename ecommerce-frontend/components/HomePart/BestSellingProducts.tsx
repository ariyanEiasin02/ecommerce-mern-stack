import React from 'react'
import ProductCard from '../card/ProductCard';
import SectionTop from '../common/SectionTop';

const BestSellingProducts = () => {
  return (
    <section className="section-header">
      <div className="container">
        <SectionTop title="Best Selling Products"/>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="col-xl-2-5 col-lg-3 col-md-4 col-6" key={item}>
              <ProductCard
                name="Basic High-Neck Puff Jacket"
                price={69.0}
                originalPrice={89.0}
                discount={23}
                images={[
                  "https://global-img-cdn.1688.com/img/ibank/O1CN01UFWHhF1n7I4ZR0fkR_!!2220837545042-0-cib.310x310.jpg",
                  "https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg"
                ]}
                isTrending={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default BestSellingProducts