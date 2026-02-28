import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

let _stripe: Stripe | null = null;
const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return _stripe;
};

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user.toString() !== req.user!._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    if (order.isPaid) {
      return next(new AppError('Order is already paid', 400));
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.image ? [`${process.env.CLIENT_URL}${item.image}`] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add tax as a line item
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            images: [],
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add shipping as a line item
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            images: [],
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?cancelled=true`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    // Save stripe session ID to order
    order.paymentResult = {
      id: session.id,
      status: 'pending',
      stripeSessionId: session.id,
    };
    await order.save();

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  }
);

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe)
export const stripeWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult = {
            id: session.payment_intent as string,
            status: 'completed',
            stripeSessionId: session.id,
          };
          order.status = 'processing';
          await order.save();
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
