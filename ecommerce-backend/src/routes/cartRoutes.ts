import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addToCartSchema, updateCartItemSchema } from '../validators';

const router = Router();

router.use(protect as any);

router.get('/', getCart as any);
router.post('/', validate(addToCartSchema), addToCart as any);
router.put('/:itemId', validate(updateCartItemSchema), updateCartItem as any);
router.delete('/:itemId', removeCartItem as any);
router.delete('/', clearCart as any);

export default router;
