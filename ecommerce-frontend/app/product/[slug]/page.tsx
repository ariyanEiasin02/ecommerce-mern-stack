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

  // Mock data – Ben Hogan Golf Polo Shirt
  return {
    id: '1',
    slug: slug,
    name: "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt",
    description: `<p>This Ben Hogan Men's Solid Ottoman Golf Polo Shirt makes for versatile casual wear or golf apparel.
      Built-in moisture wicking and sun protection keep you feeling dry while blocking out harmful UV rays.</p>
      <p>Durable textured Ottoman fabric and a ribbed collar with three-button placket give it classic polo style.
      The solid color makes this golf top easy to pair up with any pants or shorts for style that looks great both on and off the course.</p>
      <h4>Key Features:</h4>
      <ul>
        <li>Moisture Wicking technology</li>
        <li>Stretchy, comfortable fit</li>
        <li>SPF/UV Protection</li>
        <li>Easy Care – machine washable</li>
        <li>Ottoman textured fabric</li>
        <li>Ribbed collar with three-button placket</li>
      </ul>`,
    shortDescription:
      "Built-in moisture wicking and sun protection keep you feeling dry. Ottoman fabric with a ribbed collar for classic polo style.",
    price: 187500,
    originalPrice: 250000,
    currency: 'Rp',
    soldCount: 10000,
    stock: 42,
    sku: 'BH-POLO-BLK-M',
    availability: 'in_stock',
    images: [
      {
        id: '1',
        url: 'https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg',
        alt: "Ben Hogan Golf Polo Shirt – Front View",
        isPrimary: true,
      },
      {
        id: '2',
        url: 'https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg',
        alt: "Ben Hogan Golf Polo Shirt – Side View",
      },
      {
        id: '3',
        url: '/hero2.webp',
        alt: "Ben Hogan Golf Polo Shirt – Back View",
      },
      {
        id: '4',
        url: 'https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg',
        alt: "Ben Hogan Golf Polo Shirt – Detail",
      },
      {
        id: '5',
        url: '/hero2.webp',
        alt: "Ben Hogan Golf Polo Shirt – Lifestyle",
      },
    ],
    rating: 4.8,
    reviewCount: 188,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'Ahmad Rizaldi',
        rating: 5,
        title: 'Great quality polo shirt!',
        comment:
          'The fabric is comfortable and breathable. Size is true to label. Very satisfied with the purchase.',
        date: '2026-02-10',
        verified: true,
        helpful: 34,
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Budi Santoso',
        rating: 5,
        title: 'Perfect for golf and casual wear',
        comment:
          "Bought this for my weekly golf sessions and it's amazing. The moisture wicking really works.",
        date: '2026-02-08',
        verified: true,
        helpful: 21,
      },
    ],
    category: 'Fashion',
    subcategory: 'Men Tops',
    brand: 'Ben Hogan',
    tags: ['polo', 'golf', 'mens', 'moisture-wicking', 'spf'],
    sizes: [
      { id: 's1', name: 'S', value: 'S', available: true },
      { id: 's2', name: 'M', value: 'M', available: true },
      { id: 's3', name: 'L', value: 'L', available: true },
      { id: 's4', name: 'XL', value: 'XL', available: true },
      { id: 's5', name: '2XL', value: '2XL', available: true },
      { id: 's6', name: '3XL', value: '3XL', available: false },
    ],
    colors: [
      { id: 'c1', name: 'Midnight Black', value: '#1a1a1a', available: true },
      { id: 'c2', name: 'Light Gray', value: '#d1d5db', available: true },
    ],
    specifications: [
      { label: 'Package Dimensions', value: '27.3 x 24.8 x 4.9 cm; 180 g' },
      { label: 'Specification', value: 'Moisture Wicking, Stretchy, SPF/UV Protection, Easy Care' },
      { label: 'Date First Available', value: 'August 08, 2023' },
      { label: 'Department', value: 'Mens' },
    ],
    seller: {
      id: 'seller1',
      name: 'Barudak Disaster Mall',
      verified: true,
      rating: 96,
      location: 'Tulungagung',
      chatReply: 98,
    },
    shipping: {
      freeShipping: true,
      estimatedDays: '2-4 business days',
    },
    metaTitle: "Ben Hogan Men's Solid Ottoman Golf Polo Shirt | Free Shipping",
    metaDescription:
      "Shop Ben Hogan Men's Solid Ottoman Golf Polo Shirt. Moisture wicking, SPF/UV protection, stretchy comfort. Great for golf and casual wear.",
    keywords: ['polo shirt', 'golf shirt', 'mens polo', 'moisture wicking shirt'],
    createdAt: '2023-08-08',
    updatedAt: '2026-02-15',
    featured: true,
    bestseller: true,
    relatedProducts: ['2', '3', '4', '5'],
  };
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
      title: product.metaTitle || `${product.name} | Store`,
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
      priceCurrency: 'IDR',
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
              { label: 'Product', href: '/all-products' },
              { label: product.name },
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
          <RelatedProducts/>
        </div>
      </div>
    </React.Fragment>
  );
}