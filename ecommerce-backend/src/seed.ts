import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Coupon from './models/Coupon';
import Review from './models/Review';
import Order from './models/Order';
import Cart from './models/Cart';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// ──────────────────────────── SEED DATA ────────────────────────────

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@shophub.com',
    password: 'Admin@123',
    role: 'superAdmin' as const,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User@123',
    role: 'user' as const,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@123',
    role: 'user' as const,
  },
  {
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'User@123',
    role: 'user' as const,
  },
];

const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Laptops, phones, tablets and more',
    image: '',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones', description: 'Latest smartphones' },
      { name: 'Laptops', slug: 'laptops', description: 'Powerful laptops for work and play' },
      { name: 'Headphones', slug: 'headphones', description: 'Audio gear and headphones' },
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes and accessories',
    image: '',
    subcategories: [
      { name: 'Men\'s Clothing', slug: 'mens-clothing', description: 'Men\'s apparel' },
      { name: 'Women\'s Clothing', slug: 'womens-clothing', description: 'Women\'s apparel' },
      { name: 'Shoes', slug: 'shoes', description: 'Footwear for every occasion' },
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, décor and kitchen essentials',
    image: '',
    subcategories: [
      { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
      { name: 'Kitchen', slug: 'kitchen', description: 'Kitchen appliances and tools' },
    ],
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sporting equipment and outdoor gear',
    image: '',
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Best-selling books across all genres',
    image: '',
  },
];

