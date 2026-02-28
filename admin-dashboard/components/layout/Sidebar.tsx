"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
}

const NavLink: React.FC<NavItemProps> = ({ href, icon, label, exact }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <div className={`nav-item ${isActive ? "active" : ""}`}>
      <Link href={href} className={`nav-link ${isActive ? "active" : ""}`}>
        <i className={`fi ${icon}`}></i>
        <span>{label}</span>
      </Link>
    </div>
  );
};

interface NavGroupProps {
  icon: string;
  label: string;
  prefix: string;
  children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({ icon, label, prefix, children }) => {
  const pathname = usePathname();
  const isOpen = pathname.startsWith(prefix);
  const [open, setOpen] = React.useState(isOpen);
  return (
    <div className={`nav-item ${isOpen ? "active" : ""}`}>
      <button
        className={`nav-link ${open ? "active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <i className={`fi ${icon}`}></i>
        <span>{label}</span>
        <i className={`arrow fi fi-rr-angle-small-${open ? "up" : "down"}`}></i>
      </button>
      {open && <ul className="sub-menu">{children}</ul>}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="fi fi-rr-rocket-lunch"></i>
          </div>
          <div className="brand-text">
            <h3>E-Shop</h3>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="menu-label">MAIN MENU</div>

          <NavLink href="/" icon="fi-rr-dashboard" label="Dashboard" exact />

          <NavGroup icon="fi-tr-category-alt" label="Category" prefix="/category">
            <li className={pathname === "/category/all" ? "active" : ""}>
              <Link href="/category/all">All Categories</Link>
            </li>
            <li className={pathname === "/category/add" ? "active" : ""}>
              <Link href="/category/add">Add Category</Link>
            </li>
          </NavGroup>

          <NavGroup icon="fi-rr-box" label="Products" prefix="/products">
            <li className={pathname === "/products/all" ? "active" : ""}>
              <Link href="/products/all">All Products</Link>
            </li>
            <li className={pathname === "/products/add" ? "active" : ""}>
              <Link href="/products/add">Add Product</Link>
            </li>
          </NavGroup>

          <NavLink href="/users/all" icon="fi-rr-users" label="Users" />
          <NavLink href="/orders" icon="fi-rr-shopping-cart" label="Orders" />
          <NavLink href="/coupons" icon="fi-rr-ticket" label="Coupons" />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
