'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Product } from '@/types/product';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '../card/ProductCard';
import SectionTop from '../common/SectionTop';

const RelatedProducts: React.FC = ({ 
}) => {
  return (
     <section>
      <div className="container">
        <SectionTop title="Related Products"/>
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
    </section>
  );
};

export default RelatedProducts;
