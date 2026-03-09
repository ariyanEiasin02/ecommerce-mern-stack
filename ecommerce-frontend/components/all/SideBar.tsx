"use client";
import React, { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string | null;
}

const MOCK_CATEGORIES: Category[] = [
  { _id: "1", name: "Electronics", slug: "electronics" },
  { _id: "2", name: "Headphones", slug: "headphones", parentCategory: "1" },
  { _id: "3", name: "Smart Watches", slug: "smart-watches", parentCategory: "1" },
  { _id: "4", name: "Fashion", slug: "fashion" },
  { _id: "5", name: "Men", slug: "men", parentCategory: "4" },
  { _id: "6", name: "Women", slug: "women", parentCategory: "4" },
  { _id: "7", name: "Footwear", slug: "footwear" },
  { _id: "8", name: "Sneakers", slug: "sneakers", parentCategory: "7" },
  { _id: "9", name: "Bags", slug: "bags" },
];

interface SideBarProps {
  onFilterChange?: (filters: {
    categories: string[];
    brands: string[];
    rating: number | null;
    priceRange: number[];
  }) => void;
  initialCategory?: string;
}

const SideBar: React.FC<SideBarProps> = ({ onFilterChange, initialCategory }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const categories = MOCK_CATEGORIES;

  useEffect(() => {
    onFilterChange?.({
      categories: selectedCategories,
      brands: selectedBrands,
      rating: selectedRating,
      priceRange,
    });
  }, [selectedCategories, selectedBrands, selectedRating, priceRange]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
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

  const parentCategories = categories.filter((c) => !c.parentCategory);

  return (
    <aside className="ecom-sidebar">
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
          {parentCategories.map((parent, idx) => {
            const children = categories.filter(
              (c) =>
                c.parentCategory &&
                (typeof c.parentCategory === "string"
                  ? c.parentCategory === parent._id
                  : (c.parentCategory as any)._id === parent._id)
            );
            return (
              <div className="accordion-item" key={parent._id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${idx > 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#cat-${parent._id}`}
                  >
                    <i className="fi fi-rr-folder sidebar-icon"></i>
                    {parent.name}
                  </button>
                </h2>
                <div
                  id={`cat-${parent._id}`}
                  className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="filter-list">
                      {/* Parent itself as selectable */}
                      <li>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(parent.slug)}
                            onChange={() => handleCategoryChange(parent.slug)}
                          />
                          <span className="checkbox-custom"></span>
                          All {parent.name}
                        </label>
                      </li>
                      {children.map((child) => (
                        <li key={child._id}>
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(child.slug)}
                              onChange={() => handleCategoryChange(child.slug)}
                            />
                            <span className="checkbox-custom"></span>
                            {child.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
    </aside>
  );
};

export default SideBar;
