import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect as any);
router.use(authorize('superAdmin') as any);

router.get('/dashboard', getDashboardAnalytics);

export default router;
