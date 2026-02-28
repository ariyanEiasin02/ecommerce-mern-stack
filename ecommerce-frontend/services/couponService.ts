import { axiosInstance } from '@/config/axiosInstance';

export const couponService = {
  async validateCoupon(code: string, subtotal: number) {
    const res = await axiosInstance.post<{
      success: boolean;
      data: {
        code: string;
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        minPurchase: number;
      };
    }>('/coupons/validate', { code });
    const { discountType, discountValue, minPurchase, ...rest } = res.data.data;
    if (subtotal < minPurchase) {
      throw new Error(`Minimum purchase amount is $${minPurchase.toFixed(2)}`);
    }
    const discount =
      discountType === 'percentage'
        ? (subtotal * discountValue) / 100
        : discountValue;
    return { ...rest, discountType, discountValue, minPurchase, discount };
  },
};
