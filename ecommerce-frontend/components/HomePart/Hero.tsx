import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';
const CustomSlider = dynamic(() => import('@/components/HomePart/CustomSlider'), { ssr: true });

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row g-4">
          {/* Main Slider */}
          <div className="col-lg-9">
            <CustomSlider />
          </div>

          {/* Side Banners */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="hero-banner mb-4">
              <Image 
                src="/hero1.webp" 
                alt="Mobile App Banner" 
                width={400} 
                height={250} 
                className="banner-image"
              />
            </div>
            <div className="hero-banner">
              <Image 
                src="/hero2.webp" 
                alt="Career Banner" 
                width={400} 
                height={250} 
                className="banner-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;