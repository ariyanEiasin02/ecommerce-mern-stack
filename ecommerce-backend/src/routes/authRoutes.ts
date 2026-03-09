import { Router } from 'express';
import { register, login, logout, getMe, changePassword } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect as any, getMe as any);
router.put('/change-password', protect as any, changePassword as any);

export default router;
