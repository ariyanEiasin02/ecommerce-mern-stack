import { Router } from 'express';
import {
  getCategories,
  getAllCategoriesAdmin,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../validators';
import upload from '../middleware/upload';

const router = Router();

// Public
router.get('/', getCategories);

// Admin routes (must be BEFORE /:slug to avoid route conflict)
router.get('/admin/all', protect as any, authorize('superAdmin') as any, getAllCategoriesAdmin);
router.post(
  '/',
  protect as any,
  authorize('superAdmin') as any,
  upload.single('image'),
  validate(createCategorySchema),
  createCategory
);
router.put(
  '/:id',
  protect as any,
  authorize('superAdmin') as any,
  upload.single('image'),
  validate(updateCategorySchema),
  updateCategory
);
router.delete('/:id', protect as any, authorize('superAdmin') as any, deleteCategory);

// Public - slug route LAST to avoid catching /admin/* paths
router.get('/:slug', getCategory);

export default router;
