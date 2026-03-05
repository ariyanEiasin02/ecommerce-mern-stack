import { axiosInstance } from '@/config/axiosInstance';

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export const reviewService = {
  async getProductReviews(productId: string) {
    const res = await axiosInstance.get<{ success: boolean; data: Review[]; pagination: any }>(
      `/products/${productId}/reviews`
    );
    return res.data.data;
  },

  async createReview(productId: string, data: { rating: number; comment: string }) {
    const res = await axiosInstance.post<{ success: boolean; data: Review }>(
      `/products/${productId}/reviews`, data
    );
    return res.data.data;
  },

  async markHelpful(reviewId: string) {
    const res = await axiosInstance.post<{ success: boolean; data: Review }>(
      `/reviews/${reviewId}/helpful`
    );
    return res.data.data;
  },
};
