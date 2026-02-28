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
router.get('/:slug', getProduct);

// Admin
router.use(protect as any);
router.use(authorize('superAdmin') as any);

router.get('/admin/all', getAllProductsAdmin);
router.get('/admin/:id', getProductById);
router.post(
  '/',
  upload.array('images', 10),
  validate(createProductSchema),
  createProduct as any
);
router.put(
  '/:id',
  upload.array('images', 10),
  validate(updateProductSchema),
  updateProduct
);
router.delete('/:id', deleteProduct);
router.post('/:id/images', upload.array('images', 10), uploadProductImages);

export default router;
