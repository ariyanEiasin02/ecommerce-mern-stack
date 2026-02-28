import { axiosInstance } from '@/config/axiosInstance';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  coupon?: string;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  async createOrder(data: {
    shippingInfo: Order['shippingInfo'];
    couponCode?: string;
  }) {
    const res = await axiosInstance.post<{ success: boolean; data: Order }>('/orders', data);
    return res.data.data;
  },

  async getMyOrders() {
    const res = await axiosInstance.get<{ success: boolean; data: Order[] }>('/orders/my-orders');
    return res.data.data;
  },

  async getOrder(id: string) {
    const res = await axiosInstance.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return res.data.data;
  },

  async cancelOrder(id: string) {
    const res = await axiosInstance.put<{ success: boolean; data: Order }>(`/orders/${id}/status`, {
      status: 'cancelled',
    });
    return res.data.data;
  },
};
