import React from 'react';
import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductBanner from '@/components/productDetails/ProductBanner';
import ProductTabs from '@/components/productDetails/ProductTabs';
import RelatedProducts from '@/components/productDetails/RelatedProducts';
import { Product } from '@/types/product';

// Mock function to fetch product - replace with actual API call
async function getProduct(slug: string): Promise<Product> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${process.env.API_URL}/products/${slug}`);
  // return response.json();
  
  // Mock data for demonstration
  return {
    id: '1',
    slug: slug,
    name: 'Premium Wireless Headphones',
    description: `<p>Experience superior sound quality with our Premium Wireless Headphones. 
      Featuring advanced noise cancellation technology, ergonomic design, and up to 30 hours of battery life.</p>
      <p>These headphones are perfect for music lovers, professionals, and anyone who values high-quality audio. 
      The over-ear design provides maximum comfort for extended listening sessions.</p>
      <h4>Advanced Features:</h4>
      <ul>
        <li>Active Noise Cancellation (ANC) technology</li>
        <li>High-fidelity audio with deep bass</li>
        <li>Multi-device connectivity via Bluetooth 5.0</li>
        <li>Touch controls for easy operation</li>
        <li>Foldable design with premium carrying case</li>
      </ul>`,
    shortDescription: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    originalPrice: 399.99,
    currency: '$',
    stock: 45,
    sku: 'WH-1000XM5-BLK',
    availability: 'in_stock',
    images: [
      {
        id: '1',
        url: '/images/products/headphones-1.jpg',
        alt: 'Premium Wireless Headphones - Front View',
        isPrimary: true
      },
      {
        id: '2',
        url: '/images/products/headphones-2.jpg',
        alt: 'Premium Wireless Headphones - Side View'
      },
      {
        id: '3',
        url: '/images/products/headphones-3.jpg',
        alt: 'Premium Wireless Headphones - Folded'
      },
      {
        id: '4',
        url: '/images/products/headphones-4.jpg',
        alt: 'Premium Wireless Headphones - In Use'
      }
    ],
    rating: 4.7,
    reviewCount: 328,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Smith',
        rating: 5,
        title: 'Excellent sound quality!',
        comment: 'These headphones exceeded my expectations. The noise cancellation works perfectly, and the sound quality is amazing.',
        date: '2026-02-10',
        verified: true,
        helpful: 24
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Sarah Johnson',
        rating: 4,
        title: 'Great but pricey',
        comment: 'Love the comfort and sound, but the price is a bit steep. Still worth it for the quality.',
        date: '2026-02-08',
        verified: true,
        helpful: 15
      }
    ],
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'AudioTech',
    tags: ['wireless', 'noise-cancelling', 'premium', 'bluetooth'],
    sizes: [],
    colors: [
      { id: 'c1', name: 'Midnight Black', value: '#000000', available: true },
      { id: 'c2', name: 'Silver', value: '#C0C0C0', available: true },
      { id: 'c3', name: 'Navy Blue', value: '#001F3F', available: false }
    ],
    specifications: [
      { label: 'Driver Size', value: '40mm' },
      { label: 'Frequency Response', value: '4Hz - 40kHz' },
      { label: 'Impedance', value: '47 Ohms' },
      { label: 'Battery Life', value: 'Up to 30 hours' },
      { label: 'Charging Time', value: '3 hours (USB-C fast charging)' },
      { label: 'Bluetooth Version', value: '5.0' },
      { label: 'Weight', value: '250g' },
      { label: 'Cable Length', value: '1.2m (detachable)' },
      { label: 'Noise Cancellation', value: 'Active (ANC)' },
      { label: 'Microphone', value: 'Built-in with echo cancellation' }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '3-5 business days'
    },
    metaTitle: 'Premium Wireless Headphones - Active Noise Cancellation | AudioTech',
    metaDescription: 'Shop Premium Wireless Headphones with active noise cancellation, 30-hour battery, and superior sound quality. Free shipping available.',
    keywords: ['wireless headphones', 'noise cancelling headphones', 'premium audio', 'bluetooth headphones'],
    createdAt: '2026-01-15',
    updatedAt: '2026-02-15',
    featured: true,
    bestseller: true,
    relatedProducts: ['2', '3', '4', '5']
  };
}

// Mock function to fetch related products
async function getRelatedProducts(productId: string): Promise<Product[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: '2',
      slug: 'wireless-earbuds-pro',
      name: 'Wireless Earbuds Pro',
      description: 'Compact wireless earbuds',
      price: 149.99,
      originalPrice: 199.99,
      currency: '$',
      stock: 120,
      sku: 'EB-PRO-WHT',
      availability: 'in_stock',
      images: [{ id: '1', url: '/images/products/earbuds-1.jpg', alt: 'Wireless Earbuds' }],
      rating: 4.5,
      reviewCount: 156,
      category: 'Electronics',
      brand: 'AudioTech',
      shipping: { freeShipping: true, estimatedDays: '2-4 days' },
      createdAt: '2026-01-20',
      updatedAt: '2026-02-10',
      newArrival: true
    },
    {
      id: '3',
      slug: 'studio-monitor-headphones',
      name: 'Studio Monitor Headphones',
      description: 'Professional studio headphones',
      price: 349.99,
      currency: '$',
      stock: 30,
      sku: 'SM-500-BLK',
      availability: 'in_stock',
      images: [{ id: '1', url: '/images/products/studio-1.jpg', alt: 'Studio Headphones' }],
      rating: 4.8,
      reviewCount: 89,
      category: 'Electronics',
      brand: 'AudioTech',
      shipping: { freeShipping: true, estimatedDays: '3-5 days' },
      createdAt: '2026-01-10',
      updatedAt: '2026-02-12',
      bestseller: true
    },
    {
      id: '4',
      slug: 'gaming-headset-rgb',
      name: 'Gaming Headset RGB',
      description: 'Gaming headset with RGB lighting',
      price: 129.99,
      originalPrice: 169.99,
      currency: '$',
      stock: 8,
      sku: 'GH-RGB-BLK',
      availability: 'low_stock',
      images: [{ id: '1', url: '/images/products/gaming-1.jpg', alt: 'Gaming Headset' }],
      rating: 4.3,
      reviewCount: 245,
      category: 'Electronics',
      brand: 'GameTech',
      shipping: { freeShipping: true, estimatedDays: '2-3 days' },
      createdAt: '2026-01-25',
      updatedAt: '2026-02-14'
    },
    {
      id: '5',
      slug: 'bluetooth-speaker-portable',
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof portable speaker',
      price: 89.99,
      currency: '$',
      stock: 200,
      sku: 'BS-PORT-BLU',
      availability: 'in_stock',
      images: [{ id: '1', url: '/images/products/speaker-1.jpg', alt: 'Bluetooth Speaker' }],
      rating: 4.6,
      reviewCount: 412,
      category: 'Electronics',
      brand: 'AudioTech',
      shipping: { freeShipping: true, estimatedDays: '2-4 days' },
      createdAt: '2026-02-01',
      updatedAt: '2026-02-15',
      newArrival: true
    }
  ];
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: product.metaTitle || `${product.name} | E-Commerce Store`,
    description: product.metaDescription || product.shortDescription,
    keywords: product.keywords?.join(', '),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [
        {
          url: product.images[0]?.url || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: product.name
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]?.url || '/default-twitter-image.jpg']
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

// Product Details Page Component
export default async function ProductPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const product = await getProduct(params.slug);
  const relatedProducts = await getRelatedProducts(product.id);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => img.url),
    description: product.shortDescription,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      url: `https://yourstore.com/product/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.availability === 'in_stock' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'E-Commerce Store'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  return (
    <React.Fragment>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="product-page">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: product.category, href: `/category/${product.category.toLowerCase()}` },
              { label: product.name }
            ]}
          />

          {/* Product Banner (Image + Content) */}
          <ProductBanner product={product} />
        </div>

        {/* Product Tabs (Description, Specs, Reviews) */}
        <div className="container mt-5">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-5 mb-5">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </React.Fragment>
  );
}