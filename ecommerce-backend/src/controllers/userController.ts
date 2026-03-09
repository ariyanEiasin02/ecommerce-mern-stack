import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getUsers = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/SuperAdmin or Owner
export const getUserById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// @desc    Get public user profile
// @route   GET /api/users/profile/:username
// @access  Public
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({ name: req.params.username }).select(
      'name avatar createdAt'
    );
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private/Owner
export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Only allow owner to update their profile
    if (req.user!._id.toString() !== req.params.id) {
      return next(new AppError('You can only update your own profile', 403));
    }

    const allowedFields: Record<string, unknown> = {};
    const { name, email, avatar } = req.body;
    if (name) allowedFields.name = name;
    if (avatar) allowedFields.avatar = avatar;
    if (email) {
      // Check if email already used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }
      allowedFields.email = email;
    }

    const user = await User.findByIdAndUpdate(req.params.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// @desc    Block/Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/SuperAdmin
export const toggleBlockUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'superAdmin') {
      return next(new AppError('Cannot block a super admin', 400));
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  }
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'superAdmin') {
      return next(new AppError('Cannot delete a super admin', 400));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  }
);
