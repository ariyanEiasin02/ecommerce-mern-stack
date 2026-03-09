"use client";
import React, { useState } from "react";
import ProductCard from "../card/ProductCard";
import SideBar from "./SideBar";
import Breadcrumb from "../common/Breadcrumb";

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  images: string[];
}

const MOCK_PRODUCTS: Product[] = [
  { _id: "1", title: "Classic White Sneakers", price: 89.99, discount: 10, images: [] },
  { _id: "2", title: "Slim Fit Jeans", price: 59.99, discount: 0, images: [] },
  { _id: "3", title: "Leather Handbag", price: 129.99, discount: 15, images: [] },
  { _id: "4", title: "Wireless Headphones", price: 199.99, discount: 20, images: [] },
  { _id: "5", title: "Running Shoes", price: 79.99, discount: 0, images: [] },
  { _id: "6", title: "Denim Jacket", price: 109.99, discount: 5, images: [] },
  { _id: "7", title: "Smart Watch", price: 249.99, discount: 10, images: [] },
  { _id: "8", title: "Floral Summer Dress", price: 49.99, discount: 0, images: [] },
];

interface ProductListProps {
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  initialCategory,
  initialSearch,
  initialSort,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sort, setSort] = useState(initialSort ?? "default");
  const [filters, setFilters] = useState<{
    categories: string[];
    brands: string[];
    rating: number | null;
    priceRange: number[];
  }>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    rating: null,
    priceRange: [0, 1000],
  });

  const products = MOCK_PRODUCTS;
  const total = products.length;
  const start = total === 0 ? 0 : 1;
  const end = total;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="product-list-section">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Shop", href: "/all-products" },
            { label: initialSearch ? `Search: "${initialSearch}"` : "All Products" },
          ]}
        />

        <button
          className="mobile-filter-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle filters"
        >
          <i className="fi fi-rr-filter"></i>
          <span>Filters</span>
        </button>

        <div className="row py-5">
          <div className={`col-lg-3 sidebar-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div
              className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
              onClick={toggleSidebar}
            ></div>
            <div className="sidebar-container">
              <div className="sidebar-header-mobile">
                <h5>
                  <i className="fi fi-rr-filter"></i>
                  Filters
                </h5>
                <button
                  className="sidebar-close-btn"
                  onClick={toggleSidebar}
                  aria-label="Close filters"
                >
                  <i className="fi fi-rr-cross"></i>
                </button>
              </div>
              <SideBar onFilterChange={setFilters} initialCategory={initialCategory} />
            </div>
          </div>

          <div className="col-lg-9">
            <div className="products-header">
              <div className="products-count">
                {total > 0 ? (
                  <>Showing <strong>{start}-{end}</strong> of <strong>{total}</strong> results</>
                ) : (
                  <span>No products found</span>
                )}
              </div>
              <div className="products-sort">
                <label htmlFor="sortBy">Sort by:</label>
                <select id="sortBy" className="sort-select" onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Average rating</option>
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="col-lg-3 col-md-4 col-6" key={item}>
              <ProductCard
                name="Basic High-Neck Puff Jacket"
                price={69.0}
                originalPrice={89.0}
                discount={23}
                images={[
                  "/hero1.webp",
                  "https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg"
                ]}
                isTrending={true}
              />
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
