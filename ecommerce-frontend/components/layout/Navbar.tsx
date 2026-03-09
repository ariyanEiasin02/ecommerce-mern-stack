"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaHeart, 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className="main-navbar">
        <div className="container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <h1>E-Shop</h1>
          </Link>

          {/* Search Bar (Desktop Only) */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Right Icons (Desktop Only) */}
          <div className="navbar-actions">
            <Link href="/wishlist" className="nav-icon-link">
              <FaHeart />
              <span className="icon-label">Wishlist</span>
             
            </Link>

            <Link href="/cart" className="nav-icon-link">
              <FaShoppingCart />
              <span className="icon-label">Cart</span>
            </Link>

            <Link href={"/login"} className="nav-icon-link">
              <FaUser />
              <span className="icon-label">Login</span>
            </Link>
          </div>

          <div className="mobile-navbar-actions-wrapper">
            {/* Mobile Search Icon */}
          <button 
            className="mobile-search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          </div>
        </div>


        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="mobile-search">
            <form onSubmit={handleSearch} style={{ display: 'contents' }}>
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="mobile-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="mobile-search-btn" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <FaHome />
          <span>Home</span>
        </Link>

        <Link href="/all-products" className="bottom-nav-item">
          <FaStore />
          <span>Shop</span>
        </Link>

        <Link href="/cart" className="bottom-nav-item">
          <FaShoppingCart />
          <span>Cart</span>
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
