"use client";
import React from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
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

          <button className="header-icon-btn" aria-label="Notifications">
            <i className="fi fi-rr-bell"></i>
            <span className="badge">3</span>
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <div className="profile-wrapper">
              <div className="profile-avatar">
                <i className="fi fi-rr-user"></i>
              </div>
              <div className="profile-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Administrator</span>
              </div>
              <i className="fi fi-rr-angle-small-down"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
