import mongoose, { Document, Schema, Model } from 'mongoose';
import Product from './Product';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  helpful: number;
  helpfulBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

// Static method to recalculate product ratings
reviewSchema.statics.calcAverageRatings = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
      reviewCount: 0,
    });
  }
};

// Recalculate after save
reviewSchema.post('save', async function () {
  await (this.constructor as any).calcAverageRatings(this.product);
});

// Recalculate after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as any).calcAverageRatings(doc.product);
  }
});

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
