"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FaHeart, 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaChevronDown
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Health",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games",
    "Groceries"
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="main-navbar">
        <div className="container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <h1>E-Shop</h1>
          </Link>

          {/* Category Menu Button */}
          {/* <button 
            className="category-btn"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <FaBars />
            <span>Categories</span>
            <FaChevronDown className={isCategoryOpen ? "rotate" : ""} />
          </button> */}

          {/* Search Bar */}
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="search-input"
            />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>

          {/* Right Icons */}
          <div className="navbar-actions">
            <Link href="/wishlist" className="nav-icon-link">
              <FaHeart />
              <span className="icon-label">Wishlist</span>
              <span className="badge">0</span>
            </Link>

            <Link href="/cart" className="nav-icon-link">
              <FaShoppingCart />
              <span className="icon-label">Cart</span>
              <span className="badge">3</span>
            </Link>

            <Link href="/profile" className="nav-icon-link">
              <FaUser />
              <span className="icon-label">Account</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Search Icon */}
          <button 
            className="mobile-search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FaSearch />
          </button>
        </div>

        {/* Category Dropdown */}
        {/* {isCategoryOpen && (
          <div className="category-dropdown">
            <div className="category-dropdown-content">
              {categories.map((category, index) => (
                <Link 
                  href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                  key={index}
                  className="category-item"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )} */}

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="mobile-search">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="mobile-search-input"
            />
            <button className="mobile-search-btn">
              <FaSearch />
            </button>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <FaHome />
          <span>Home</span>
        </Link>

        <Link href="/shop" className="bottom-nav-item">
          <FaStore />
          <span>Shop</span>
        </Link>

        <Link href="/cart" className="bottom-nav-item">
          <FaShoppingCart />
          <span>Cart</span>
          <span className="bottom-badge">3</span>
        </Link>

        <Link href="/wishlist" className="bottom-nav-item">
          <FaHeart />
          <span>Wishlist</span>
        </Link>

        <Link href="/profile" className="bottom-nav-item">
          <FaUser />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Overlay */}
      {(isCategoryOpen || isMobileMenuOpen) && (
        <div 
          className="navbar-overlay"
          onClick={() => {
            setIsCategoryOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
