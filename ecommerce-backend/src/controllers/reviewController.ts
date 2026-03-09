import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ product: req.params.productId }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Create review
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user!._id,
      product: productId,
    });
    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    const review = await Review.create({
      user: req.user!._id,
      product: productId,
      rating,
      comment,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: review,
    });
  }
);

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Owner
export const updateReview = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Only the review owner can update
    if (review.user.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized to update this review', 403));
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      data: review,
    });
  }
);

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Owner or SuperAdmin
export const deleteReview = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    // Owner or superAdmin can delete
    if (
      review.user.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'superAdmin'
    ) {
      return next(new AppError('Not authorized to delete this review', 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  }
);

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    const userId = req.user!._id;
    const alreadyMarked = review.helpfulBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyMarked) {
      // Remove helpful
      review.helpfulBy = review.helpfulBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful
      review.helpfulBy.push(userId);
      review.helpful += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  }
);

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/SuperAdmin
export const getAllReviewsAdmin = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('user', 'name email avatar')
        .populate('product', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);
