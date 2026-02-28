"use client";
import React, { useState } from "react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    category: false,
    products: false,
    users: false,
  });

  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        {/* Sidebar Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="fi fi-rr-rocket-lunch"></i>
          </div>
          <div className="brand-text">
            <h3>Product Hunt</h3>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <div className="menu-label">MAIN MENU</div>

          {/* Dashboard */}
          <div className="nav-item active">
            <Link href="/" className="nav-link">
              <i className="fi fi-rr-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Products */}
          <div className="nav-item">
            <button
              className={`nav-link ${openMenus.category ? "active" : ""}`}
              onClick={() => toggleMenu("category")}
            >
              <i className="fi fi-tr-category-alt"></i>
              <span>Category</span>
              <i
                className={`arrow fi fi-rr-angle-small-${openMenus.category ? "up" : "down"}`}
              ></i>
            </button>
            {openMenus.category && (
              <ul className="sub-menu">
                <li>
                  <Link href="/category/all">All Category</Link>
                </li>
                <li>
                  <Link href="/category/add">Add Category</Link>
                </li>
              </ul>
            )}
          </div>
          <div className="nav-item">
            <button
              className={`nav-link ${openMenus.products ? "active" : ""}`}
              onClick={() => toggleMenu("products")}
            >
              <i className="fi fi-rr-box"></i>
              <span>Products</span>
              <i
                className={`arrow fi fi-rr-angle-small-${openMenus.products ? "up" : "down"}`}
              ></i>
            </button>
            {openMenus.products && (
              <ul className="sub-menu">
                <li>
                  <Link href="/products/all">All Products</Link>
                </li>
                <li>
                  <Link href="/products/add">Add Product</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Users */}
          <div className="nav-item">
            <button
              className={`nav-link ${openMenus.users ? "active" : ""}`}
              onClick={() => toggleMenu("users")}
            >
              <i className="fi fi-rr-users"></i>
              <span>Users</span>
              <i
                className={`arrow fi fi-rr-angle-small-${openMenus.users ? "up" : "down"}`}
              ></i>
            </button>
            {openMenus.users && (
              <ul className="sub-menu">
                <li>
                  <Link href="/users/all">All Users</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Orders */}
          <div className="nav-item">
            <Link href="/orders" className="nav-link">
              <i className="fi fi-rr-shopping-cart"></i>
              <span>Orders</span>
            </Link>
          </div>

          {/* Coupons */}
          <div className="nav-item">
            <Link href="/coupons" className="nav-link">
              <i className="fi fi-rr-ticket"></i>
              <span>Coupons</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