const couponsData = [
  {
    code: 'WELCOME10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minPurchase: 50,
    maxUses: 100,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  },
  {
    code: 'SAVE20',
    discountType: 'percentage' as const,
    discountValue: 20,
    minPurchase: 100,
    maxUses: 50,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'FLAT15',
    discountType: 'fixed' as const,
    discountValue: 15,
    minPurchase: 75,
    maxUses: 200,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

// Products will reference category IDs after categories are created
function buildProducts(categoryMap: Record<string, string>) {
  return [
    // ── Smartphones (10) ──
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Experience the ultimate iPhone with the A17 Pro chip, 48MP camera system, and titanium design. Features a 6.7-inch Super Retina XDR display with ProMotion technology.',
      price: 1199, discount: 5, stock: 50,
      category: categoryMap['smartphones'], brand: 'Apple', isFeatured: true,
      ratings: 4.8, reviewCount: 120, soldCount: 340,
      images: [
        { url: 'https://picsum.photos/seed/iphone15/400/500', alt: 'iPhone 15 Pro Max', isPrimary: true },
        { url: 'https://picsum.photos/seed/iphone15b/400/500', alt: 'iPhone 15 Pro Max back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '256gb', label: '256 GB', stock: 20, priceModifier: 0 },
        { type: 'size', value: '512gb', label: '512 GB', stock: 15, priceModifier: 200 },
        { type: 'color', value: 'titanium-black', label: 'Black Titanium', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'titanium-blue', label: 'Blue Titanium', stock: 25, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '6.7" Super Retina XDR' },
        { key: 'Processor', value: 'A17 Pro' },
        { key: 'RAM', value: '8 GB' },
        { key: 'Battery', value: '4441 mAh' },
      ],
      shipping: { weight: 0.221, dimensions: '15.9 x 7.7 x 0.83 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['iphone', 'apple', 'smartphone', 'flagship'],
    },
    {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'The Galaxy S24 Ultra features a built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and stunning 6.8-inch Dynamic AMOLED display.',
      price: 1299, discount: 8, stock: 40,
      category: categoryMap['smartphones'], brand: 'Samsung', isFeatured: true,
      ratings: 4.7, reviewCount: 98, soldCount: 280,
      images: [
        { url: 'https://picsum.photos/seed/s24ultra/400/500', alt: 'Samsung Galaxy S24 Ultra', isPrimary: true },
        { url: 'https://picsum.photos/seed/s24ultrab/400/500', alt: 'Samsung Galaxy S24 Ultra back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '256gb', label: '256 GB', stock: 20, priceModifier: 0 },
        { type: 'size', value: '512gb', label: '512 GB', stock: 20, priceModifier: 120 },
        { type: 'color', value: 'titanium-gray', label: 'Titanium Gray', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'titanium-violet', label: 'Titanium Violet', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'Camera', value: '200MP main' },
      ],
      shipping: { weight: 0.233, dimensions: '16.2 x 7.9 x 0.86 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['samsung', 'galaxy', 'smartphone', 'android'],
    },
    {
      title: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      description: 'Google Pixel 8 Pro with Tensor G3 chip, 50MP camera with Super Res Zoom, and advanced AI-powered photo editing features.',
      price: 999, discount: 10, stock: 35,
      category: categoryMap['smartphones'], brand: 'Google', isFeatured: false,
      ratings: 4.6, reviewCount: 76, soldCount: 180,
      images: [
        { url: 'https://picsum.photos/seed/pixel8pro/400/500', alt: 'Google Pixel 8 Pro', isPrimary: true },
        { url: 'https://picsum.photos/seed/pixel8prob/400/500', alt: 'Google Pixel 8 Pro back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '128gb', label: '128 GB', stock: 15, priceModifier: 0 },
        { type: 'size', value: '256gb', label: '256 GB', stock: 20, priceModifier: 100 },
        { type: 'color', value: 'obsidian', label: 'Obsidian', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'bay', label: 'Bay Blue', stock: 15, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '6.7" LTPO OLED' },
        { key: 'Processor', value: 'Google Tensor G3' },
        { key: 'Camera', value: '50MP main + 48MP ultra wide' },
      ],
      shipping: { weight: 0.213, dimensions: '16.3 x 7.6 x 0.88 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['google', 'pixel', 'smartphone', 'android'],
    },
    {
      title: 'OnePlus 12',
      slug: 'oneplus-12',
      description: 'The OnePlus 12 delivers flagship performance with Snapdragon 8 Gen 3, Hasselblad camera system, and 100W SUPERVOOC charging.',
      price: 799, discount: 5, stock: 60,
      category: categoryMap['smartphones'], brand: 'OnePlus', isFeatured: false,
      ratings: 4.5, reviewCount: 54, soldCount: 145,
      images: [
        { url: 'https://picsum.photos/seed/oneplus12/400/500', alt: 'OnePlus 12', isPrimary: true },
        { url: 'https://picsum.photos/seed/oneplus12b/400/500', alt: 'OnePlus 12 back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '12gb-256gb', label: '12GB / 256GB', stock: 30, priceModifier: 0 },
        { type: 'size', value: '16gb-512gb', label: '16GB / 512GB', stock: 30, priceModifier: 100 },
        { type: 'color', value: 'silky-black', label: 'Silky Black', stock: 30, priceModifier: 0 },
        { type: 'color', value: 'flowy-emerald', label: 'Flowy Emerald', stock: 30, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '6.82" LTPO AMOLED' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'Charging', value: '100W SUPERVOOC' },
      ],
      shipping: { weight: 0.22, dimensions: '16.4 x 7.5 x 0.9 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['oneplus', 'smartphone', 'android', 'fast-charging'],
    },
    {
      title: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      description: 'Xiaomi 14 Ultra with Leica professional camera system, 1-inch main sensor, and Snapdragon 8 Gen 3 for exceptional performance.',
      price: 1099, discount: 0, stock: 25,
      category: categoryMap['smartphones'], brand: 'Xiaomi', isFeatured: false,
      ratings: 4.4, reviewCount: 32, soldCount: 88,
      images: [
        { url: 'https://picsum.photos/seed/xiaomi14/400/500', alt: 'Xiaomi 14 Ultra', isPrimary: true },
      ],
      variants: [
        { type: 'size', value: '512gb', label: '16GB / 512GB', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 15, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White', stock: 10, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '6.73" LTPO AMOLED' },
        { key: 'Camera', value: '1-inch main sensor Leica' },
        { key: 'Battery', value: '5000 mAh' },
      ],
      shipping: { weight: 0.229, dimensions: '16.1 x 7.5 x 0.92 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['xiaomi', 'smartphone', 'leica', 'camera'],
    },

    // ── Laptops (5) ──
    {
      title: 'MacBook Pro 16" M3 Max',
      slug: 'macbook-pro-16-m3-max',
      description: 'The most powerful MacBook Pro ever with M3 Max chip, Liquid Retina XDR display, and up to 22-hour battery life.',
      price: 3499, discount: 0, stock: 25,
      category: categoryMap['laptops'], brand: 'Apple', isFeatured: true,
      ratings: 4.9, reviewCount: 88, soldCount: 120,
      images: [
        { url: 'https://picsum.photos/seed/macbookpro/400/500', alt: 'MacBook Pro 16', isPrimary: true },
        { url: 'https://picsum.photos/seed/macbookprob/400/500', alt: 'MacBook Pro 16 keyboard', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '36gb-1tb', label: '36GB / 1TB', stock: 15, priceModifier: 0 },
        { type: 'size', value: '48gb-2tb', label: '48GB / 2TB', stock: 10, priceModifier: 400 },
        { type: 'color', value: 'space-black', label: 'Space Black', stock: 15, priceModifier: 0 },
        { type: 'color', value: 'silver', label: 'Silver', stock: 10, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '16.2" Liquid Retina XDR' },
        { key: 'Processor', value: 'Apple M3 Max' },
        { key: 'RAM', value: '36 GB unified' },
      ],
      shipping: { weight: 2.14, dimensions: '35.6 x 24.8 x 1.7 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['macbook', 'apple', 'laptop', 'professional'],
    },
    {
      title: 'Dell XPS 15 OLED',
      slug: 'dell-xps-15-oled',
      description: 'Dell XPS 15 with stunning 3.5K OLED display, Intel Core i9, NVIDIA RTX 4070, and premium build quality.',
      price: 2299, discount: 5, stock: 30,
      category: categoryMap['laptops'], brand: 'Dell', isFeatured: true,
      ratings: 4.6, reviewCount: 65, soldCount: 98,
      images: [
        { url: 'https://picsum.photos/seed/dellxps15/400/500', alt: 'Dell XPS 15 OLED', isPrimary: true },
        { url: 'https://picsum.photos/seed/dellxps15b/400/500', alt: 'Dell XPS 15 open', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '32gb-1tb', label: '32GB / 1TB', stock: 20, priceModifier: 0 },
        { type: 'size', value: '64gb-2tb', label: '64GB / 2TB', stock: 10, priceModifier: 400 },
      ],
      specifications: [
        { key: 'Display', value: '15.6" 3.5K OLED' },
        { key: 'Processor', value: 'Intel Core i9-13900H' },
        { key: 'GPU', value: 'NVIDIA RTX 4070' },
      ],
      shipping: { weight: 1.86, dimensions: '34.4 x 23 x 1.8 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['dell', 'xps', 'laptop', 'oled'],
    },
    {
      title: 'ASUS ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      description: 'Compact gaming powerhouse with AMD Ryzen 9, RTX 4090, and 120Hz OLED display all in a 14-inch form factor.',
      price: 1999, discount: 10, stock: 20,
      category: categoryMap['laptops'], brand: 'ASUS', isFeatured: false,
      ratings: 4.7, reviewCount: 44, soldCount: 75,
      images: [
        { url: 'https://picsum.photos/seed/rogzephyrus/400/500', alt: 'ASUS ROG Zephyrus G14', isPrimary: true },
        { url: 'https://picsum.photos/seed/rogzephyrusb/400/500', alt: 'ASUS ROG Zephyrus G14 RGB', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '32gb-1tb', label: '32GB / 1TB', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Display', value: '14" 120Hz OLED' },
        { key: 'Processor', value: 'AMD Ryzen 9 7940HS' },
        { key: 'GPU', value: 'NVIDIA RTX 4090' },
      ],
      shipping: { weight: 1.65, dimensions: '31.2 x 22.7 x 1.87 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['asus', 'rog', 'gaming', 'laptop'],
    },

    // ── Headphones (5) ──
    {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life and crystal-clear hands-free calling.',
      price: 399, discount: 15, stock: 80,
      category: categoryMap['headphones'], brand: 'Sony', isFeatured: true,
      ratings: 4.8, reviewCount: 210, soldCount: 520,
      images: [
        { url: 'https://picsum.photos/seed/sonywh1000xm5/400/500', alt: 'Sony WH-1000XM5', isPrimary: true },
        { url: 'https://picsum.photos/seed/sonywh1000xm5b/400/500', alt: 'Sony WH-1000XM5 folded', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'black', label: 'Black', stock: 40, priceModifier: 0 },
        { type: 'color', value: 'silver', label: 'Silver', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'midnight-blue', label: 'Midnight Blue', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Driver', value: '30mm' },
        { key: 'Battery', value: '30 hours' },
        { key: 'Connectivity', value: 'Bluetooth 5.2' },
      ],
      shipping: { weight: 0.25, dimensions: '22 x 18 x 8 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['headphones', 'sony', 'noise-cancelling', 'wireless'],
    },
    {
      title: 'Apple AirPods Pro 2nd Gen',
      slug: 'apple-airpods-pro-2nd-gen',
      description: 'AirPods Pro with next-level Active Noise Cancellation, Adaptive Audio, and up to 30 hours total battery life with MagSafe case.',
      price: 249, discount: 0, stock: 120,
      category: categoryMap['headphones'], brand: 'Apple', isFeatured: true,
      ratings: 4.7, reviewCount: 178, soldCount: 410,
      images: [
        { url: 'https://picsum.photos/seed/airpodspro2/400/500', alt: 'AirPods Pro 2nd Gen', isPrimary: true },
        { url: 'https://picsum.photos/seed/airpodspro2b/400/500', alt: 'AirPods Pro 2nd Gen case', isPrimary: false },
      ],
      variants: [],
      specifications: [
        { key: 'ANC', value: 'Active Noise Cancellation' },
        { key: 'Battery', value: '6h + 24h with case' },
        { key: 'Chip', value: 'H2' },
      ],
      shipping: { weight: 0.055, dimensions: '6.1 x 4.5 x 2.4 cm', freeShipping: true, estimatedDays: 2 },
      tags: ['apple', 'airpods', 'earbuds', 'wireless'],
    },
    {
      title: 'Bose QuietComfort 45',
      slug: 'bose-quietcomfort-45',
      description: 'Bose QuietComfort 45 headphones with legendary noise cancellation, comfortable fit, and 24-hour battery life.',
      price: 329, discount: 12, stock: 60,
      category: categoryMap['headphones'], brand: 'Bose', isFeatured: false,
      ratings: 4.6, reviewCount: 134, soldCount: 290,
      images: [
        { url: 'https://picsum.photos/seed/boseqc45/400/500', alt: 'Bose QuietComfort 45', isPrimary: true },
        { url: 'https://picsum.photos/seed/boseqc45b/400/500', alt: 'Bose QC45 on ear', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'black', label: 'Triple Black', stock: 30, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White Smoke', stock: 30, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Battery', value: '24 hours' },
        { key: 'Connectivity', value: 'Bluetooth 5.1' },
        { key: 'Weight', value: '238g' },
      ],
      shipping: { weight: 0.24, dimensions: '21 x 17 x 8 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['bose', 'headphones', 'noise-cancelling', 'wireless'],
    },

    // ── Men's Clothing (5) ──
    {
      title: 'Classic Fit Oxford Shirt',
      slug: 'classic-fit-oxford-shirt',
      description: 'Timeless button-down Oxford shirt crafted from premium cotton. Perfect for casual and semi-formal occasions.',
      price: 79, discount: 10, stock: 150,
      category: categoryMap['mens-clothing'], brand: 'Brooks Brothers', isFeatured: false,
      ratings: 4.3, reviewCount: 56, soldCount: 230,
      images: [
        { url: 'https://picsum.photos/seed/oxfordshirt/400/500', alt: 'Oxford Shirt', isPrimary: true },
        { url: 'https://picsum.photos/seed/oxfordshirtb/400/500', alt: 'Oxford Shirt detail', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: 's', label: 'Small', stock: 30, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'Medium', stock: 40, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'Large', stock: 40, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White', stock: 70, priceModifier: 0 },
        { type: 'color', value: 'light-blue', label: 'Light Blue', stock: 80, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '100% Cotton' },
        { key: 'Fit', value: 'Classic' },
        { key: 'Care', value: 'Machine Washable' },
      ],
      shipping: { weight: 0.3, dimensions: '30 x 25 x 3 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['shirt', 'oxford', 'mens', 'classic'],
    },
    {
      title: 'Slim Fit Chino Pants',
      slug: 'slim-fit-chino-pants',
      description: 'Modern slim-fit chino pants in a stretch cotton blend. Versatile wardrobe staple that works from office to weekend.',
      price: 69, discount: 0, stock: 200,
      category: categoryMap['mens-clothing'], brand: "Levi's", isFeatured: false,
      ratings: 4.2, reviewCount: 43, soldCount: 165,
      images: [
        { url: 'https://picsum.photos/seed/chinopants/400/500', alt: 'Chino Pants', isPrimary: true },
        { url: 'https://picsum.photos/seed/chinopantsb/400/500', alt: 'Chino Pants detail', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '30x30', label: '30x30', stock: 30, priceModifier: 0 },
        { type: 'size', value: '32x32', label: '32x32', stock: 50, priceModifier: 0 },
        { type: 'size', value: '34x32', label: '34x32', stock: 40, priceModifier: 0 },
        { type: 'color', value: 'khaki', label: 'Khaki', stock: 70, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy', stock: 70, priceModifier: 0 },
        { type: 'color', value: 'olive', label: 'Olive', stock: 60, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '97% Cotton, 3% Elastane' },
        { key: 'Fit', value: 'Slim' },
        { key: 'Rise', value: 'Mid Rise' },
      ],
      shipping: { weight: 0.5, dimensions: '35 x 28 x 3 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['chino', 'pants', 'mens', 'slim-fit'],
    },
    {
      title: 'Merino Wool Crew Neck Sweater',
      slug: 'merino-wool-crew-neck-sweater',
      description: 'Luxuriously soft merino wool crew neck sweater. Naturally temperature-regulating, moisture-wicking, and odour-resistant.',
      price: 129, discount: 15, stock: 80,
      category: categoryMap['mens-clothing'], brand: 'Uniqlo', isFeatured: false,
      ratings: 4.5, reviewCount: 67, soldCount: 190,
      images: [
        { url: 'https://picsum.photos/seed/merinowool/400/500', alt: 'Merino Wool Sweater', isPrimary: true },
        { url: 'https://picsum.photos/seed/merinowoolb/400/500', alt: 'Merino Wool Sweater texture', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: 's', label: 'S', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 25, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 15, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy', stock: 30, priceModifier: 0 },
        { type: 'color', value: 'charcoal', label: 'Charcoal', stock: 30, priceModifier: 0 },
        { type: 'color', value: 'camel', label: 'Camel', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '100% Merino Wool' },
        { key: 'Fit', value: 'Regular' },
        { key: 'Care', value: 'Machine wash cold' },
      ],
      shipping: { weight: 0.4, dimensions: '32 x 26 x 4 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['sweater', 'merino', 'wool', 'mens'],
    },
    {
      title: "Levi's 501 Original Jeans",
      slug: 'levis-501-original-jeans',
      description: "The original button-fly jean. Levi's 501 is the quintessential straight-fit jean made from durable denim.",
      price: 89, discount: 0, stock: 250,
      category: categoryMap['mens-clothing'], brand: "Levi's", isFeatured: false,
      ratings: 4.6, reviewCount: 312, soldCount: 780,
      images: [
        { url: 'https://picsum.photos/seed/levis501/400/500', alt: "Levi's 501 Jeans", isPrimary: true },
        { url: 'https://picsum.photos/seed/levis501b/400/500', alt: "Levi's 501 Jeans detail", isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '30x30', label: '30x30', stock: 40, priceModifier: 0 },
        { type: 'size', value: '32x32', label: '32x32', stock: 60, priceModifier: 0 },
        { type: 'size', value: '34x32', label: '34x32', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'stonewash', label: 'Stonewash Blue', stock: 100, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 80, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '100% Cotton Denim' },
        { key: 'Fit', value: 'Straight Fit' },
        { key: 'Closure', value: 'Button Fly' },
      ],
      shipping: { weight: 0.7, dimensions: '35 x 30 x 3 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['jeans', 'levis', 'denim', 'mens', 'classic'],
    },

    // ── Women's Clothing (5) ──
    {
      title: 'Wool Blend Midi Dress',
      slug: 'wool-blend-midi-dress',
      description: 'Elegant wool blend midi dress with A-line silhouette, hidden pockets, and versatile design for office or evening wear.',
      price: 149, discount: 20, stock: 60,
      category: categoryMap['womens-clothing'], brand: 'Zara', isFeatured: true,
      ratings: 4.5, reviewCount: 89, soldCount: 210,
      images: [
        { url: 'https://picsum.photos/seed/mididress/400/500', alt: 'Wool Blend Midi Dress', isPrimary: true },
        { url: 'https://picsum.photos/seed/mididressb/400/500', alt: 'Midi Dress back view', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: 'xs', label: 'XS', stock: 10, priceModifier: 0 },
        { type: 'size', value: 's', label: 'S', stock: 15, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 10, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'burgundy', label: 'Burgundy', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '60% Wool, 40% Polyester' },
        { key: 'Length', value: 'Midi' },
        { key: 'Care', value: 'Dry Clean Only' },
      ],
      shipping: { weight: 0.6, dimensions: '35 x 28 x 4 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['dress', 'midi', 'womens', 'wool', 'elegant'],
    },
    {
      title: "Women's Puffer Jacket",
      slug: 'womens-puffer-jacket',
      description: 'Lightweight yet warm puffer jacket with water-resistant exterior and insulated filling. Perfect for cold weather adventures.',
      price: 119, discount: 25, stock: 90,
      category: categoryMap['womens-clothing'], brand: 'The North Face', isFeatured: false,
      ratings: 4.4, reviewCount: 71, soldCount: 185,
      images: [
        { url: 'https://picsum.photos/seed/pufferjacket/400/500', alt: "Women's Puffer Jacket", isPrimary: true },
        { url: 'https://picsum.photos/seed/pufferjacketb/400/500', alt: 'Puffer Jacket back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: 'xs', label: 'XS', stock: 15, priceModifier: 0 },
        { type: 'size', value: 's', label: 'S', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 30, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 15, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 10, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 45, priceModifier: 0 },
        { type: 'color', value: 'pink', label: 'Dusty Pink', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Outer', value: 'Ripstop polyester' },
        { key: 'Fill', value: '700-fill goose down' },
        { key: 'Water Resistance', value: 'DWR treated' },
      ],
      shipping: { weight: 0.7, dimensions: '40 x 30 x 8 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['jacket', 'puffer', 'womens', 'winter'],
    },
    {
      title: "Women's Yoga Leggings",
      slug: 'womens-yoga-leggings',
      description: 'High-waist yoga leggings with 4-way stretch fabric, moisture-wicking technology, and hidden pocket. Perfect for yoga, running, and everyday wear.',
      price: 59, discount: 0, stock: 300,
      category: categoryMap['womens-clothing'], brand: 'Lululemon', isFeatured: false,
      ratings: 4.7, reviewCount: 245, soldCount: 620,
      images: [
        { url: 'https://picsum.photos/seed/yogaleggings/400/500', alt: 'Yoga Leggings', isPrimary: true },
        { url: 'https://picsum.photos/seed/yogaleggingsb/400/500', alt: 'Yoga Leggings detail', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: 'xs', label: 'XS', stock: 50, priceModifier: 0 },
        { type: 'size', value: 's', label: 'S', stock: 70, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 80, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 60, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 40, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 120, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy', stock: 100, priceModifier: 0 },
        { type: 'color', value: 'grey', label: 'Heather Grey', stock: 80, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: 'Nylon/Lycra blend' },
        { key: 'Waistband', value: 'High-rise' },
        { key: 'Feature', value: 'Hidden side pocket' },
      ],
      shipping: { weight: 0.25, dimensions: '28 x 20 x 3 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['leggings', 'yoga', 'womens', 'activewear'],
    },
    {
      title: 'Floral Wrap Blouse',
      slug: 'floral-wrap-blouse',
      description: 'Elegant floral print wrap blouse in lightweight chiffon. Flattering V-neckline and adjustable tie waist for a customised fit.',
      price: 49, discount: 0, stock: 120,
      category: categoryMap['womens-clothing'], brand: 'H&M', isFeatured: false,
      ratings: 4.1, reviewCount: 38, soldCount: 95,
      images: [
        { url: 'https://picsum.photos/seed/floralblouse/400/500', alt: 'Floral Wrap Blouse', isPrimary: true },
      ],
      variants: [
        { type: 'size', value: 'xs', label: 'XS', stock: 20, priceModifier: 0 },
        { type: 'size', value: 's', label: 'S', stock: 30, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 40, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 10, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '100% Polyester Chiffon' },
        { key: 'Neckline', value: 'V-neck wrap' },
        { key: 'Care', value: 'Hand wash only' },
      ],
      shipping: { weight: 0.2, dimensions: '28 x 20 x 2 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['blouse', 'floral', 'womens', 'chiffon'],
    },

    // ── Shoes (5) ──
    {
      title: 'Nike Air Max 270 React',
      slug: 'nike-air-max-270-react',
      description: 'Combining two of Nike\'s most popular cushioning systems for an incredibly smooth ride with bold lifestyle styling.',
      price: 160, discount: 12, stock: 100,
      category: categoryMap['shoes'], brand: 'Nike', isFeatured: true,
      ratings: 4.6, reviewCount: 198, soldCount: 450,
      images: [
        { url: 'https://picsum.photos/seed/nikeairmax/400/500', alt: 'Nike Air Max 270 React', isPrimary: true },
        { url: 'https://picsum.photos/seed/nikeairmaxb/400/500', alt: 'Nike Air Max 270 side', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '8', label: 'US 8', stock: 15, priceModifier: 0 },
        { type: 'size', value: '9', label: 'US 9', stock: 20, priceModifier: 0 },
        { type: 'size', value: '10', label: 'US 10', stock: 25, priceModifier: 0 },
        { type: 'size', value: '11', label: 'US 11', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'white-black', label: 'White/Black', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'black-red', label: 'Black/Red', stock: 50, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Sole', value: 'Air Max 270 + React foam' },
        { key: 'Upper', value: 'Mesh and synthetic' },
        { key: 'Closure', value: 'Lace-up' },
      ],
      shipping: { weight: 0.85, dimensions: '33 x 20 x 12 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['nike', 'shoes', 'sneakers', 'airmax'],
    },
    {
      title: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      description: 'Adidas Ultraboost 22 with Boost midsole for incredible energy return. Perfect for running or all-day wear.',
      price: 190, discount: 10, stock: 85,
      category: categoryMap['shoes'], brand: 'Adidas', isFeatured: true,
      ratings: 4.7, reviewCount: 156, soldCount: 380,
      images: [
        { url: 'https://picsum.photos/seed/ultraboost22/400/500', alt: 'Adidas Ultraboost 22', isPrimary: true },
        { url: 'https://picsum.photos/seed/ultraboost22b/400/500', alt: 'Adidas Ultraboost 22 detail', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '8', label: 'US 8', stock: 15, priceModifier: 0 },
        { type: 'size', value: '9', label: 'US 9', stock: 20, priceModifier: 0 },
        { type: 'size', value: '10', label: 'US 10', stock: 25, priceModifier: 0 },
        { type: 'size', value: '11', label: 'US 11', stock: 15, priceModifier: 0 },
        { type: 'color', value: 'core-black', label: 'Core Black', stock: 40, priceModifier: 0 },
        { type: 'color', value: 'cloud-white', label: 'Cloud White', stock: 45, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Midsole', value: 'BOOST' },
        { key: 'Upper', value: 'Primeknit+' },
        { key: 'Drop', value: '10mm' },
      ],
      shipping: { weight: 0.9, dimensions: '33 x 21 x 13 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['adidas', 'shoes', 'running', 'boost'],
    },
    {
      title: 'Converse Chuck Taylor All Star',
      slug: 'converse-chuck-taylor-all-star',
      description: 'The iconic Converse Chuck Taylor All Star — a timeless classic with canvas upper and rubber sole.',
      price: 65, discount: 0, stock: 300,
      category: categoryMap['shoes'], brand: 'Converse', isFeatured: false,
      ratings: 4.5, reviewCount: 445, soldCount: 980,
      images: [
        { url: 'https://picsum.photos/seed/chucktaylor/400/500', alt: 'Converse Chuck Taylor', isPrimary: true },
        { url: 'https://picsum.photos/seed/chucktaylorb/400/500', alt: 'Converse Chuck Taylor side', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '7', label: 'US 7', stock: 40, priceModifier: 0 },
        { type: 'size', value: '8', label: 'US 8', stock: 50, priceModifier: 0 },
        { type: 'size', value: '9', label: 'US 9', stock: 60, priceModifier: 0 },
        { type: 'size', value: '10', label: 'US 10', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 100, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White', stock: 100, priceModifier: 0 },
        { type: 'color', value: 'red', label: 'Red', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy', stock: 50, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Upper', value: 'Canvas' },
        { key: 'Sole', value: 'Vulcanised rubber' },
        { key: 'Style', value: 'High Top / Low Top' },
      ],
      shipping: { weight: 0.7, dimensions: '32 x 19 x 12 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['converse', 'shoes', 'sneakers', 'classic'],
    },

    // ── Furniture (3) ──
    {
      title: 'Scandinavian Oak Dining Table',
      slug: 'scandinavian-oak-dining-table',
      description: 'Beautifully crafted solid oak dining table with clean Scandinavian design lines. Seats 6–8 people comfortably.',
      price: 899, discount: 0, stock: 15,
      category: categoryMap['furniture'], brand: 'IKEA', isFeatured: false,
      ratings: 4.4, reviewCount: 28, soldCount: 42,
      images: [
        { url: 'https://picsum.photos/seed/diningtable/400/500', alt: 'Oak Dining Table', isPrimary: true },
        { url: 'https://picsum.photos/seed/diningtableb/400/500', alt: 'Oak Dining Table top view', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '6-seat', label: '6 Seat (180cm)', stock: 10, priceModifier: 0 },
        { type: 'size', value: '8-seat', label: '8 Seat (220cm)', stock: 5, priceModifier: 200 },
      ],
      specifications: [
        { key: 'Material', value: 'Solid Oak' },
        { key: 'Finish', value: 'Natural Oil' },
        { key: 'Weight Capacity', value: '120 kg' },
      ],
      shipping: { weight: 45, dimensions: '185 x 95 x 20 cm', freeShipping: false, estimatedDays: 10 },
      tags: ['table', 'dining', 'oak', 'scandinavian', 'furniture'],
    },
    {
      title: 'Velvet Chesterfield Sofa',
      slug: 'velvet-chesterfield-sofa',
      description: 'Luxurious 3-seater chesterfield sofa in premium velvet upholstery. Deep button-tufted design with solid wood legs.',
      price: 1299, discount: 10, stock: 8,
      category: categoryMap['furniture'], brand: 'Made.com', isFeatured: false,
      ratings: 4.6, reviewCount: 18, soldCount: 24,
      images: [
        { url: 'https://picsum.photos/seed/chesterfieldsofa/400/500', alt: 'Velvet Chesterfield Sofa', isPrimary: true },
        { url: 'https://picsum.photos/seed/chesterfieldsofa b/400/500', alt: 'Sofa detail', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'emerald', label: 'Emerald Green', stock: 3, priceModifier: 0 },
        { type: 'color', value: 'navy', label: 'Navy Blue', stock: 3, priceModifier: 0 },
        { type: 'color', value: 'mustard', label: 'Mustard Yellow', stock: 2, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Seating', value: '3-seater' },
        { key: 'Upholstery', value: 'Premium Velvet' },
        { key: 'Legs', value: 'Solid beech' },
      ],
      shipping: { weight: 75, dimensions: '220 x 90 x 80 cm', freeShipping: false, estimatedDays: 14 },
      tags: ['sofa', 'chesterfield', 'velvet', 'furniture', 'living-room'],
    },
    {
      title: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Premium ergonomic mesh office chair with lumbar support, adjustable armrests, headrest, and 3D lumbar adjustment. Perfect for long workdays.',
      price: 449, discount: 15, stock: 35,
      category: categoryMap['furniture'], brand: 'Herman Miller', isFeatured: false,
      ratings: 4.8, reviewCount: 92, soldCount: 148,
      images: [
        { url: 'https://picsum.photos/seed/officechaireago/400/500', alt: 'Ergonomic Office Chair', isPrimary: true },
        { url: 'https://picsum.photos/seed/officechaireagob/400/500', alt: 'Office Chair side view', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'black', label: 'Black', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'grey', label: 'Grey', stock: 15, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Back', value: 'Breathable mesh' },
        { key: 'Lumbar', value: '3D adjustable' },
        { key: 'Weight Capacity', value: '135 kg' },
      ],
      shipping: { weight: 22, dimensions: '70 x 65 x 30 cm', freeShipping: true, estimatedDays: 7 },
      tags: ['chair', 'office', 'ergonomic', 'furniture'],
    },

    // ── Kitchen (4) ──
    {
      title: 'Professional Chef Knife Set',
      slug: 'professional-chef-knife-set',
      description: '8-piece professional knife set with German stainless steel blades. Includes chef knife, santoku, bread knife, and wooden block.',
      price: 249, discount: 25, stock: 45,
      category: categoryMap['kitchen'], brand: 'Wüsthof', isFeatured: false,
      ratings: 4.8, reviewCount: 77, soldCount: 130,
      images: [
        { url: 'https://picsum.photos/seed/chefknifeset/400/500', alt: 'Chef Knife Set', isPrimary: true },
        { url: 'https://picsum.photos/seed/chefknifesetb/400/500', alt: 'Knife Set on block', isPrimary: false },
      ],
      variants: [],
      specifications: [
        { key: 'Blade Material', value: 'German Stainless Steel' },
        { key: 'Pieces', value: '8' },
        { key: 'Block Material', value: 'Acacia Wood' },
      ],
      shipping: { weight: 3.5, dimensions: '40 x 15 x 20 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['knife', 'kitchen', 'chef', 'cooking'],
    },
    {
      title: 'KitchenAid Stand Mixer',
      slug: 'kitchenaid-stand-mixer',
      description: 'Iconic KitchenAid 5-quart Artisan stand mixer with 10-speed settings, tilt-head design, and multiple attachments for versatile baking.',
      price: 399, discount: 10, stock: 30,
      category: categoryMap['kitchen'], brand: 'KitchenAid', isFeatured: false,
      ratings: 4.9, reviewCount: 234, soldCount: 320,
      images: [
        { url: 'https://picsum.photos/seed/kitchenaidmixer/400/500', alt: 'KitchenAid Stand Mixer', isPrimary: true },
        { url: 'https://picsum.photos/seed/kitchenaidmixerb/400/500', alt: 'KitchenAid Mixer bowl attachment', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'empire-red', label: 'Empire Red', stock: 8, priceModifier: 0 },
        { type: 'color', value: 'ice-blue', label: 'Ice Blue', stock: 8, priceModifier: 0 },
        { type: 'color', value: 'onyx-black', label: 'Onyx Black', stock: 8, priceModifier: 0 },
        { type: 'color', value: 'pistachio', label: 'Pistachio', stock: 6, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Bowl Capacity', value: '5 Quart' },
        { key: 'Power', value: '325W' },
        { key: 'Speeds', value: '10' },
      ],
      shipping: { weight: 11.2, dimensions: '38 x 23 x 35 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['mixer', 'kitchenaid', 'baking', 'kitchen'],
    },
    {
      title: 'Instant Pot Duo 7-in-1',
      slug: 'instant-pot-duo-7-in-1',
      description: 'The Instant Pot Duo replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer, and yogurt maker.',
      price: 99, discount: 5, stock: 80,
      category: categoryMap['kitchen'], brand: 'Instant Pot', isFeatured: false,
      ratings: 4.7, reviewCount: 543, soldCount: 820,
      images: [
        { url: 'https://picsum.photos/seed/instantpot/400/500', alt: 'Instant Pot Duo 7-in-1', isPrimary: true },
        { url: 'https://picsum.photos/seed/instantpotb/400/500', alt: 'Instant Pot open', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '6qt', label: '6-Quart', stock: 50, priceModifier: 0 },
        { type: 'size', value: '8qt', label: '8-Quart', stock: 30, priceModifier: 30 },
      ],
      specifications: [
        { key: 'Functions', value: '7-in-1' },
        { key: 'Capacity', value: '6 Qt' },
        { key: 'Power', value: '1000W' },
      ],
      shipping: { weight: 5.4, dimensions: '33 x 31 x 31 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['pressure-cooker', 'instant-pot', 'kitchen', 'appliance'],
    },
    {
      title: 'Nespresso Vertuo Pop Coffee Maker',
      slug: 'nespresso-vertuo-pop',
      description: 'Next-gen Nespresso machine with unique Centrifusion technology. Makes espresso, double espresso, gran lungo, mug, and alto coffee sizes.',
      price: 169, discount: 0, stock: 55,
      category: categoryMap['kitchen'], brand: 'Nespresso', isFeatured: false,
      ratings: 4.5, reviewCount: 112, soldCount: 198,
      images: [
        { url: 'https://picsum.photos/seed/nespresso/400/500', alt: 'Nespresso Vertuo Pop', isPrimary: true },
        { url: 'https://picsum.photos/seed/nespressob/400/500', alt: 'Nespresso capsule tray', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'black', label: 'Black', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'red', label: 'Mango Red', stock: 15, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Technology', value: 'Centrifusion' },
        { key: 'Capsule', value: 'Vertuo' },
        { key: 'Water Tank', value: '1.1 L' },
      ],
      shipping: { weight: 2.8, dimensions: '16 x 28 x 31 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['coffee', 'nespresso', 'espresso', 'kitchen'],
    },

    // ── Sports & Outdoors (5) ──
    {
      title: 'Trail Running Backpack 20L',
      slug: 'trail-running-backpack-20l',
      description: 'Lightweight water-resistant trail backpack with hydration system compatibility, breathable mesh panel, and multiple pockets.',
      price: 89, discount: 0, stock: 70,
      category: categoryMap['sports-outdoors'], brand: 'Salomon', isFeatured: false,
      ratings: 4.5, reviewCount: 62, soldCount: 145,
      images: [
        { url: 'https://picsum.photos/seed/trailbackpack/400/500', alt: 'Trail Running Backpack', isPrimary: true },
        { url: 'https://picsum.photos/seed/trailbackpackb/400/500', alt: 'Trail Backpack side', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'black', label: 'Black', stock: 30, priceModifier: 0 },
        { type: 'color', value: 'blue', label: 'Blue', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'red', label: 'Red', stock: 20, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Volume', value: '20L' },
        { key: 'Material', value: 'Ripstop Nylon' },
        { key: 'Water Resistant', value: 'Yes' },
      ],
      shipping: { weight: 0.38, dimensions: '48 x 25 x 18 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['backpack', 'running', 'trail', 'outdoors'],
    },
    {
      title: 'Resistance Bands Set (5-Pack)',
      slug: 'resistance-bands-set-5-pack',
      description: 'Professional latex resistance bands set with 5 resistance levels. Ideal for home workouts, physical therapy, and strength training.',
      price: 29, discount: 0, stock: 500,
      category: categoryMap['sports-outdoors'], brand: 'Fit Simplify', isFeatured: false,
      ratings: 4.4, reviewCount: 328, soldCount: 780,
      images: [
        { url: 'https://picsum.photos/seed/resistancebands/400/500', alt: 'Resistance Bands Set', isPrimary: true },
        { url: 'https://picsum.photos/seed/resistancebandsb/400/500', alt: 'Resistance Bands in use', isPrimary: false },
      ],
      variants: [],
      specifications: [
        { key: 'Levels', value: '5 (X-Light to X-Heavy)' },
        { key: 'Material', value: 'Natural Latex' },
        { key: 'Includes', value: 'Carry bag + guide' },
      ],
      shipping: { weight: 0.45, dimensions: '20 x 15 x 10 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['resistance-bands', 'fitness', 'workout', 'sports'],
    },
    {
      title: 'Yoga Mat Premium Non-Slip',
      slug: 'yoga-mat-premium-non-slip',
      description: '6mm eco-friendly TPE yoga mat with non-slip surface on both sides, perfect alignment lines, and carrying strap.',
      price: 45, discount: 10, stock: 200,
      category: categoryMap['sports-outdoors'], brand: 'Manduka', isFeatured: false,
      ratings: 4.6, reviewCount: 187, soldCount: 420,
      images: [
        { url: 'https://picsum.photos/seed/yogamat/400/500', alt: 'Yoga Mat', isPrimary: true },
        { url: 'https://picsum.photos/seed/yogamatb/400/500', alt: 'Yoga Mat rolled', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'purple', label: 'Purple', stock: 70, priceModifier: 0 },
        { type: 'color', value: 'teal', label: 'Teal', stock: 70, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 60, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Thickness', value: '6mm' },
        { key: 'Material', value: 'Eco TPE' },
        { key: 'Dimensions', value: '183 x 61 cm' },
      ],
      shipping: { weight: 0.9, dimensions: '62 x 15 x 15 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['yoga', 'mat', 'fitness', 'sports'],
    },
    {
      title: 'Adjustable Dumbbell Set 5–52.5 lbs',
      slug: 'adjustable-dumbbell-set',
      description: 'Replace 15 sets of dumbbells with one pair. Quick-select dial adjusts weight from 5 to 52.5 lbs in 2.5 lb increments.',
      price: 349, discount: 8, stock: 25,
      category: categoryMap['sports-outdoors'], brand: 'Bowflex', isFeatured: false,
      ratings: 4.7, reviewCount: 142, soldCount: 195,
      images: [
        { url: 'https://picsum.photos/seed/adjustabledumbbell/400/500', alt: 'Adjustable Dumbbell Set', isPrimary: true },
        { url: 'https://picsum.photos/seed/adjustabledumbbellb/400/500', alt: 'Dumbbell detail', isPrimary: false },
      ],
      variants: [],
      specifications: [
        { key: 'Weight Range', value: '5–52.5 lbs per dumbbell' },
        { key: 'Adjustments', value: '2.5 lb increments' },
        { key: 'Replacement', value: '15 sets in one' },
      ],
      shipping: { weight: 24, dimensions: '40 x 22 x 22 cm', freeShipping: true, estimatedDays: 7 },
      tags: ['dumbbells', 'weights', 'home-gym', 'fitness'],
    },
    {
      title: 'Hydro Flask 32 oz Wide Mouth',
      slug: 'hydro-flask-32oz-wide-mouth',
      description: 'TempShield double-wall vacuum insulation keeps drinks cold 24 hours and hot 12 hours. Made from professional-grade stainless steel.',
      price: 49, discount: 0, stock: 300,
      category: categoryMap['sports-outdoors'], brand: 'Hydro Flask', isFeatured: false,
      ratings: 4.8, reviewCount: 412, soldCount: 870,
      images: [
        { url: 'https://picsum.photos/seed/hydroflask/400/500', alt: 'Hydro Flask 32oz', isPrimary: true },
        { url: 'https://picsum.photos/seed/hydroflaskb/400/500', alt: 'Hydro Flask lid detail', isPrimary: false },
      ],
      variants: [
        { type: 'color', value: 'pacific', label: 'Pacific Blue', stock: 60, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 80, priceModifier: 0 },
        { type: 'color', value: 'white', label: 'White', stock: 60, priceModifier: 0 },
        { type: 'color', value: 'watermelon', label: 'Watermelon', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'olive', label: 'Olive', stock: 50, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Capacity', value: '32 oz (946 ml)' },
        { key: 'Material', value: '18/8 Pro-grade stainless steel' },
        { key: 'Cold', value: '24 hours' },
        { key: 'Hot', value: '12 hours' },
      ],
      shipping: { weight: 0.4, dimensions: '10 x 10 x 28 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['water-bottle', 'hydro-flask', 'outdoor', 'sports'],
    },

    // ── Books (8) ──
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      slug: 'clean-code-robert-martin',
      description: 'This book is a must for any developer. Robert C. Martin shows how to write clean, readable, and maintainable code using the principles of Agile development.',
      price: 44, discount: 10, stock: 200,
      category: categoryMap['books'], brand: 'Prentice Hall', isFeatured: false,
      ratings: 4.7, reviewCount: 892, soldCount: 2100,
      images: [
        { url: 'https://picsum.photos/seed/cleancode/400/500', alt: 'Clean Code book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Robert C. Martin' },
        { key: 'Pages', value: '464' },
        { key: 'Publisher', value: 'Prentice Hall' },
        { key: 'ISBN', value: '978-0132350884' },
      ],
      shipping: { weight: 0.7, dimensions: '24 x 17 x 3 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'programming', 'software', 'clean-code'],
    },
    {
      title: 'Atomic Habits',
      slug: 'atomic-habits-james-clear',
      description: 'James Clear reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      price: 27, discount: 0, stock: 300,
      category: categoryMap['books'], brand: 'Avery', isFeatured: false,
      ratings: 4.8, reviewCount: 1243, soldCount: 3200,
      images: [
        { url: 'https://picsum.photos/seed/atomichabits/400/500', alt: 'Atomic Habits book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'James Clear' },
        { key: 'Pages', value: '320' },
        { key: 'Publisher', value: 'Avery' },
        { key: 'ISBN', value: '978-0735211292' },
      ],
      shipping: { weight: 0.45, dimensions: '21 x 14 x 2.5 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'self-help', 'habits', 'productivity'],
    },
    {
      title: 'The Pragmatic Programmer 20th Anniversary',
      slug: 'pragmatic-programmer-20th-anniversary',
      description: 'Anniversary edition of the must-have book for software developers. Filled with practical advice on becoming a more effective programmer.',
      price: 49, discount: 5, stock: 150,
      category: categoryMap['books'], brand: 'Addison-Wesley', isFeatured: false,
      ratings: 4.6, reviewCount: 456, soldCount: 1100,
      images: [
        { url: 'https://picsum.photos/seed/pragmaticprogrammer/400/500', alt: 'The Pragmatic Programmer', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Authors', value: 'David Thomas, Andrew Hunt' },
        { key: 'Pages', value: '352' },
        { key: 'Publisher', value: 'Addison-Wesley' },
        { key: 'Edition', value: '20th Anniversary' },
      ],
      shipping: { weight: 0.65, dimensions: '23 x 16 x 3 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'programming', 'software', 'developer'],
    },
    {
      title: 'Thinking, Fast and Slow',
      slug: 'thinking-fast-and-slow',
      description: 'Nobel Prize winner Daniel Kahneman takes us on a tour of the mind and explains the two systems that drive the way we think.',
      price: 19, discount: 0, stock: 400,
      category: categoryMap['books'], brand: 'Farrar, Straus and Giroux', isFeatured: false,
      ratings: 4.6, reviewCount: 978, soldCount: 2800,
      images: [
        { url: 'https://picsum.photos/seed/thinkingfastslow/400/500', alt: 'Thinking Fast and Slow book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Daniel Kahneman' },
        { key: 'Pages', value: '499' },
        { key: 'Publisher', value: 'Farrar, Straus and Giroux' },
        { key: 'ISBN', value: '978-0374533557' },
      ],
      shipping: { weight: 0.5, dimensions: '21 x 14 x 3 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'psychology', 'thinking', 'non-fiction'],
    },
    {
      title: 'Deep Work: Rules for Focused Success',
      slug: 'deep-work-cal-newport',
      description: 'Cal Newport introduces the concept of focused work without distraction — a skill that is becoming increasingly rare and increasingly valuable in our economy.',
      price: 22, discount: 0, stock: 250,
      category: categoryMap['books'], brand: 'Grand Central Publishing', isFeatured: false,
      ratings: 4.5, reviewCount: 542, soldCount: 1400,
      images: [
        { url: 'https://picsum.photos/seed/deepwork/400/500', alt: 'Deep Work book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Cal Newport' },
        { key: 'Pages', value: '296' },
        { key: 'Publisher', value: 'Grand Central Publishing' },
      ],
      shipping: { weight: 0.4, dimensions: '21 x 14 x 2 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'productivity', 'focus', 'work'],
    },
    {
      title: 'The Lean Startup',
      slug: 'the-lean-startup',
      description: 'Eric Ries shares how entrepreneurs can use his Lean Startup methodology to create more successful companies by continuously testing their vision and adapting.',
      price: 20, discount: 10, stock: 180,
      category: categoryMap['books'], brand: 'Crown Business', isFeatured: false,
      ratings: 4.4, reviewCount: 678, soldCount: 1750,
      images: [
        { url: 'https://picsum.photos/seed/leanstartup/400/500', alt: 'The Lean Startup book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Eric Ries' },
        { key: 'Pages', value: '336' },
        { key: 'Publisher', value: 'Crown Business' },
      ],
      shipping: { weight: 0.42, dimensions: '21 x 14 x 2 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'startup', 'business', 'entrepreneurship'],
    },
    {
      title: 'Zero to One: Notes on Startups',
      slug: 'zero-to-one-peter-thiel',
      description: 'Peter Thiel, co-founder of PayPal and Palantir, argues that we should be doing things that create new things rather than adding more of what works.',
      price: 18, discount: 0, stock: 220,
      category: categoryMap['books'], brand: 'Currency', isFeatured: false,
      ratings: 4.3, reviewCount: 412, soldCount: 1200,
      images: [
        { url: 'https://picsum.photos/seed/zerotoone/400/500', alt: 'Zero to One book', isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Peter Thiel, Blake Masters' },
        { key: 'Pages', value: '224' },
        { key: 'Publisher', value: 'Currency' },
      ],
      shipping: { weight: 0.35, dimensions: '21 x 14 x 1.8 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'startup', 'business', 'innovation'],
    },
    {
      title: "The Manager's Path",
      slug: 'the-managers-path',
      description: 'Camille Fournier provides a roadmap for navigating technical management in the software industry from tech lead to CTO.',
      price: 35, discount: 0, stock: 120,
      category: categoryMap['books'], brand: "O'Reilly Media", isFeatured: false,
      ratings: 4.5, reviewCount: 234, soldCount: 560,
      images: [
        { url: 'https://picsum.photos/seed/managersPath/400/500', alt: "The Manager's Path book", isPrimary: true },
      ],
      variants: [],
      specifications: [
        { key: 'Author', value: 'Camille Fournier' },
        { key: 'Pages', value: '244' },
        { key: 'Publisher', value: "O'Reilly Media" },
      ],
      shipping: { weight: 0.45, dimensions: '23 x 16 x 2 cm', freeShipping: false, estimatedDays: 4 },
      tags: ['book', 'management', 'engineering', 'leadership'],
    },
  ];
}

// ──────────────────────────── MAIN SEED FUNCTION ────────────────────────────

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB…');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear existing data ──
    console.log('\n🗑️  Clearing existing data…');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log('✅ Cleared all collections');

    // ── Create Users ──
    console.log('\n👤 Creating users…');
    const users = await User.create(usersData);
    console.log(`   Created ${users.length} users:`);
    users.forEach((u) => console.log(`   - ${u.name} (${u.email}) [${u.role}]`));

    // ── Create Categories ──
    console.log('\n📂 Creating categories…');
    const categoryMap: Record<string, string> = {};

    for (const cat of categoriesData) {
      const parent = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      });
      categoryMap[cat.slug] = parent._id.toString();
      console.log(`   ✅ ${cat.name}`);

      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          const child = await Category.create({
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            parentCategory: parent._id,
          });
          categoryMap[sub.slug] = child._id.toString();
          console.log(`      └─ ${sub.name}`);
        }
      }
    }

    // ── Create Products ──
    console.log('\n📦 Creating products…');
    const productsData = buildProducts(categoryMap);
    const products = await Product.create(productsData);
    console.log(`   Created ${products.length} products`);
    products.forEach((p) => console.log(`   - ${p.title} ($${p.price})`));

    // ── Create Coupons ──
    console.log('\n🏷️  Creating coupons…');
    const coupons = await Coupon.create(couponsData);
    console.log(`   Created ${coupons.length} coupons:`);
    coupons.forEach((c) =>
      console.log(`   - ${c.code}: ${c.discountType === 'percentage' ? c.discountValue + '%' : '$' + c.discountValue} off (min $${c.minPurchase})`)
    );

    // ── Create Reviews (for first few products) ──
    console.log('\n⭐ Creating reviews…');
    const regularUsers = users.filter((u) => u.role === 'user');
    const reviewsToCreate: any[] = [];
    const reviewComments = [
      'Absolutely love this product! Exceeded my expectations.',
      'Great quality for the price. Would buy again.',
      'Solid product, does exactly what it promises.',
      'A bit expensive but the quality justifies the price.',
      'Fast shipping and great packaging. Product is excellent.',
      'Good product overall, minor issues with packaging.',
    ];

    // Add reviews to first 6 products
    for (let i = 0; i < Math.min(6, products.length); i++) {
      const numReviews = Math.min(regularUsers.length, 2 + (i % 2));
      for (let j = 0; j < numReviews; j++) {
        reviewsToCreate.push({
          user: regularUsers[j % regularUsers.length]._id,
          product: products[i]._id,
          rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
          comment: reviewComments[(i + j) % reviewComments.length],
        });
      }
    }

    const reviews = await Review.create(reviewsToCreate);
    console.log(`   Created ${reviews.length} reviews`);

    // ── Create Sample Orders ──
    console.log('\n🛒 Creating sample orders…');
    const john = regularUsers[0];
    const jane = regularUsers[1];

    const ordersData = [
      {
        user: john._id,
        items: [
          {
            product: products[0]._id,
            title: products[0].title,
            price: products[0].price,
            quantity: 1,
            image: products[0].images[0]?.url || '',
          },
          {
            product: products[3]._id,
            title: products[3].title,
            price: products[3].price,
            quantity: 1,
            image: products[3].images[0]?.url || '',
          },
        ],
        shippingInfo: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
          phone: '+1-555-0101',
        },
        paymentMethod: 'cod',
        subtotal: products[0].price + products[3].price,
        taxPrice: Math.round((products[0].price + products[3].price) * 0.08),
        shippingPrice: 0,
        discountAmount: 0,
        totalPrice:
          products[0].price +
          products[3].price +
          Math.round((products[0].price + products[3].price) * 0.08),
        status: 'delivered',
        isPaid: true,
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: jane._id,
        items: [
          {
            product: products[4]._id,
            title: products[4].title,
            price: products[4].price,
            quantity: 2,
            image: products[4].images[0]?.url || '',
          },
        ],
        shippingInfo: {
          fullName: 'Jane Smith',
          address: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'US',
          phone: '+1-555-0202',
        },
        paymentMethod: 'cod',
        subtotal: products[4].price * 2,
        taxPrice: Math.round(products[4].price * 2 * 0.08),
        shippingPrice: 5,
        discountAmount: 0,
        totalPrice: products[4].price * 2 + Math.round(products[4].price * 2 * 0.08) + 5,
        status: 'processing',
        isPaid: false,
      },
      {
        user: john._id,
        items: [
          {
            product: products[7]._id,
            title: products[7].title,
            price: products[7].price,
            quantity: 1,
            image: products[7].images[0]?.url || '',
          },
        ],
        shippingInfo: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
          phone: '+1-555-0101',
        },
        paymentMethod: 'stripe',
        paymentResult: { id: 'pi_test_123', status: 'succeeded' },
        subtotal: products[7].price,
        taxPrice: Math.round(products[7].price * 0.08),
        shippingPrice: 15,
        discountAmount: 0,
        totalPrice: products[7].price + Math.round(products[7].price * 0.08) + 15,
        status: 'shipped',
        isPaid: true,
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    const orders = await Order.create(ordersData);
    console.log(`   Created ${orders.length} orders`);

    // ── Summary ──
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 SEED COMPLETE');
    console.log('═'.repeat(50));
    console.log(`   Users:      ${users.length}`);
    console.log(`   Categories: ${Object.keys(categoryMap).length}`);
    console.log(`   Products:   ${products.length}`);
    console.log(`   Reviews:    ${reviews.length}`);
    console.log(`   Coupons:    ${coupons.length}`);
    console.log(`   Orders:     ${orders.length}`);
    console.log('\n📋 Test Accounts:');
    console.log('   Admin:  admin@shophub.com  / Admin@123');
    console.log('   User:   john@example.com   / User@123');
    console.log('   User:   jane@example.com   / User@123');
    console.log('\n🏷️  Coupon Codes: WELCOME10, SAVE20, FLAT15');
    console.log('═'.repeat(50));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
