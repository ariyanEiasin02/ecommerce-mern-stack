import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';
import { BannerItem, SlideItem } from '@/types/home';

const CustomSlider = dynamic(() => import('@/components/HomePart/CustomSlider'), { ssr: true });

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

function resolveImage(src?: string | null): string {
  if (!src) return '/hero1.webp';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads')) return `${BACKEND_URL}${src}`;
  return src;
}

interface HeroProps {
  slides?: SlideItem[];
  topBanner?: BannerItem | null;
  bottomBanner?: BannerItem | null;
}

const Hero = ({ slides, topBanner, bottomBanner }: HeroProps) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row g-4">
          {/* Main Slider */}
          <div className="col-lg-9">
            <CustomSlider slides={slides} />
          </div>

          {/* Side Banners */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="hero-banner mb-4">
              <Image
                src={resolveImage(topBanner?.image)}
                alt={topBanner?.alt || 'Mobile App Banner'}
                width={400}
                height={250}
                className="banner-image"
              />
            </div>
            <div className="hero-banner">
              <Image
                src={resolveImage(bottomBanner?.image)}
                alt={bottomBanner?.alt || 'Career Banner'}
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