import BestSellingProducts from "@/components/HomePart/BestSellingProducts";
import Category from "@/components/HomePart/Category";
import Hero from "@/components/HomePart/Hero";
import NewArrivals from "@/components/HomePart/NewArrivals";
import TopRatedProducts from "@/components/HomePart/TopRatedProducts";
import TrendingProducts from "@/components/HomePart/TrendingProducts";
import { axiosInstance } from "@/config/axiosInstance";
import { HomeData } from "@/types/home";
import React from "react";

const fetchData = async (): Promise<HomeData | null> => {
  try {
    const response = await axiosInstance.get("/home");
    return (response?.data?.data ?? null) as HomeData;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
};

export default async function Home() {
  const data = await fetchData();

  return (
    <React.Fragment>
      <Hero
        slides={data?.slider}
        topBanner={data?.rightTop}
        bottomBanner={data?.rightBottom}
      />
      <Category categories={data?.categories} />
      <NewArrivals products={data?.newArrivals} />
      <TrendingProducts products={data?.trendingProducts} />
      <BestSellingProducts products={data?.bestSellingProducts} />
      <TopRatedProducts products={data?.topRatedProducts} />
    </React.Fragment>
  );
}
