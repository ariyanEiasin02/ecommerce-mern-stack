import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface IProductVariant {
  type: string; // e.g., 'color', 'size'
  value: string;
  label: string;
  stock: number;
  priceModifier: number; // additional price for this variant
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  images: IProductImage[];
  category: mongoose.Types.ObjectId;
  brand?: string;
  variants: IProductVariant[];
  ratings: number;
  reviewCount: number;
  specifications: { key: string; value: string }[];
  shipping: {
    weight?: number;
    dimensions?: string;
    freeShipping: boolean;
    estimatedDays: number;
  };
  isActive: boolean;
  soldCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const productVariantSchema = new Schema<IProductVariant>(
  {
    type: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String, required: true },
    stock: { type: Number, default: 0 },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [productImageSchema],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    variants: [productVariantSchema],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    shipping: {
      weight: { type: Number },
      dimensions: { type: String },
      freeShipping: { type: Boolean, default: false },
      estimatedDays: { type: Number, default: 5 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

// Text indexes for search
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ soldCount: -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default Product;
