import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1 });

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
export default Wishlist;
