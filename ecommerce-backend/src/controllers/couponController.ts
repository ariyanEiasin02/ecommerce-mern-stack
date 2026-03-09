import { Request, Response, NextFunction } from 'express';
import Coupon from '../models/Coupon';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return next(new AppError('Invalid or expired coupon', 400));
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return next(new AppError('Coupon usage limit reached', 400));
    }

    if (subtotal && subtotal < coupon.minPurchase) {
      return next(
        new AppError(
          `Minimum purchase of $${coupon.minPurchase} required`,
          400
        )
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = subtotal
        ? Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100
        : 0;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minPurchase: coupon.minPurchase,
      },
    });
  }
);

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/SuperAdmin
export const getCoupons = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  }
);

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/SuperAdmin
export const createCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, discountType, discountValue, minPurchase, maxUses, expiresAt, isActive } =
      req.body;

    // Check for duplicate code
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return next(new AppError('Coupon code already exists', 400));
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase: minPurchase || 0,
      maxUses: maxUses || 0,
      expiresAt: new Date(expiresAt),
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: coupon,
    });
  }
);

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/SuperAdmin
export const updateCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return next(new AppError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  }
);

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/SuperAdmin
export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return next(new AppError('Coupon not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  }
);
