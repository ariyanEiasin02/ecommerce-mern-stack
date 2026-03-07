import { Router } from 'express';
import {
  getAllBannersAdmin,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/heroSliderController';
import { protect, authorize } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// All routes are protected (SuperAdmin only)
router.use(protect as any);
router.use(authorize('superAdmin') as any);

// GET all banners (admin)
router.get('/admin/all', getAllBannersAdmin);

// GET single banner
router.get('/:id', getBanner);

// POST create banner (single image)
router.post('/', upload.single('image'), createBanner);

// PUT update banner
router.put('/:id', upload.single('image'), updateBanner);

// PATCH toggle active status
router.patch('/:id/status', toggleBannerStatus);

// DELETE banner
router.delete('/:id', deleteBanner);

export default router;
