import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCouponSchema } from '../validators';

const router = Router();

router.use(protect as any);

// User
router.post('/validate', validateCoupon as any);

// Admin
router.get('/', authorize('superAdmin') as any, getCoupons);
router.post('/', authorize('superAdmin') as any, validate(createCouponSchema), createCoupon);
router.put('/:id', authorize('superAdmin') as any, updateCoupon);
router.delete('/:id', authorize('superAdmin') as any, deleteCoupon);

export default router;
