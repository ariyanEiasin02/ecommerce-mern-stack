import dynamic from "next/dynamic";
import React from "react";
const CategoryList = dynamic(
  () => import("@/components/category/CategoryList"),
  { ssr: true },
);
const page = async () => {
  const categories: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    status: "waiting" | "rejected" | "approved";
    createdAt: string;
  }[] = [
   { 
  _id: "648f1e2f5f9b9c001c8e4b1a",
  name: "Electronics",
  slug: "electronics",
  description: "Category for electronic products",
  isActive: false,
  status: "waiting",
  createdAt: "2024-06-18T10:20:31.123Z",
},
  { 
  _id: "648f1e2f5f9b9c001c8e4b1b",
  name: "Fashion",
  slug: "fashion",
  description: "Category for fashion products",
  isActive: true,
  status: "approved",
  createdAt: "2024-06-18T10:20:31.123Z",
}
  ];

  return <CategoryList categories={categories} />;
};

export default page;
