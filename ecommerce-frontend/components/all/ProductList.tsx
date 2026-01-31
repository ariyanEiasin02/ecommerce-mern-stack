"use client";
import React, { useState } from "react";
import ProductCard from "../card/ProductCard";
import SideBar from "./SideBar";
import Breadcrumb from "../common/Breadcrumb";

const ProductList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="product-list-section">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Shop", href: "/shop" }, { label: "All Products" }]}
        />
        
        {/* Mobile Filter Toggle Button */}
        <button 
          className="mobile-filter-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle filters"
        >
          <i className="fi fi-rr-filter"></i>
          <span>Filters</span>
        </button>

        <div className="row py-5">
          <div className={`col-lg-3 sidebar-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Sidebar Overlay for Mobile */}
            <div 
              className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
              onClick={toggleSidebar}
            ></div>
            
            {/* Sidebar Container */}
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
              <SideBar />
            </div>
          </div>
          
          <div className="col-lg-9">
            {/* Results Header */}
            <div className="products-header">
              <div className="products-count">
                Showing <strong>1-10</strong> of <strong>100</strong> results
              </div>
              <div className="products-sort">
                <label htmlFor="sortBy">Sort by:</label>
                <select id="sortBy" className="sort-select">
                  <option value="default">Default</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Average rating</option>
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <div className="col-xl-3 col-lg-4 col-md-4 col-6" key={item}>
                  <ProductCard
                    name="Basic High-Neck Puff Jacket"
                    price={69.0}
                    originalPrice={89.0}
                    discount={23}
                    images={[
                      "/hero1.webp",
                      "https://klbtheme.com/clotya/wp-content/uploads/2022/04/basic3-500x750.jpeg",
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
