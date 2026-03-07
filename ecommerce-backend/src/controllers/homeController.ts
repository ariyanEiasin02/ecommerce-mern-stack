import { Request, Response, NextFunction } from 'express';
import HeroBanner from '../models/HeroSlider';
import Product from '../models/Product';
import Category from '../models/Category';
import asyncHandler from '../utils/asyncHandler';

const HOME_PRODUCT_LIMIT = 8;

// Only the fields needed for home page product cards
const productProjection = { title: 1, price: 1, discount: 1, images: 1, soldCount: 1, stock: 1 };

/** Shape each raw product document into the lean card payload. */
function mapProduct(p: any) {
  const originalPrice: number = p.price;
  const discount: number = p.discount ?? 0;
  const sellingPrice = discount > 0
    ? +((originalPrice * (1 - discount / 100)).toFixed(2))
    : originalPrice;

  // Up to 2 image URLs: index 0 = default display, index 1 = hover
  const images: string[] = (p.images as any[])
    .slice(0, 2)
    .map((img: any) => img.url as string);

  return {
    id: p._id,
    name: p.title,
    price: sellingPrice,
    originalPrice: discount > 0 ? originalPrice : undefined,
    discount: discount > 0 ? discount : undefined,
    images,
    sold: p.soldCount ?? 0,
    stock: p.stock ?? 0,
  };
}

// @desc    Get all home page data (public)
// @route   GET /api/home
// @access  Public
export const getHomePageData = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      heroBanners,
      categories,
      newArrivals,
      trendingProducts,
      bestSellingProducts,
      topRatedProducts,
    ] = await Promise.all([
      // All active banners (select only fields we need)
      HeroBanner.find({ isActive: true })
        .select('link image position sortOrder')
        .sort({ sortOrder: 1 })
        .lean(),

      // Categories with image
      Category.find({ isActive: true })
        .select('name slug image')
        .sort({ sortOrder: 1, name: 1 })
        .lean(),

      // New Arrivals: most recently added active products
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .lean(),

      // Trending: active products from the last 30 days, highest soldCount
      Product.find({ isActive: true, createdAt: { $gte: thirtyDaysAgo } })
        .sort({ soldCount: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .lean(),

      // Best Selling: all-time highest soldCount
      Product.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .lean(),

      // Top Rated: highest ratings (min 1 review to avoid zero-review products)
      Product.find({ isActive: true, reviewCount: { $gte: 1 } })
        .sort({ ratings: -1, reviewCount: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .lean(),
    ]);

    // Split hero banners by position and expose only id, link and image
    const slider = heroBanners
      .filter((b: any) => b.position === 'slider')
      .map((b: any) => ({ id: b._id, link: b.link, image: b.image }));

    const _rightTop = heroBanners.find((b: any) => b.position === 'rightTop') || null;
    const rightTop = _rightTop ? { id: _rightTop._id, link: _rightTop.link, image: _rightTop.image } : null;

    const _rightBottom = heroBanners.find((b: any) => b.position === 'rightBottom') || null;
    const rightBottom = _rightBottom ? { id: _rightBottom._id, link: _rightBottom.link, image: _rightBottom.image } : null;

    res.status(200).json({
      success: true,
      data: {
        slider,
        rightTop,
        rightBottom,
        categories,
        newArrivals: (newArrivals as any[]).map(mapProduct),
        trendingProducts: (trendingProducts as any[]).map(mapProduct),
        bestSellingProducts: (bestSellingProducts as any[]).map(mapProduct),
        topRatedProducts: (topRatedProducts as any[]).map(mapProduct),
      },
    });
  }
);
