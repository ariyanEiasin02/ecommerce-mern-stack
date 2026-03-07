import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators';
import upload from '../middleware/upload';

const router = Router();

// Public
router.get('/', getProducts);

// Admin routes (must be BEFORE /:slug to avoid route conflict)
router.get('/admin/all', protect as any, authorize('superAdmin') as any, getAllProductsAdmin);
router.get('/admin/:id', protect as any, authorize('superAdmin') as any, getProductById);
router.post(
  '/',
  protect as any,
  authorize('superAdmin') as any,
  upload.array('images', 10),
  validate(createProductSchema),
  createProduct as any
);
router.put(
  '/:id',
  protect as any,
  authorize('superAdmin') as any,
  upload.array('images', 10),
  validate(updateProductSchema),
  updateProduct
);
router.delete('/:id', protect as any, authorize('superAdmin') as any, deleteProduct);
router.post('/:id/images', protect as any, authorize('superAdmin') as any, upload.array('images', 10), uploadProductImages);

// Public - slug route LAST to avoid catching /admin/* paths
router.get('/:slug', getProduct);

export default router;
