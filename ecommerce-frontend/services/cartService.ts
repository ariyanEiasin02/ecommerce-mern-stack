import { axiosInstance } from '@/config/axiosInstance';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  async getCart() {
    const res = await axiosInstance.get<{ success: boolean; data: Cart }>('/cart');
    return res.data.data;
  },

  async addToCart(data: { productId: string; quantity: number; selectedVariants?: Record<string, string> }) {
    const res = await axiosInstance.post<{ success: boolean; data: Cart }>('/cart', data);
    return res.data.data;
  },

  async updateCartItem(itemId: string, quantity: number) {
    const res = await axiosInstance.put<{ success: boolean; data: Cart }>(`/cart/${itemId}`, { quantity });
    return res.data.data;
  },

  async removeFromCart(itemId: string) {
    const res = await axiosInstance.delete<{ success: boolean; data: Cart }>(`/cart/${itemId}`);
    return res.data.data;
  },

  async clearCart() {
    const res = await axiosInstance.delete<{ success: boolean; data: null }>('/cart');
    return res.data;
  },
};
