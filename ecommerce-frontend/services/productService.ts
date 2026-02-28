import { axiosInstance } from '@/config/axiosInstance';

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: { url: string; alt: string; isPrimary?: boolean }[];
  category: { _id: string; name: string; slug: string } | string;
  brand?: string;
  stock: number;
  sku?: string;
  variants?: { name: string; options: string[] }[];
  specifications?: { key: string; value: string }[];
  tags?: string[];
  rating: number;
  numReviews: number;
  soldCount: number;
  isFeatured: boolean;
  isActive: boolean;
  shipping?: {
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
    freeShipping: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  brand?: string;
  isFeatured?: boolean;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const res = await axiosInstance.get<ProductsResponse>(`/products?${params.toString()}`);
    return res.data;
  },

  async getProductBySlug(slug: string) {
    const res = await axiosInstance.get<{ success: boolean; data: ApiProduct }>(`/products/${slug}`);
    return res.data.data;
  },

  async getFeaturedProducts(limit = 8) {
    return this.getProducts({ isFeatured: true, limit });
  },

  async getNewArrivals(limit = 8) {
    return this.getProducts({ sort: '-createdAt', limit });
  },

  async getBestSelling(limit = 8) {
    return this.getProducts({ sort: '-soldCount', limit });
  },

  async getTopRated(limit = 8) {
    return this.getProducts({ sort: '-rating', limit });
  },

  async searchProducts(query: string, limit = 20) {
    return this.getProducts({ search: query, limit });
  },
};
