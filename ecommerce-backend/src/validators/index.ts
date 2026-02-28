import { z } from 'zod';

// Helper: parse JSON strings for fields that arrive as strings from FormData
const parseJson = (val: unknown) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};

// Helper: coerce "true"/"false" strings to boolean (for FormData boolean fields)
const coerceBool = (val: unknown) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

// Auth Validators
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string({ message: 'Email is required' })
      .email('Please provide a valid email'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Please provide a valid email'),
    password: z.string({ message: 'Password is required' }),
  }),
});

// Category Validators
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Category name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    slug: z.string().optional(),
    description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
    image: z.string().optional(),
    parentCategory: z.string().optional(),
    isActive: z.preprocess(coerceBool, z.boolean().optional()),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().optional(),
    description: z.string().max(5000).optional(),
    image: z.string().optional(),
    parentCategory: z.string().nullable().optional(),
    isActive: z.preprocess(coerceBool, z.boolean().optional()),
  }),
});

// Product Validators
export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'Product title is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    slug: z.string().optional(),
    description: z
      .string({ message: 'Description is required' })
      .max(5000, 'Description cannot exceed 5000 characters'),
    price: z.coerce
      .number({ message: 'Price is required' })
      .min(0, 'Price cannot be negative'),
    discount: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().min(0).optional(),
    category: z.string({ message: 'Category is required' }),
    brand: z.string().optional(),
    variants: z.preprocess(
      parseJson,
      z
        .array(
          z.object({
            type: z.string(),
            value: z.string(),
            label: z.string(),
            stock: z.number().min(0).optional(),
            priceModifier: z.number().optional(),
          })
        )
        .optional()
    ),
    specifications: z.preprocess(
      parseJson,
      z.array(z.object({ key: z.string(), value: z.string() })).optional()
    ),
    shipping: z.preprocess(
      parseJson,
      z
        .object({
          weight: z.number().optional(),
          dimensions: z.string().optional(),
          freeShipping: z.preprocess(coerceBool, z.boolean().optional()),
          estimatedDays: z.coerce.number().optional(),
        })
        .optional()
    ),
    tags: z.preprocess(parseJson, z.array(z.string()).optional()),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    slug: z.string().optional(),
    description: z.string().max(5000).optional(),
    price: z.coerce.number().min(0).optional(),
    discount: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().min(0).optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    isActive: z.preprocess(coerceBool, z.boolean().optional()),
    variants: z.preprocess(
      parseJson,
      z
        .array(
          z.object({
            type: z.string(),
            value: z.string(),
            label: z.string(),
            stock: z.number().min(0).optional(),
            priceModifier: z.number().optional(),
          })
        )
        .optional()
    ),
    specifications: z.preprocess(
      parseJson,
      z.array(z.object({ key: z.string(), value: z.string() })).optional()
    ),
    shipping: z.preprocess(
      parseJson,
      z
        .object({
          weight: z.number().optional(),
          dimensions: z.string().optional(),
          freeShipping: z.preprocess(coerceBool, z.boolean().optional()),
          estimatedDays: z.coerce.number().optional(),
        })
        .optional()
    ),
    tags: z.preprocess(parseJson, z.array(z.string()).optional()),
  }),
});

// Review Validators
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.coerce
      .number({ message: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    comment: z
      .string({ message: 'Comment is required' })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters'),
  }),
});

// Order Validators
export const createOrderSchema = z.object({
  body: z.object({
    shippingInfo: z.object({
      fullName: z.string({ message: 'Full name is required' }),
      address: z.string({ message: 'Address is required' }),
      city: z.string({ message: 'City is required' }),
      state: z.string({ message: 'State is required' }),
      zipCode: z.string({ message: 'Zip code is required' }),
      country: z.string({ message: 'Country is required' }),
      phone: z.string({ message: 'Phone is required' }),
    }),
    paymentMethod: z.enum(['stripe', 'cod'], {
      message: 'Payment method is required',
    }),
    couponCode: z.string().optional(),
  }),
});

// Coupon Validators
export const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string({ message: 'Coupon code is required' })
      .min(3, 'Code must be at least 3 characters')
      .max(20, 'Code cannot exceed 20 characters'),
    discountType: z.enum(['percentage', 'fixed'], {
      message: 'Discount type is required',
    }),
    discountValue: z.coerce
      .number({ message: 'Discount value is required' })
      .min(0, 'Discount value cannot be negative'),
    minPurchase: z.coerce.number().min(0).optional(),
    maxUses: z.coerce.number().min(0).optional(),
    expiresAt: z.string({ message: 'Expiry date is required' }),
    isActive: z.boolean().optional(),
  }),
});

// Cart Validators
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string({ message: 'Product ID is required' }),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1').optional(),
    variant: z
      .object({
        type: z.string(),
        value: z.string(),
        label: z.string(),
      })
      .optional(),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce
      .number({ message: 'Quantity is required' })
      .min(1, 'Quantity must be at least 1'),
  }),
});
