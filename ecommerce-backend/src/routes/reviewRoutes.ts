import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviewsAdmin,
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema } from '../validators';

const router = Router();

// Product reviews (nested route: /api/products/:productId/reviews)
// These are mounted separately in server.ts
export const productReviewRouter = Router({ mergeParams: true });
productReviewRouter.get('/', getProductReviews);
productReviewRouter.post(
  '/',
  protect as any,
  validate(createReviewSchema),
  createReview as any
);

// Review operations
router.use(protect as any);
router.put('/:id', updateReview as any);
router.delete('/:id', deleteReview as any);
router.post('/:id/helpful', markHelpful as any);

// Admin
router.get('/admin/all', authorize('superAdmin') as any, getAllReviewsAdmin);

export default router;
