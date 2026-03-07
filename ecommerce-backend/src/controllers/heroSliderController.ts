import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import HeroBanner from '../models/HeroSlider';
import asyncHandler from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

// Helper to delete a file from disk if it is a local upload
function deleteLocalFile(fileUrl: string | undefined): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(fileUrl));
  fs.unlink(filePath, () => {/* ignore errors */});
}

// @desc    Get all banners (admin – includes inactive)
// @route   GET /api/hero-banners/admin/all
// @access  Private/SuperAdmin
export const getAllBannersAdmin = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const banners = await HeroBanner.find().sort({ position: 1, sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  }
);

// @desc    Get single banner
// @route   GET /api/hero-banners/:id
// @access  Private/SuperAdmin
export const getBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return next(new AppError('Banner not found', 404));

    res.status(200).json({ success: true, data: banner });
  }
);

// @desc    Create banner
// @route   POST /api/hero-banners
// @access  Private/SuperAdmin
export const createBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { link, position, sortOrder, isActive } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    if (!imageUrl) {
      return next(new AppError('Banner image is required', 400));
    }

    if (!position || !['slider', 'rightTop', 'rightBottom'].includes(position)) {
      return next(new AppError('Position must be slider, rightTop, or rightBottom', 400));
    }

    // For rightTop/rightBottom, only one active banner per position at a time
    if (position !== 'slider') {
      const existing = await HeroBanner.findOne({ position, isActive: true });
      if (existing) {
        // Deactivate the old one
        existing.isActive = false;
        await existing.save();
      }
    }

    const banner = await HeroBanner.create({
      image: imageUrl,
      link: link || '',
      position,
      sortOrder: position === 'slider' ? (sortOrder !== undefined ? Number(sortOrder) : 0) : 0,
      isActive: isActive !== undefined ? isActive === true || isActive === 'true' : true,
    });

    res.status(201).json({ success: true, data: banner });
  }
);

// @desc    Update banner
// @route   PUT /api/hero-banners/:id
// @access  Private/SuperAdmin
export const updateBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return next(new AppError('Banner not found', 404));

    const { link, position, sortOrder, isActive } = req.body;

    // Resolve newly uploaded image
    const newImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    // If new image uploaded, delete old one
    if (newImage) deleteLocalFile(banner.image);

    // If position is changing to rightTop/rightBottom, deactivate existing
    const newPosition = position || banner.position;
    if (newPosition !== 'slider' && newPosition !== banner.position) {
      const existing = await HeroBanner.findOne({ position: newPosition, isActive: true });
      if (existing && existing._id.toString() !== banner._id.toString()) {
        existing.isActive = false;
        await existing.save();
      }
    }

    if (link !== undefined) banner.link = link;
    if (position !== undefined) banner.position = position;
    if (sortOrder !== undefined) banner.sortOrder = Number(sortOrder);
    if (isActive !== undefined) banner.isActive = isActive === true || isActive === 'true';
    if (newImage) banner.image = newImage;

    await banner.save();

    res.status(200).json({ success: true, data: banner });
  }
);

// @desc    Toggle banner active status
// @route   PATCH /api/hero-banners/:id/status
// @access  Private/SuperAdmin
export const toggleBannerStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return next(new AppError('Banner not found', 404));

    // If activating a rightTop/rightBottom, deactivate existing
    if (!banner.isActive && banner.position !== 'slider') {
      const existing = await HeroBanner.findOne({
        position: banner.position,
        isActive: true,
        _id: { $ne: banner._id },
      });
      if (existing) {
        existing.isActive = false;
        await existing.save();
      }
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      data: banner,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  }
);

// @desc    Delete banner
// @route   DELETE /api/hero-banners/:id
// @access  Private/SuperAdmin
export const deleteBanner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return next(new AppError('Banner not found', 404));

    deleteLocalFile(banner.image);
    await banner.deleteOne();

    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  }
);
