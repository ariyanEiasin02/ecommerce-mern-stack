import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import slugify from 'slugify';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { tree } = req.query;

    let categories;
    if (tree === 'true') {
      // Get root categories with subcategories populated
      categories = await Category.find({ parentCategory: null, isActive: true })
        .populate({
          path: 'subcategories',
          match: { isActive: true },
          populate: {
            path: 'subcategories',
            match: { isActive: true },
          },
        })
        .sort({ name: 1 });
    } else {
      categories = await Category.find({ isActive: true })
        .populate('parentCategory', 'name slug')
        .sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  }
);

// @desc    Get all categories (admin - includes inactive)
// @route   GET /api/categories/admin
// @access  Private/SuperAdmin
export const getAllCategoriesAdmin = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const categories = await Category.find()
      .populate('parentCategory', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  }
);

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('subcategories')
      .populate('parentCategory', 'name slug');

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  }
);

// @desc    Create category
// @route   POST /api/categories
// @access  Private/SuperAdmin
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, parentCategory, isActive } = req.body;

    // Handle uploaded image file
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');

    const slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return next(new AppError('A category with this name already exists', 400));
    }

    // Validate parent category exists if provided
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return next(new AppError('Parent category not found', 404));
      }
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageUrl,
      parentCategory: parentCategory || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  }
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/SuperAdmin
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Handle uploaded image file
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    // If name changed, regenerate slug
    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });

      // Check for duplicate slug
      const existing = await Category.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id } as any,
      });
      if (existing) {
        return next(
          new AppError('A category with this name already exists', 400)
        );
      }
    }

    // Prevent self-referencing parent
    if (req.body.parentCategory === req.params.id) {
      return next(new AppError('Category cannot be its own parent', 400));
    }

    // Whitelist allowed fields to prevent mass assignment
    const allowedFields = ['name', 'slug', 'description', 'image', 'parentCategory', 'isActive'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  }
);

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/SuperAdmin
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Check for subcategories
    const childCount = await Category.countDocuments({
      parentCategory: req.params.id,
    });
    if (childCount > 0) {
      return next(
        new AppError(
          'Cannot delete category with subcategories. Delete subcategories first.',
          400
        )
      );
    }

    // Check for products using this category
    const productCount = await Product.countDocuments({
      category: req.params.id,
    });
    if (productCount > 0) {
      return next(
        new AppError(
          `Cannot delete category. ${productCount} products belong to this category.`,
          400
        )
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  }
);
