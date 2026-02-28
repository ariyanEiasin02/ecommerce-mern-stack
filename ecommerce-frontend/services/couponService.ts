import { axiosInstance } from '@/config/axiosInstance';

export const couponService = {
  async validateCoupon(code: string) {
    const res = await axiosInstance.post<{
      success: boolean;
      data: {
        code: string;
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        minPurchase: number;
      };
    }>('/coupons/validate', { code });
    return res.data.data;
  },
};
