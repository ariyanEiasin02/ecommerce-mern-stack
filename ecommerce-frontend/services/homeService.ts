import { axiosInstance } from '@/config/axiosInstance';

export interface HeroBanner {
  _id: string;
  image: string;
  link?: string;
  position: 'slider' | 'rightTop' | 'rightBottom';
  sortOrder: number;
  isActive: boolean;
}

export interface HomeCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface HomePageData {
  slider: HeroBanner[];
  rightTop: HeroBanner | null;
  rightBottom: HeroBanner | null;
  categories: HomeCategory[];
  newArrivals: any[];
  trendingProducts: any[];
  bestSellingProducts: any[];
  topRatedProducts: any[];
}

export const homeService = {
  async getHomePageData(): Promise<HomePageData> {
    const res = await axiosInstance.get('/home');
    return res.data.data;
  },
};
