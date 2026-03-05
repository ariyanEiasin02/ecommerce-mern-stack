import { axiosInstance } from '@/config/axiosInstance';

export const couponService = {
  async validateCoupon(code: string, subtotal: number) {
    const res = await axiosInstance.post<{
      success: boolean;
      data: {
        code: string;
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        discountAmount: number;
        minPurchase: number;
      };
    }>('/coupons/validate', { code, subtotal });
    return res.data.data;
  },
};
