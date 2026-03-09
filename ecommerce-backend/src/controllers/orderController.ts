import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import { emitOrderCreated, emitOrderStatusUpdate } from '../socket';

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { shippingInfo, paymentMethod, couponCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user!._id }).populate({
      path: 'items.product',
      select: 'title price discount stock images isActive',
    });

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    // Validate all products and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product as any;

      if (!product || !product.isActive) {
        return next(
          new AppError(`Product ${product?.title || 'Unknown'} is no longer available`, 400)
        );
      }

      if (product.stock < item.quantity) {
        return next(
          new AppError(
            `Insufficient stock for "${product.title}". Available: ${product.stock}`,
            400
          )
        );
      }

      const discountedPrice = product.price - (product.price * product.discount) / 100;
      const itemTotal = discountedPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: discountedPrice,
        quantity: item.quantity,
        image: product.images?.[0]?.url || '',
        variant: item.variant,
      });
    }

    // Calculate tax (10%)
    const taxRate = 0.1;
    const taxPrice = Math.round(subtotal * taxRate * 100) / 100;

    // Calculate shipping
    const shippingPrice = subtotal > 100 ? 0 : 10;

    // Apply coupon discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (!coupon) {
        return next(new AppError('Invalid or expired coupon', 400));
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return next(new AppError('Coupon usage limit reached', 400));
      }

      if (subtotal < coupon.minPurchase) {
        return next(
          new AppError(
            `Minimum purchase of $${coupon.minPurchase} required for this coupon`,
            400
          )
        );
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      // Update coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    const totalPrice =
      Math.round((subtotal + taxPrice + shippingPrice - discountAmount) * 100) / 100;

    // Create order
    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      shippingInfo,
      paymentMethod,
      subtotal,
      taxPrice,
      shippingPrice,
      discountAmount,
      couponCode: couponCode?.toUpperCase() || '',
      totalPrice: Math.max(0, totalPrice),
      isPaid: paymentMethod === 'cod' ? false : false,
      status: 'pending',
    });

    // Decrement stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [] });

    // Emit real-time notification to admin
    emitOrderCreated(order);

    res.status(201).json({
      success: true,
      data: order,
    });
  }
);

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user!._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user!._id }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'superAdmin'
    ) {
      return next(new AppError('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/SuperAdmin
export const getAllOrders = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        (filter.createdAt as Record<string, unknown>).$gte = new Date(
          req.query.startDate as string
        );
      }
      if (req.query.endDate) {
        (filter.createdAt as Record<string, unknown>).$lte = new Date(
          req.query.endDate as string
        );
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/SuperAdmin
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid order status', 400));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Handle status-specific logic
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'cod') {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    if (status === 'cancelled' && order.status !== 'cancelled') {
      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    // Emit real-time notification to user and admin
    emitOrderStatusUpdate(order.user.toString(), order);

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);
