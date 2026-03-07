"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CustomSlider from '@/components/HomePart/CustomSlider';
import { homeService, type HeroBanner } from '@/services/homeService';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

const resolveImage = (src: string) =>
  src.startsWith('http') ? src : `${BACKEND_URL}${src}`;

const Hero = () => {
  const [slider, setSlider] = useState<HeroBanner[]>([]);
  const [rightTop, setRightTop] = useState<HeroBanner | null>(null);
  const [rightBottom, setRightBottom] = useState<HeroBanner | null>(null);

  useEffect(() => {
    homeService.getHomePageData().then((data) => {
      setSlider(data.slider);
      setRightTop(data.rightTop);
      setRightBottom(data.rightBottom);
    }).catch(() => {});
  }, []);

  const renderBanner = (banner: HeroBanner | null, fallbackSrc: string, alt: string) => {
    const imgSrc = banner?.image ? resolveImage(banner.image) : fallbackSrc;
    const content = (
      <Image
        src={imgSrc}
        alt={alt}
        width={400}
        height={250}
        className="banner-image"
      />
    );

    if (banner?.link) {
      return (
        <Link href={banner.link} className="hero-banner-link">
          {content}
        </Link>
      );
    }
    return content;
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row g-4">
          {/* Main Slider */}
          <div className="col-lg-9">
            <CustomSlider slides={slider} />
          </div>

          {/* Side Banners */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="hero-banner mb-4">
              {renderBanner(rightTop, '/hero1.webp', 'Top Banner')}
            </div>
            <div className="hero-banner">
              {renderBanner(rightBottom, '/hero2.webp', 'Bottom Banner')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;