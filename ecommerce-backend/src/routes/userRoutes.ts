import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getUserProfile,
  updateUser,
  toggleBlockUser,
  deleteUser,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public
router.get('/profile/:username', getUserProfile as any);

// Protected
router.use(protect as any);
router.put('/:id', updateUser as any);

// Super Admin only
router.get('/', authorize('superAdmin') as any, getUsers as any);
router.get('/:id', authorize('superAdmin') as any, getUserById as any);
router.put('/:id/block', authorize('superAdmin') as any, toggleBlockUser as any);
router.delete('/:id', authorize('superAdmin') as any, deleteUser as any);

export default router;
