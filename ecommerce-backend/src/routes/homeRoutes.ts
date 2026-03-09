import { Router } from 'express';
import { getHomePageData } from '../controllers/homeController';

const router = Router();

// Public
router.get('/', getHomePageData);

export default router;
