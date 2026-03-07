import mongoose, { Document, Schema } from 'mongoose';

export type BannerPosition = 'slider' | 'rightTop' | 'rightBottom';

export interface IHeroBanner extends Document {
  _id: mongoose.Types.ObjectId;
  image: string;
  link: string;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroBannerSchema = new Schema<IHeroBanner>(
  {
    image: {
      type: String,
      required: [true, 'Banner image is required'],
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    position: {
      type: String,
      enum: {
        values: ['slider', 'rightTop', 'rightBottom'],
        message: 'Position must be slider, rightTop, or rightBottom',
      },
      required: [true, 'Banner position is required'],
      default: 'slider',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

heroBannerSchema.index({ position: 1, sortOrder: 1 });
heroBannerSchema.index({ isActive: 1 });

const HeroBanner = mongoose.model<IHeroBanner>('HeroBanner', heroBannerSchema);

export default HeroBanner;
