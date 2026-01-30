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
    content: false,
    settings: false,
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
                <li>
                  <Link href="/products/reviews">Reviews</Link>
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
                <li>
                  <Link href="/users/admins">Administrators</Link>
                </li>
                <li>
                  <Link href="/users/permissions">Permissions</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Analytics */}
          <div className="nav-item">
            <Link href="/analytics" className="nav-link">
              <i className="fi fi-rr-chart-line-up"></i>
              <span>Analytics</span>
            </Link>
          </div>

          {/* Content */}
          <div className="nav-item">
            <button
              className={`nav-link ${openMenus.content ? "active" : ""}`}
              onClick={() => toggleMenu("content")}
            >
              <i className="fi fi-rr-document"></i>
              <span>Content</span>
              <i
                className={`arrow fi fi-rr-angle-small-${openMenus.content ? "up" : "down"}`}
              ></i>
            </button>
            {openMenus.content && (
              <ul className="sub-menu">
                <li>
                  <Link href="/content/pages">Pages</Link>
                </li>
                <li>
                  <Link href="/content/blog">Blog Posts</Link>
                </li>
                <li>
                  <Link href="/content/media">Media Library</Link>
                </li>
              </ul>
            )}
          </div>

          <div className="menu-label">SYSTEM</div>

          {/* Settings */}
          <div className="nav-item">
            <button
              className={`nav-link ${openMenus.settings ? "active" : ""}`}
              onClick={() => toggleMenu("settings")}
            >
              <i className="fi fi-rr-settings"></i>
              <span>Settings</span>
              <i
                className={`arrow fi fi-rr-angle-small-${openMenus.settings ? "up" : "down"}`}
              ></i>
            </button>
            {openMenus.settings && (
              <ul className="sub-menu">
                <li>
                  <Link href="/settings/general">General</Link>
                </li>
                <li>
                  <Link href="/settings/security">Security</Link>
                </li>
                <li>
                  <Link href="/settings/integrations">Integrations</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Support */}
          <div className="nav-item">
            <Link href="/support" className="nav-link">
              <i className="fi fi-rr-life-ring"></i>
              <span>Support</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
