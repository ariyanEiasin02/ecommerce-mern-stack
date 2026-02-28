import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Review from '../models/Review';
import Coupon from '../models/Coupon';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // Create Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'superAdmin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
        role: 'user',
      },
    ]);
    console.log(`Created ${users.length} users.`);

    // Create Categories
    const electronics = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    });

    const clothing = await Category.create({
      name: 'Clothing',
      slug: 'clothing',
      description: 'Men and women clothing',
      isActive: true,
    });

    const categories = await Category.create([
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Audio headphones and earbuds',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Cameras',
        slug: 'cameras',
        description: 'Digital cameras and accessories',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles and accessories',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: "Men's fashion and apparel",
        parentCategory: clothing._id,
        isActive: true,
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: "Women's fashion and apparel",
        parentCategory: clothing._id,
        isActive: true,
      },
      {
        name: 'Monitors',
        slug: 'monitors',
        description: 'Computer monitors and displays',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablet computers',
        parentCategory: electronics._id,
        isActive: true,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Tech accessories',
        parentCategory: electronics._id,
        isActive: true,
      },
    ]);
    console.log(`Created ${categories.length + 2} categories.`);

    const laptopsCat = categories[0];
    const smartphonesCat = categories[1];
    const headphonesCat = categories[2];
    const camerasCat = categories[3];
    const gamingCat = categories[4];
    const mensCat = categories[5];
    const womensCat = categories[6];
    const monitorsCat = categories[7];
    const tabletsCat = categories[8];

    // Create Products
    const products = await Product.create([
      {
        title: 'MacBook Pro 16" M3 Pro',
        slug: 'macbook-pro-16-m3-pro',
        description:
          'The most advanced MacBook Pro ever. With the blazing-fast M3 Pro chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.',
        price: 2499,
        discount: 5,
        stock: 25,
        images: [
          { url: '/uploads/macbook-pro.jpg', alt: 'MacBook Pro 16', isPrimary: true },
          { url: '/uploads/macbook-pro-2.jpg', alt: 'MacBook Pro Side' },
        ],
        category: laptopsCat._id,
        brand: 'Apple',
        variants: [
          { type: 'storage', value: '512gb', label: '512GB SSD', stock: 15, priceModifier: 0 },
          { type: 'storage', value: '1tb', label: '1TB SSD', stock: 10, priceModifier: 200 },
          { type: 'color', value: 'space-black', label: 'Space Black', stock: 12, priceModifier: 0 },
          { type: 'color', value: 'silver', label: 'Silver', stock: 13, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Processor', value: 'Apple M3 Pro' },
          { key: 'RAM', value: '18GB Unified Memory' },
          { key: 'Display', value: '16.2" Liquid Retina XDR' },
          { key: 'Battery', value: 'Up to 22 hours' },
        ],
        shipping: { weight: 2.14, freeShipping: true, estimatedDays: 3 },
        tags: ['laptop', 'apple', 'macbook', 'professional'],
        soldCount: 145,
        isActive: true,
      },
      {
        title: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description:
          'iPhone 15 Pro Max. Forged in titanium. Featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
        price: 1199,
        discount: 0,
        stock: 50,
        images: [
          { url: '/uploads/iphone-15-pro.jpg', alt: 'iPhone 15 Pro Max', isPrimary: true },
        ],
        category: smartphonesCat._id,
        brand: 'Apple',
        variants: [
          { type: 'storage', value: '256gb', label: '256GB', stock: 20, priceModifier: 0 },
          { type: 'storage', value: '512gb', label: '512GB', stock: 15, priceModifier: 200 },
          { type: 'storage', value: '1tb', label: '1TB', stock: 15, priceModifier: 400 },
          { type: 'color', value: 'natural-titanium', label: 'Natural Titanium', stock: 20, priceModifier: 0 },
          { type: 'color', value: 'blue-titanium', label: 'Blue Titanium', stock: 15, priceModifier: 0 },
          { type: 'color', value: 'white-titanium', label: 'White Titanium', stock: 15, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Processor', value: 'A17 Pro' },
          { key: 'Display', value: '6.7" Super Retina XDR' },
          { key: 'Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
          { key: 'Battery', value: 'Up to 29 hours video playback' },
        ],
        shipping: { weight: 0.221, freeShipping: true, estimatedDays: 2 },
        tags: ['smartphone', 'apple', 'iphone', 'premium'],
        soldCount: 320,
        isActive: true,
      },
      {
        title: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description:
          'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones.',
        price: 349.99,
        discount: 15,
        stock: 80,
        images: [
          { url: '/uploads/sony-xm5.jpg', alt: 'Sony WH-1000XM5', isPrimary: true },
        ],
        category: headphonesCat._id,
        brand: 'Sony',
        variants: [
          { type: 'color', value: 'black', label: 'Black', stock: 40, priceModifier: 0 },
          { type: 'color', value: 'silver', label: 'Silver', stock: 20, priceModifier: 0 },
          { type: 'color', value: 'midnight-blue', label: 'Midnight Blue', stock: 20, priceModifier: 10 },
        ],
        specifications: [
          { key: 'Driver', value: '30mm' },
          { key: 'Battery', value: '30 hours' },
          { key: 'Weight', value: '250g' },
          { key: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm' },
        ],
        shipping: { weight: 0.25, freeShipping: true, estimatedDays: 3 },
        tags: ['headphones', 'sony', 'noise-cancelling', 'wireless'],
        soldCount: 210,
        isActive: true,
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description:
          'Galaxy AI is here. The most powerful Galaxy S device yet, with a built-in S Pen, titanium frame, and advanced AI features.',
        price: 1299.99,
        discount: 10,
        stock: 35,
        images: [
          { url: '/uploads/galaxy-s24.jpg', alt: 'Samsung Galaxy S24 Ultra', isPrimary: true },
        ],
        category: smartphonesCat._id,
        brand: 'Samsung',
        variants: [
          { type: 'storage', value: '256gb', label: '256GB', stock: 15, priceModifier: 0 },
          { type: 'storage', value: '512gb', label: '512GB', stock: 10, priceModifier: 120 },
          { type: 'storage', value: '1tb', label: '1TB', stock: 10, priceModifier: 240 },
          { type: 'color', value: 'titanium-black', label: 'Titanium Black', stock: 12, priceModifier: 0 },
          { type: 'color', value: 'titanium-gray', label: 'Titanium Gray', stock: 12, priceModifier: 0 },
          { type: 'color', value: 'titanium-violet', label: 'Titanium Violet', stock: 11, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
          { key: 'Display', value: '6.8" Dynamic AMOLED 2X' },
          { key: 'Camera', value: '200MP Main + AI' },
          { key: 'S Pen', value: 'Built-in' },
        ],
        shipping: { weight: 0.232, freeShipping: true, estimatedDays: 2 },
        tags: ['smartphone', 'samsung', 'galaxy', 'ai'],
        soldCount: 185,
        isActive: true,
      },
      {
        title: 'Dell XPS 15 (2024)',
        slug: 'dell-xps-15-2024',
        description:
          'Ultra-thin, powerful laptop with InfinityEdge display. Perfect for creators and professionals.',
        price: 1799,
        discount: 12,
        stock: 20,
        images: [
          { url: '/uploads/dell-xps-15.jpg', alt: 'Dell XPS 15', isPrimary: true },
        ],
        category: laptopsCat._id,
        brand: 'Dell',
        variants: [
          { type: 'storage', value: '512gb', label: '512GB SSD', stock: 10, priceModifier: 0 },
          { type: 'storage', value: '1tb', label: '1TB SSD', stock: 10, priceModifier: 150 },
          { type: 'color', value: 'platinum-silver', label: 'Platinum Silver', stock: 20, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Processor', value: 'Intel Core i7-13700H' },
          { key: 'RAM', value: '16GB DDR5' },
          { key: 'Display', value: '15.6" OLED 3.5K' },
          { key: 'GPU', value: 'NVIDIA RTX 4060' },
        ],
        shipping: { weight: 1.86, freeShipping: true, estimatedDays: 4 },
        tags: ['laptop', 'dell', 'xps', 'creator'],
        soldCount: 98,
        isActive: true,
      },
      {
        title: 'Sony Alpha A7 IV',
        slug: 'sony-alpha-a7-iv',
        description:
          'Full-frame mirrorless camera with 33MP sensor, real-time Eye AF, and 4K 60p video recording.',
        price: 2498,
        discount: 8,
        stock: 15,
        images: [
          { url: '/uploads/sony-a7iv.jpg', alt: 'Sony Alpha A7 IV', isPrimary: true },
        ],
        category: camerasCat._id,
        brand: 'Sony',
        variants: [
          { type: 'kit', value: 'body-only', label: 'Body Only', stock: 8, priceModifier: 0 },
          { type: 'kit', value: 'with-lens', label: 'With 28-70mm Lens', stock: 7, priceModifier: 200 },
        ],
        specifications: [
          { key: 'Sensor', value: '33MP Full-Frame CMOS' },
          { key: 'ISO Range', value: '100-51200' },
          { key: 'Video', value: '4K 60fps' },
          { key: 'Stabilization', value: '5-Axis IBIS' },
        ],
        shipping: { weight: 0.658, freeShipping: true, estimatedDays: 3 },
        tags: ['camera', 'sony', 'mirrorless', 'full-frame'],
        soldCount: 67,
        isActive: true,
      },
      {
        title: 'PlayStation 5 Console',
        slug: 'playstation-5-console',
        description: 'Experience lightning-fast loading, deeper immersion with haptic feedback, and breathtaking graphics.',
        price: 499.99,
        discount: 0,
        stock: 40,
        images: [
          { url: '/uploads/ps5.jpg', alt: 'PlayStation 5', isPrimary: true },
        ],
        category: gamingCat._id,
        brand: 'Sony',
        variants: [
          { type: 'edition', value: 'disc', label: 'Disc Edition', stock: 20, priceModifier: 0 },
          { type: 'edition', value: 'digital', label: 'Digital Edition', stock: 20, priceModifier: -100 },
        ],
        specifications: [
          { key: 'CPU', value: 'AMD Zen 2, 8 Cores' },
          { key: 'GPU', value: 'AMD RDNA 2, 10.28 TFLOPs' },
          { key: 'Storage', value: '825GB SSD' },
          { key: 'Resolution', value: 'Up to 8K' },
        ],
        shipping: { weight: 4.5, freeShipping: true, estimatedDays: 3 },
        tags: ['gaming', 'playstation', 'console', 'sony'],
        soldCount: 450,
        isActive: true,
      },
      {
        title: 'Classic Fit Oxford Shirt',
        slug: 'classic-fit-oxford-shirt',
        description: 'Premium cotton oxford shirt with button-down collar. A timeless wardrobe essential.',
        price: 79.99,
        discount: 20,
        stock: 100,
        images: [
          { url: '/uploads/oxford-shirt.jpg', alt: 'Oxford Shirt', isPrimary: true },
        ],
        category: mensCat._id,
        brand: 'Ralph Lauren',
        variants: [
          { type: 'size', value: 's', label: 'Small', stock: 20, priceModifier: 0 },
          { type: 'size', value: 'm', label: 'Medium', stock: 25, priceModifier: 0 },
          { type: 'size', value: 'l', label: 'Large', stock: 25, priceModifier: 0 },
          { type: 'size', value: 'xl', label: 'X-Large', stock: 20, priceModifier: 0 },
          { type: 'size', value: 'xxl', label: '2X-Large', stock: 10, priceModifier: 5 },
          { type: 'color', value: 'white', label: 'White', stock: 40, priceModifier: 0 },
          { type: 'color', value: 'blue', label: 'Light Blue', stock: 30, priceModifier: 0 },
          { type: 'color', value: 'pink', label: 'Pink', stock: 30, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Material', value: '100% Cotton' },
          { key: 'Fit', value: 'Classic' },
          { key: 'Collar', value: 'Button-Down' },
          { key: 'Care', value: 'Machine Washable' },
        ],
        shipping: { weight: 0.3, freeShipping: false, estimatedDays: 5 },
        tags: ['shirt', 'mens', 'oxford', 'classic'],
        soldCount: 230,
        isActive: true,
      },
      {
        title: 'Elegant Silk Midi Dress',
        slug: 'elegant-silk-midi-dress',
        description: 'Luxurious silk midi dress with flowing silhouette. Perfect for formal occasions and evening events.',
        price: 189.99,
        discount: 25,
        stock: 45,
        images: [
          { url: '/uploads/silk-dress.jpg', alt: 'Silk Midi Dress', isPrimary: true },
        ],
        category: womensCat._id,
        brand: 'Zara',
        variants: [
          { type: 'size', value: 'xs', label: 'XS', stock: 8, priceModifier: 0 },
          { type: 'size', value: 's', label: 'Small', stock: 10, priceModifier: 0 },
          { type: 'size', value: 'm', label: 'Medium', stock: 12, priceModifier: 0 },
          { type: 'size', value: 'l', label: 'Large', stock: 10, priceModifier: 0 },
          { type: 'size', value: 'xl', label: 'X-Large', stock: 5, priceModifier: 0 },
          { type: 'color', value: 'navy', label: 'Navy Blue', stock: 20, priceModifier: 0 },
          { type: 'color', value: 'burgundy', label: 'Burgundy', stock: 15, priceModifier: 0 },
          { type: 'color', value: 'emerald', label: 'Emerald Green', stock: 10, priceModifier: 10 },
        ],
        specifications: [
          { key: 'Material', value: '100% Silk' },
          { key: 'Length', value: 'Midi' },
          { key: 'Closure', value: 'Side Zip' },
          { key: 'Care', value: 'Dry Clean Only' },
        ],
        shipping: { weight: 0.4, freeShipping: false, estimatedDays: 5 },
        tags: ['dress', 'womens', 'silk', 'formal'],
        soldCount: 175,
        isActive: true,
      },
      {
        title: 'LG UltraGear 27" 4K Gaming Monitor',
        slug: 'lg-ultragear-27-4k-gaming-monitor',
        description: '27" UHD IPS display with 144Hz refresh rate, 1ms response time, and NVIDIA G-SYNC compatibility.',
        price: 699.99,
        discount: 18,
        stock: 30,
        images: [
          { url: '/uploads/lg-monitor.jpg', alt: 'LG UltraGear Monitor', isPrimary: true },
        ],
        category: monitorsCat._id,
        brand: 'LG',
        variants: [],
        specifications: [
          { key: 'Resolution', value: '3840 x 2160 (4K UHD)' },
          { key: 'Refresh Rate', value: '144Hz' },
          { key: 'Response Time', value: '1ms GtG' },
          { key: 'Panel', value: 'Nano IPS' },
          { key: 'HDR', value: 'VESA DisplayHDR 600' },
        ],
        shipping: { weight: 6.3, freeShipping: true, estimatedDays: 4 },
        tags: ['monitor', 'gaming', 'lg', '4k'],
        soldCount: 120,
        isActive: true,
      },
      {
        title: 'iPad Pro 12.9" M2',
        slug: 'ipad-pro-129-m2',
        description: 'Supercharged by M2 chip. With Liquid Retina XDR display, ProRes, and stage manager.',
        price: 1099,
        discount: 7,
        stock: 22,
        images: [
          { url: '/uploads/ipad-pro.jpg', alt: 'iPad Pro 12.9"', isPrimary: true },
        ],
        category: tabletsCat._id,
        brand: 'Apple',
        variants: [
          { type: 'storage', value: '128gb', label: '128GB', stock: 8, priceModifier: 0 },
          { type: 'storage', value: '256gb', label: '256GB', stock: 7, priceModifier: 100 },
          { type: 'storage', value: '512gb', label: '512GB', stock: 7, priceModifier: 200 },
          { type: 'color', value: 'space-gray', label: 'Space Gray', stock: 12, priceModifier: 0 },
          { type: 'color', value: 'silver', label: 'Silver', stock: 10, priceModifier: 0 },
        ],
        specifications: [
          { key: 'Processor', value: 'Apple M2' },
          { key: 'Display', value: '12.9" Liquid Retina XDR' },
          { key: 'Camera', value: '12MP Wide + 10MP Ultra Wide' },
          { key: 'Connectivity', value: 'Wi-Fi 6E, Bluetooth 5.3' },
        ],
        shipping: { weight: 0.682, freeShipping: true, estimatedDays: 2 },
        tags: ['tablet', 'apple', 'ipad', 'professional'],
        soldCount: 88,
        isActive: true,
      },
      {
        title: 'AirPods Pro (2nd Generation)',
        slug: 'airpods-pro-2nd-generation',
        description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking.',
        price: 249,
        discount: 10,
        stock: 100,
        images: [
          { url: '/uploads/airpods-pro.jpg', alt: 'AirPods Pro', isPrimary: true },
        ],
        category: headphonesCat._id,
        brand: 'Apple',
        variants: [],
        specifications: [
          { key: 'Chip', value: 'Apple H2' },
          { key: 'Battery', value: 'Up to 6 hours (30h with case)' },
          { key: 'Noise Cancellation', value: 'Active Noise Cancellation' },
          { key: 'Water Resistance', value: 'IPX4' },
        ],
        shipping: { weight: 0.05, freeShipping: true, estimatedDays: 2 },
        tags: ['headphones', 'apple', 'airpods', 'wireless'],
        soldCount: 520,
        isActive: true,
      },
    ]);
    console.log(`Created ${products.length} products.`);

    // Create Reviews
    const reviewsData = [
      { user: users[1]._id, product: products[0]._id, rating: 5, comment: 'Absolutely incredible laptop! The M3 Pro chip is blazing fast. Best laptop I have ever owned.' },
      { user: users[2]._id, product: products[0]._id, rating: 4, comment: 'Great performance but quite expensive. Battery life is amazing though.' },
      { user: users[3]._id, product: products[0]._id, rating: 5, comment: 'Perfect for development work. The display is stunning and the keyboard feels great.' },
      { user: users[1]._id, product: products[1]._id, rating: 5, comment: 'The camera system is incredible. Best phone camera I have ever used.' },
      { user: users[2]._id, product: products[1]._id, rating: 4, comment: 'Excellent phone but the price is steep. Titanium frame feels premium.' },
      { user: users[4]._id, product: products[1]._id, rating: 5, comment: 'Love the Action button! Great upgrade from iPhone 13.' },
      { user: users[1]._id, product: products[2]._id, rating: 5, comment: 'Best noise cancelling headphones on the market. Incredibly comfortable too.' },
      { user: users[3]._id, product: products[2]._id, rating: 4, comment: 'Sound quality is excellent. ANC is top notch. Wish they folded flat.' },
      { user: users[2]._id, product: products[3]._id, rating: 5, comment: 'Galaxy AI features are game-changing. S Pen is super useful.' },
      { user: users[4]._id, product: products[3]._id, rating: 4, comment: 'Great phone with amazing display. Camera zoom is unreal.' },
      { user: users[5]._id, product: products[6]._id, rating: 5, comment: 'The PS5 is an incredible gaming experience. Loading times are virtually non-existent.' },
      { user: users[1]._id, product: products[6]._id, rating: 5, comment: 'DualSense controller is revolutionary. Haptic feedback adds so much immersion.' },
      { user: users[3]._id, product: products[11]._id, rating: 5, comment: 'AirPods Pro 2 are a massive upgrade. ANC is spectacular.' },
      { user: users[4]._id, product: products[11]._id, rating: 4, comment: 'Great sound quality and the case speaker is handy for finding them.' },
      { user: users[5]._id, product: products[9]._id, rating: 5, comment: 'This monitor is a dream for gaming. 4K at 144Hz is buttery smooth.' },
    ];

    const reviews = await Review.create(reviewsData);
    console.log(`Created ${reviews.length} reviews.`);

    // Create Coupons
    const coupons = await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 50,
        maxUses: 1000,
        expiresAt: new Date('2027-12-31'),
        isActive: true,
      },
      {
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 100,
        maxUses: 500,
        expiresAt: new Date('2027-06-30'),
        isActive: true,
      },
      {
        code: 'FLAT50',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 200,
        maxUses: 200,
        expiresAt: new Date('2027-03-31'),
        isActive: true,
      },
    ]);
    console.log(`Created ${coupons.length} coupons.`);

    console.log('\n--- Seed Complete ---');
    console.log('Admin login: admin@example.com / admin123');
    console.log('User login:  john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
