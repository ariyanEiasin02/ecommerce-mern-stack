import dynamic from "next/dynamic";
import React from "react";

const CategoryList = dynamic(
  () => import("@/components/category/CategoryList"),
  { ssr: true },
);

const Page = () => {
  return <CategoryList />;
};

export default Page;
