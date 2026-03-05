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
    // ── Electronics ──
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description:
        'Experience the ultimate iPhone with the A17 Pro chip, 48MP camera system, and titanium design. Features a 6.7-inch Super Retina XDR display with ProMotion technology.',
      price: 1199,
      discount: 5,
      stock: 50,
      category: categoryMap['smartphones'],
      brand: 'Apple',
      images: [
        { url: '/uploads/iphone15-1.jpg', alt: 'iPhone 15 Pro Max front', isPrimary: true },
        { url: '/uploads/iphone15-2.jpg', alt: 'iPhone 15 Pro Max back', isPrimary: false },
      ],
      variants: [
        { type: 'size', value: '256gb', label: '256 GB', stock: 20, priceModifier: 0 },
        { type: 'size', value: '512gb', label: '512 GB', stock: 15, priceModifier: 200 },
        { type: 'size', value: '1tb', label: '1 TB', stock: 15, priceModifier: 400 },
        { type: 'color', value: 'titanium-natural', label: 'Natural Titanium', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'titanium-blue', label: 'Blue Titanium', stock: 15, priceModifier: 0 },
        { type: 'color', value: 'titanium-black', label: 'Black Titanium', stock: 15, priceModifier: 0 },
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
      description:
        'The Galaxy S24 Ultra features a built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and a stunning 6.8-inch Dynamic AMOLED display with Galaxy AI features.',
      price: 1299,
      discount: 8,
      stock: 40,
      category: categoryMap['smartphones'],
      brand: 'Samsung',
      images: [
        { url: '/uploads/galaxy-s24-1.jpg', alt: 'Galaxy S24 Ultra front', isPrimary: true },
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
        { key: 'RAM', value: '12 GB' },
        { key: 'Camera', value: '200MP main' },
      ],
      shipping: { weight: 0.233, dimensions: '16.2 x 7.9 x 0.86 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['samsung', 'galaxy', 'smartphone', 'android'],
    },
    {
      title: 'MacBook Pro 16" M3 Max',
      slug: 'macbook-pro-16-m3-max',
      description:
        'The most powerful MacBook Pro ever with the M3 Max chip, delivering extreme performance for demanding workflows. Features a stunning Liquid Retina XDR display.',
      price: 3499,
      discount: 0,
      stock: 25,
      category: categoryMap['laptops'],
      brand: 'Apple',
      images: [
        { url: '/uploads/macbook-pro-1.jpg', alt: 'MacBook Pro 16 open', isPrimary: true },
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
        { key: 'Battery', value: 'Up to 22h' },
      ],
      shipping: { weight: 2.14, dimensions: '35.6 x 24.8 x 1.7 cm', freeShipping: true, estimatedDays: 5 },
      tags: ['macbook', 'apple', 'laptop', 'professional'],
    },
    {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      description:
        'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life, crystal-clear hands-free calling, and multipoint connection.',
      price: 399,
      discount: 15,
      stock: 80,
      category: categoryMap['headphones'],
      brand: 'Sony',
      images: [
        { url: '/uploads/sony-xm5-1.jpg', alt: 'Sony WH-1000XM5', isPrimary: true },
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
        { key: 'Weight', value: '250g' },
      ],
      shipping: { weight: 0.25, dimensions: '22 x 18 x 8 cm', freeShipping: true, estimatedDays: 3 },
      tags: ['headphones', 'sony', 'noise-cancelling', 'wireless'],
    },

    // ── Fashion ──
    {
      title: 'Classic Fit Oxford Shirt',
      slug: 'classic-fit-oxford-shirt',
      description:
        'Timeless button-down Oxford shirt crafted from premium cotton. Perfect for both casual and semi-formal occasions. Machine washable for easy care.',
      price: 79,
      discount: 10,
      stock: 150,
      category: categoryMap['mens-clothing'],
      brand: 'Brooks Brothers',
      images: [
        { url: '/uploads/oxford-shirt-1.jpg', alt: 'Oxford Shirt front', isPrimary: true },
      ],
      variants: [
        { type: 'size', value: 's', label: 'Small', stock: 30, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'Medium', stock: 40, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'Large', stock: 40, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 25, priceModifier: 0 },
        { type: 'size', value: 'xxl', label: 'XXL', stock: 15, priceModifier: 5 },
        { type: 'color', value: 'white', label: 'White', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'light-blue', label: 'Light Blue', stock: 50, priceModifier: 0 },
        { type: 'color', value: 'pink', label: 'Pink', stock: 50, priceModifier: 0 },
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
      title: 'Wool Blend Midi Dress',
      slug: 'wool-blend-midi-dress',
      description:
        'Elegant wool blend midi dress with a flattering A-line silhouette. Features hidden pockets, back zip closure, and a versatile design perfect for office or evening wear.',
      price: 149,
      discount: 20,
      stock: 60,
      category: categoryMap['womens-clothing'],
      brand: 'Zara',
      images: [
        { url: '/uploads/midi-dress-1.jpg', alt: 'Wool Blend Midi Dress', isPrimary: true },
      ],
      variants: [
        { type: 'size', value: 'xs', label: 'XS', stock: 10, priceModifier: 0 },
        { type: 'size', value: 's', label: 'S', stock: 15, priceModifier: 0 },
        { type: 'size', value: 'm', label: 'M', stock: 20, priceModifier: 0 },
        { type: 'size', value: 'l', label: 'L', stock: 10, priceModifier: 0 },
        { type: 'size', value: 'xl', label: 'XL', stock: 5, priceModifier: 0 },
        { type: 'color', value: 'black', label: 'Black', stock: 25, priceModifier: 0 },
        { type: 'color', value: 'burgundy', label: 'Burgundy', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'forest-green', label: 'Forest Green', stock: 15, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Material', value: '60% Wool, 40% Polyester' },
        { key: 'Length', value: 'Midi (below knee)' },
        { key: 'Care', value: 'Dry Clean Only' },
      ],
      shipping: { weight: 0.6, dimensions: '35 x 28 x 4 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['dress', 'midi', 'womens', 'wool', 'elegant'],
    },
    {
      title: 'Nike Air Max 270 React',
      slug: 'nike-air-max-270-react',
      description:
        'Combining two of Nike\'s most popular cushioning systems, the Air Max 270 React delivers an incredibly smooth ride with a bold lifestyle look.',
      price: 160,
      discount: 12,
      stock: 100,
      category: categoryMap['shoes'],
      brand: 'Nike',
      images: [
        { url: '/uploads/nike-airmax-1.jpg', alt: 'Nike Air Max 270 React', isPrimary: true },
      ],
      variants: [
        { type: 'size', value: '8', label: 'US 8', stock: 15, priceModifier: 0 },
        { type: 'size', value: '9', label: 'US 9', stock: 20, priceModifier: 0 },
        { type: 'size', value: '10', label: 'US 10', stock: 25, priceModifier: 0 },
        { type: 'size', value: '11', label: 'US 11', stock: 20, priceModifier: 0 },
        { type: 'size', value: '12', label: 'US 12', stock: 20, priceModifier: 0 },
        { type: 'color', value: 'white-black', label: 'White/Black', stock: 35, priceModifier: 0 },
        { type: 'color', value: 'black-red', label: 'Black/Red', stock: 35, priceModifier: 0 },
        { type: 'color', value: 'blue-void', label: 'Blue Void', stock: 30, priceModifier: 0 },
      ],
      specifications: [
        { key: 'Sole', value: 'Air Max 270 + React' },
        { key: 'Upper', value: 'Mesh and synthetic' },
        { key: 'Closure', value: 'Lace-up' },
      ],
      shipping: { weight: 0.85, dimensions: '33 x 20 x 12 cm', freeShipping: true, estimatedDays: 4 },
      tags: ['nike', 'shoes', 'sneakers', 'airmax'],
    },

    // ── Home & Living ──
    {
      title: 'Scandinavian Oak Dining Table',
      slug: 'scandinavian-oak-dining-table',
      description:
        'Beautifully crafted solid oak dining table with clean Scandinavian design lines. Seats 6-8 people comfortably. Natural oil finish for lasting beauty.',
      price: 899,
      discount: 0,
      stock: 15,
      category: categoryMap['furniture'],
      brand: 'IKEA',
      images: [
        { url: '/uploads/dining-table-1.jpg', alt: 'Oak Dining Table', isPrimary: true },
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
      title: 'Professional Chef Knife Set',
      slug: 'professional-chef-knife-set',
      description:
        '8-piece professional knife set with German stainless steel blades. Includes chef\'s knife, santoku, bread knife, utility knife, paring knife, shears, sharpener, and wooden block.',
      price: 249,
      discount: 25,
      stock: 45,
      category: categoryMap['kitchen'],
      brand: 'Wüsthof',
      images: [
        { url: '/uploads/knife-set-1.jpg', alt: 'Chef Knife Set', isPrimary: true },
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

    // ── Sports & Outdoors ──
    {
      title: 'Trail Running Backpack 20L',
      slug: 'trail-running-backpack-20l',
      description:
        'Lightweight, water-resistant trail running backpack with hydration system compatibility. Features breathable mesh back panel, adjustable sternum strap, and multiple pockets.',
      price: 89,
      discount: 0,
      stock: 70,
      category: categoryMap['sports-outdoors'],
      brand: 'Salomon',
      images: [
        { url: '/uploads/backpack-1.jpg', alt: 'Trail Running Backpack', isPrimary: true },
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
        { key: 'Weight', value: '380g' },
      ],
      shipping: { weight: 0.38, dimensions: '48 x 25 x 18 cm', freeShipping: false, estimatedDays: 5 },
      tags: ['backpack', 'running', 'trail', 'outdoors'],
    },

    // ── Books ──
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      slug: 'clean-code-robert-martin',
      description:
        'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, or team lead.',
      price: 44,
      discount: 10,
      stock: 200,
      category: categoryMap['books'],
      brand: 'Prentice Hall',
      images: [
        { url: '/uploads/clean-code-1.jpg', alt: 'Clean Code book cover', isPrimary: true },
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
      description:
        'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      price: 27,
      discount: 0,
      stock: 300,
      category: categoryMap['books'],
      brand: 'Avery',
      images: [
        { url: '/uploads/atomic-habits-1.jpg', alt: 'Atomic Habits book cover', isPrimary: true },
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
