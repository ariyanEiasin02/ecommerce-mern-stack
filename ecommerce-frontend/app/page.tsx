import Category from "@/components/HomePart/Category";
import Hero from "@/components/HomePart/Hero";
import NewArrivals from "@/components/HomePart/NewArrivals";
import TrendingProducts from "@/components/HomePart/TrendingProducts";
import React from "react";

export default function Home() {
  return (
    <React.Fragment>
      <Hero />
      <Category />
      <NewArrivals />
      <TrendingProducts />
    </React.Fragment>
  );
}
