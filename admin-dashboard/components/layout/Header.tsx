"use client";
import React from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAdminAuth();

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className={`fi fi-rr-menu-burger`}></i>
          </button>
          <div className="header-logo">
            <h2>Ecommerce Dashboard</h2>
          </div>
        </div>

        <div className="header-right">
          <div className="header-search">
            <i className="fi fi-rr-search"></i>
            <input type="text" placeholder="Search..." />
          </div>

          <NotificationBell />

          {/* User Profile */}
          <div className="user-profile">
            <div className="profile-wrapper">
              <div className="profile-avatar">
                <i className="fi fi-rr-user"></i>
              </div>
              <div className="profile-info">
                <span className="user-name">{user?.name || "Admin"}</span>
                <span className="user-role">Administrator</span>
              </div>
              <button
                onClick={logout}
                className="logout-btn"
                aria-label="Logout"
                title="Logout"
              >
                <i className="fi fi-rr-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
