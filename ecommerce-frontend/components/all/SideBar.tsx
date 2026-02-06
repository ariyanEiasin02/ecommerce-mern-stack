"use client";
import React, { useState } from "react";

const SideBar = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setPriceRange([0, 1000]);
  };

  return (
    <aside className="ecom-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h5 className="sidebar-title">
          <i className="fi fi-rr-filter"></i>
          Filters
        </h5>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h6 className="filter-title">Price Range</h6>
        <div className="price-range-container">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="price-slider"
          />
          <div className="price-values">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="filter-section">
        <h6 className="filter-title">Categories</h6>
        <div className="accordion" id="sidebarAccordion">
          {/* Men Fashion */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#catOne"
              >
                <i className="fi fi-rr-tshirt sidebar-icon"></i>
                Men Fashion
              </button>
            </h2>
            <div
              id="catOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#sidebarAccordion"
            >
              <div className="accordion-body">
                <ul className="filter-list">
                  {["T-Shirts", "Shirts", "Jackets", "Jeans", "Shoes"].map(
                    (item) => (
                      <li key={item}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(item)}
                            onChange={() => handleCategoryChange(item)}
                          />
                          <span className="checkbox-custom"></span>
                          {item}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Women Fashion */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#catTwo"
              >
                <i className="fi fi-rr-dress sidebar-icon"></i>
                Women Fashion
              </button>
            </h2>
            <div
              id="catTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#sidebarAccordion"
            >
              <div className="accordion-body">
                <ul className="filter-list">
                  {["Dresses", "Tops", "Saree", "Handbags", "Jewelry"].map(
                    (item) => (
                      <li key={item}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(item)}
                            onChange={() => handleCategoryChange(item)}
                          />
                          <span className="checkbox-custom"></span>
                          {item}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Electronics */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#catThree"
              >
                <i className="fi fi-rr-laptop sidebar-icon"></i>
                Electronics
                <span className="item-count"><i className="fi fi-rs-angle-down"></i></span>
              </button>
            </h2>
            <div
              id="catThree"
              className="accordion-collapse collapse"
              data-bs-parent="#sidebarAccordion"
            >
              <div className="accordion-body">
                <ul className="filter-list">
                  {[
                    "Mobile Phones",
                    "Laptops",
                    "Headphones",
                    "Smart Watch",
                    "Cameras",
                  ].map((item) => (
                    <li key={item}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(item)}
                          onChange={() => handleCategoryChange(item)}
                        />
                        <span className="checkbox-custom"></span>
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="filter-section">
        <h6 className="filter-title">Brands</h6>
        <ul className="filter-list">
          {["Nike", "Adidas", "Puma", "Zara", "H&M", "Samsung"].map(
            (brand) => (
              <li key={brand}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span className="checkbox-custom"></span>
                  {brand}
                </label>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Rating Filter */}
      <div className="filter-section">
        <h6 className="filter-title">Rating</h6>
        <ul className="filter-list rating-list">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                />
                <span className="radio-custom"></span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fi ${
                        i < rating ? "fi-ss-star" : "fi-rr-star"
                      }`}
                    ></i>
                  ))}
                  <span className="rating-text">& Up</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Discount Filter */}
      <div className="filter-section">
        <h6 className="filter-title">Discount</h6>
        <ul className="filter-list">
          {["50% or more", "40% or more", "30% or more", "20% or more"].map(
            (discount) => (
              <li key={discount}>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  {discount}
                </label>
              </li>
            )
          )}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
