import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import slugify from 'slugify';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Get all products (with filtering, sorting, pagination, search)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip  = (page - 1) * limit;

    // ── Build filter ────────────────────────────────────────────────────
    const filter: Record<string, unknown> = { isActive: true };

    // Category + Subcategory (resolve slugs → ObjectIds)
    if (req.query.subcategory) {
      // Exact subcategory slug match
      const sub = await Category.findOne({
        slug: req.query.subcategory as string,
        isActive: true,
      }).lean();
      // Use impossible ObjectId when slug not found so result set is empty
      filter.category = sub ? sub._id : new mongoose.Types.ObjectId();
    } else if (req.query.category) {
      // Parent category + all its direct children
      const parent = await Category.findOne({
        slug: req.query.category as string,
        isActive: true,
      }).lean();
      if (parent) {
        const children = await Category.find({
          parentCategory: parent._id,
          isActive: true,
        })
          .select('_id')
          .lean();
        filter.category = { $in: [parent._id, ...children.map((c) => c._id)] };
      } else {
        filter.category = new mongoose.Types.ObjectId(); // no match → empty
      }
    }

    // Price range (slider support)
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice as string);
      filter.price = priceFilter;
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand as string, $options: 'i' };
    }

    // Rating filter (≥ N stars)
    if (req.query.rating) {
      const minRating = parseFloat(req.query.rating as string);
      if (minRating >= 1 && minRating <= 5) {
        filter.ratings = { $gte: minRating };
      }
    }

    // Featured filter
    if (req.query.isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Full-text search by product name / tags / description
    const searchQuery = (req.query.search as string)?.trim();
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    // ── Build sort ──────────────────────────────────────────────────────
    const buildSort = (s: string): Record<string, 1 | -1> => {
      switch (s) {
        case 'price':
        case 'price-low':
          return { price: 1 };
        case '-price':
        case 'price-high':
          return { price: -1 };
        case '-soldCount':
        case 'popularity':
          return { soldCount: -1 };
        case '-ratings':
        case 'rating':
          return { ratings: -1 };
        case 'createdAt':
          return { createdAt: 1 };
        case '-createdAt':
        case 'newest':
        case 'latest':
        default:
          return { createdAt: -1 };
      }
    };

    // When a text search is active, rank by relevance score first
    const sortObj: Record<string, unknown> = searchQuery
      ? { score: { $meta: 'textScore' } }
      : buildSort((req.query.sort as string) || '-createdAt');

    // Projection: include text-score only during search
    const projection: Record<string, unknown> = searchQuery
      ? { score: { $meta: 'textScore' } }
      : {};

    // ── Query ───────────────────────────────────────────────────────────
    const [products, total] = await Promise.all([
      Product.find(filter, projection)
        .populate('category', 'name slug')
        .sort(sortObj as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: products,
      // kept for backward compatibility with existing frontend
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
      // new meta format as per API spec
      meta: {
        page,
        limit,
        totalProducts: total,
        totalPages,
      },
    });
  }
);

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate('category', 'name slug');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

// @desc    Get single product by ID (admin)
// @route   GET /api/products/admin/:id
// @access  Private/SuperAdmin
export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

// @desc    Get all products (admin - includes inactive)
// @route   GET /api/products/admin/all
// @access  Private/SuperAdmin
export const getAllProductsAdmin = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Create product
// @route   POST /api/products
// @access  Private/SuperAdmin
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      price,
      discount,
      stock,
      category,
      brand,
      variants,
      specifications,
      shipping,
      tags,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return next(new AppError('A product with this title already exists', 400));
    }

    // Handle uploaded images
    const images: { url: string; alt: string; isPrimary: boolean }[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File, index: number) => {
        images.push({
          url: `/uploads/${file.filename}`,
          alt: title,
          isPrimary: index === 0,
        });
      });
    }

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      discount: discount || 0,
      stock: stock || 0,
      images,
      category,
      brand: brand || '',
      variants: variants ? JSON.parse(variants) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      shipping: shipping ? JSON.parse(shipping) : {},
      tags: tags ? JSON.parse(tags) : [],
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  }
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/SuperAdmin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== product.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });

      const existing = await Product.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id } as any,
      });
      if (existing) {
        return next(
          new AppError('A product with this title already exists', 400)
        );
      }
    }

    // Parse JSON fields if they're strings (from FormData)
    if (typeof req.body.variants === 'string') {
      req.body.variants = JSON.parse(req.body.variants);
    }
    if (typeof req.body.specifications === 'string') {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    if (typeof req.body.shipping === 'string') {
      req.body.shipping = JSON.parse(req.body.shipping);
    }
    if (typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }

    // Handle image updates: prefer kept images sent from the client (existingImages),
    // fall back to the stored product images so nothing is lost by default.
    const baseImages: { url: string; alt: string; isPrimary: boolean }[] =
      req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : (product.images as { url: string; alt: string; isPrimary: boolean }[]);
    delete req.body.existingImages; // remove helper field before saving

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = req.files.map(
        (file: Express.Multer.File, index: number) => ({
          url: `/uploads/${file.filename}`,
          alt: req.body.title || product!.title,
          isPrimary: baseImages.length === 0 && index === 0,
        })
      );
      req.body.images = [...baseImages, ...newImages];
    } else {
      // No new files — use whatever images the client wants to keep
      req.body.images = baseImages;
    }

    // Whitelist allowed fields to prevent mass assignment
    const allowedFields = [
      'title', 'slug', 'description', 'price', 'discount', 'stock',
      'category', 'brand', 'variants', 'specifications', 'shipping',
      'tags', 'images', 'isActive',
    ];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/SuperAdmin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
);

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/SuperAdmin
export const uploadProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }

    const newImages = req.files.map(
      (file: Express.Multer.File, index: number) => ({
        url: `/uploads/${file.filename}`,
        alt: product.title,
        isPrimary: product.images.length === 0 && index === 0,
      })
    );

    product.images.push(...newImages);
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);
