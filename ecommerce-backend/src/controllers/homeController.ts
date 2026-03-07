import { Request, Response, NextFunction } from 'express';
import HeroBanner from '../models/HeroSlider';
import Product from '../models/Product';
import Category from '../models/Category';
import asyncHandler from '../utils/asyncHandler';

const HOME_PRODUCT_LIMIT = 8;

const productProjection = {
  title: 1,
  slug: 1,
  price: 1,
  discount: 1,
  images: 1,
  ratings: 1,
  reviewCount: 1,
  soldCount: 1,
  isActive: 1,
  createdAt: 1,
  category: 1,
  brand: 1,
};

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
      // All active banners
      HeroBanner.find({ isActive: true })
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
        .populate('category', 'name slug')
        .lean(),

      // Trending: active products from the last 30 days, highest soldCount
      Product.find({ isActive: true, createdAt: { $gte: thirtyDaysAgo } })
        .sort({ soldCount: -1, ratings: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .populate('category', 'name slug')
        .lean(),

      // Best Selling: all-time highest soldCount
      Product.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .populate('category', 'name slug')
        .lean(),

      // Top Rated: highest ratings (min 1 review to avoid zero-review products)
      Product.find({ isActive: true, reviewCount: { $gte: 1 } })
        .sort({ ratings: -1, reviewCount: -1 })
        .limit(HOME_PRODUCT_LIMIT)
        .select(productProjection)
        .populate('category', 'name slug')
        .lean(),
    ]);

    // Split hero banners by position
    const slider = heroBanners.filter((b: any) => b.position === 'slider');
    const rightTop = heroBanners.find((b: any) => b.position === 'rightTop') || null;
    const rightBottom = heroBanners.find((b: any) => b.position === 'rightBottom') || null;

    res.status(200).json({
      success: true,
      data: {
        slider,
        rightTop,
        rightBottom,
        categories,
        newArrivals,
        trendingProducts,
        bestSellingProducts,
        topRatedProducts,
      },
    });
  }
);
