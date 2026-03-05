import { axiosInstance } from '@/config/axiosInstance';

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  isActive: boolean;
  subcategories?: ApiCategory[];
  createdAt: string;
}

export const categoryService = {
  async getCategories() {
    const res = await axiosInstance.get<{ success: boolean; data: ApiCategory[] }>('/categories');
    return res.data.data;
  },

  async getCategoryTree() {
    const res = await axiosInstance.get<{ success: boolean; data: ApiCategory[] }>('/categories?tree=true');
    return res.data.data;
  },

  async getCategoryBySlug(slug: string) {
    const res = await axiosInstance.get<{ success: boolean; data: ApiCategory }>(`/categories/${slug}`);
    return res.data.data;
  },
};
