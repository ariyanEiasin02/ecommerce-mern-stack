import { axiosInstance } from '@/config/axiosInstance';

export interface WishlistProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discount: number;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
  ratings: number;
  reviewCount: number;
  stock: number;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistProduct[];
}

export const wishlistService = {
  async getWishlist() {
    const res = await axiosInstance.get<{ success: boolean; data: Wishlist }>('/wishlist');
    return res.data.data;
  },

  async toggleWishlist(productId: string) {
    const res = await axiosInstance.post<{ success: boolean; data: Wishlist; message: string; action: string }>(
      '/wishlist', { productId }
    );
    return res.data;
  },
};
