import { axiosInstance } from '@/config/axiosInstance';

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variant?: { type: string; value: string; label: string };
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
  paymentMethod: 'stripe' | 'cod';
  paymentResult?: {
    id: string;
    status: string;
    stripeSessionId?: string;
  };
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  async createOrder(data: {
    shippingInfo: Order['shippingInfo'];
    paymentMethod?: string;
    couponCode?: string;
  }) {
    const res = await axiosInstance.post<{ success: boolean; data: Order }>('/orders', data);
    return res.data.data;
  },

  async getMyOrders() {
    const res = await axiosInstance.get<{ success: boolean; data: Order[]; pagination: any }>('/orders');
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
