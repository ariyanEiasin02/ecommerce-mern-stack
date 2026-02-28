import { Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    let cart = await Cart.findOne({ user: req.user!._id }).populate({
      path: 'items.product',
      select: 'title slug price discount images stock isActive',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    // Filter out items whose products no longer exist or are inactive
    const validItems = cart.items.filter(
      (item) => item.product && (item.product as any).isActive
    );
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
);

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { productId, quantity = 1, variant } = req.body;

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(new AppError('Product not found or unavailable', 404));
    }

    // Check stock
    if (product.stock < quantity) {
      return next(
        new AppError(`Only ${product.stock} items available in stock`, 400)
      );
    }

    let cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    // Check if item already in cart (same product + variant)
    const existingItemIndex = cart.items.findIndex((item) => {
      const sameProduct = item.product.toString() === productId;
      const sameVariant =
        (!item.variant && !variant) ||
        (item.variant &&
          variant &&
          item.variant.type === variant.type &&
          item.variant.value === variant.value);
      return sameProduct && sameVariant;
    });

    if (existingItemIndex > -1) {
      // Update quantity
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return next(
          new AppError(`Only ${product.stock} items available in stock`, 400)
        );
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      // Add new item
      cart.items.push({ product: product._id, quantity, variant });
    }

    await cart.save();

    // Populate for response
    await cart.populate({
      path: 'items.product',
      select: 'title slug price discount images stock',
    });

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
);

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(
      (item) => (item as any)._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return next(new AppError('Item not found in cart', 404));
    }

    // Check stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return next(new AppError('Product no longer available', 404));
    }
    if (quantity > product.stock) {
      return next(
        new AppError(`Only ${product.stock} items available in stock`, 400)
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'title slug price discount images stock',
    });

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter(
      (item) => (item as any)._id.toString() !== req.params.itemId
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'title slug price discount images stock',
    });

    res.status(200).json({
      success: true,
      data: cart,
    });
  }
);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { items: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { items: [] },
    });
  }
);
