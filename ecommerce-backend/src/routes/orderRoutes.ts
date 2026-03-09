import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '../validators';

const router = Router();

router.use(protect as any);

router.post('/', validate(createOrderSchema), createOrder as any);
router.get('/', getMyOrders as any);

// Admin routes (must be before /:id to avoid conflict)
router.get('/admin/all', authorize('superAdmin') as any, getAllOrders as any);

router.get('/:id', getOrder as any);
router.put('/:id/status', authorize('superAdmin') as any, updateOrderStatus as any);

export default router;
