import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect as any);

router.get('/', getWishlist as any);
router.post('/', toggleWishlist as any);

export default router;
