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

const router = Router();

// Public
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin
router.use(protect as any);
router.use(authorize('superAdmin') as any);
router.get('/admin/all', getAllCategoriesAdmin);
router.post('/', validate(createCategorySchema), createCategory);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
