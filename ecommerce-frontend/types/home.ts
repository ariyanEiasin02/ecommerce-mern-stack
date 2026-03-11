export interface SlideItem {
  _id: string;
  image: string;
  link?: string;
}

export interface BannerItem {
  id?: string;
  image: string;
  link?: string;
  alt?: string;
}

export interface CategoryItem {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

export interface ProductItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  isTrending?: boolean;
  sold?: number;
  stock?: number;
}

export interface HomeData {
  slider: SlideItem[];
  rightTop: BannerItem | null;
  rightBottom: BannerItem | null;
  categories: CategoryItem[];
  newArrivals: ProductItem[];
  trendingProducts: ProductItem[];
  bestSellingProducts: ProductItem[];
  topRatedProducts: ProductItem[];
}
