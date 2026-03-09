import { Router } from 'express';
import {
  createCheckoutSession,
  stripeWebhook,
} from '../controllers/paymentController';
import { protect } from '../middleware/auth';
import express from 'express';

const router = Router();

// Webhook must use raw body (configured in server.ts)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/create-checkout-session', protect as any, createCheckoutSession as any);

export default router;
