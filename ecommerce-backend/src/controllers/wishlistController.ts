import { Response, NextFunction } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate({
      path: 'products',
      select: 'title slug price discount images ratings reviewCount stock isActive',
      match: { isActive: true },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user!._id,
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  }
);

// @desc    Toggle product in wishlist (add/remove)
// @route   POST /api/wishlist
// @access  Private
export const toggleWishlist = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { productId } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    let wishlist = await Wishlist.findOne({ user: req.user!._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user!._id,
        products: [],
      });
    }

    const productIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let action: string;
    if (productIndex > -1) {
      // Remove from wishlist
      wishlist.products.splice(productIndex, 1);
      action = 'removed';
    } else {
      // Add to wishlist
      wishlist.products.push(product._id);
      action = 'added';
    }

    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'title slug price discount images ratings reviewCount stock',
    });

    res.status(200).json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
      action,
      data: wishlist,
    });
  }
);
