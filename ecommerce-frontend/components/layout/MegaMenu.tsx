"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaChevronDown,
  FaDesktop,
  FaLaptop,
  FaMicrochip,
  FaTv,
  FaMobileAlt,
  FaTabletAlt,
  FaCamera,
  FaNetworkWired,
  FaGamepad,
} from "react-icons/fa";

interface Brand {
  name: string;
  slug: string;
}

interface PromoImage {
  src: string;
  alt: string;
  label: string;
  href: string;
}

interface Category {
  id: string;
  label: string;
  slug: string;
  icon: React.ReactNode;
  brands: Brand[];
  promo: PromoImage;
}

const categories: Category[] = [
  {
    id: "desktop",
    label: "Desktop",
    slug: "desktop",
    icon: <FaDesktop />,
    brands: [
      { name: "Asus", slug: "asus" },
      { name: "Dell", slug: "dell" },
      { name: "HP", slug: "hp" },
      { name: "Lenovo", slug: "lenovo" },
      { name: "MSI", slug: "msi" },
      { name: "Acer", slug: "acer" },
      { name: "Apple", slug: "apple" },
      { name: "Gigabyte", slug: "gigabyte" },
      { name: "Intel NUC", slug: "intel-nuc" },
      { name: "Corsair", slug: "corsair" },
      { name: "Gaming PC", slug: "gaming-pc" },
      { name: "Show All Desktop", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1593640408182-31c228d2e8a6?w=400&h=280&fit=crop",
      alt: "Desktop PC Promo",
      label: "🔥 Up to 30% off Gaming Desktops",
      href: "/all-products?category=desktop",
    },
  },
  {
    id: "laptop",
    label: "Laptop",
    slug: "laptop",
    icon: <FaLaptop />,
    brands: [
      { name: "Apple MacBook", slug: "apple" },
      { name: "Asus", slug: "asus" },
      { name: "Dell", slug: "dell" },
      { name: "HP", slug: "hp" },
      { name: "Lenovo", slug: "lenovo" },
      { name: "MSI", slug: "msi" },
      { name: "Acer", slug: "acer" },
      { name: "Microsoft Surface", slug: "microsoft" },
      { name: "Samsung", slug: "samsung" },
      { name: "Razer", slug: "razer" },
      { name: "Gaming Laptop", slug: "gaming-laptop" },
      { name: "Show All Laptop", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=280&fit=crop",
      alt: "Laptop Promo",
      label: "💻 New Arrivals — Ultrabooks from $699",
      href: "/all-products?category=laptop",
    },
  },
  {
    id: "component",
    label: "Component",
    slug: "component",
    icon: <FaMicrochip />,
    brands: [
      { name: "Intel", slug: "intel" },
      { name: "AMD", slug: "amd" },
      { name: "Nvidia", slug: "nvidia" },
      { name: "Corsair RAM", slug: "corsair" },
      { name: "Samsung SSD", slug: "samsung" },
      { name: "WD Storage", slug: "wd" },
      { name: "Seagate HDD", slug: "seagate" },
      { name: "EVGA", slug: "evga" },
      { name: "Gigabyte", slug: "gigabyte" },
      { name: "ASRock", slug: "asrock" },
      { name: "PSU / Cooling", slug: "psu-cooling" },
      { name: "Show All Parts", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=280&fit=crop",
      alt: "Component Promo",
      label: "⚡ RTX 4090 — Best Price Guaranteed",
      href: "/all-products?category=component",
    },
  },
  {
    id: "monitor",
    label: "Monitor",
    slug: "monitor",
    icon: <FaTv />,
    brands: [
      { name: "MSI", slug: "msi" },
      { name: "Titan Army", slug: "titan-army" },
      { name: "AOC", slug: "aoc" },
      { name: "AIWA", slug: "aiwa" },
      { name: "HP", slug: "hp" },
      { name: "FeuVision", slug: "feuvision" },
      { name: "Asus", slug: "asus" },
      { name: "Xiaomi", slug: "xiaomi" },
      { name: "Lenovo", slug: "lenovo" },
      { name: "Gigasonic", slug: "gigasonic" },
      { name: "LG", slug: "lg" },
      { name: "TrendSonic", slug: "trendsonic" },
      { name: "Philips", slug: "philips" },
      { name: "HKC", slug: "hkc" },
      { name: "Dell", slug: "dell" },
      { name: "Arzopa", slug: "arzopa" },
      { name: "Gigabyte", slug: "gigabyte" },
      { name: "Koorui", slug: "koorui" },
      { name: "Samsung", slug: "samsung" },
      { name: "Fopo", slug: "fopo" },
      { name: "Acer", slug: "acer" },
      { name: "GEESUU", slug: "geesuu" },
      { name: "Viewsonic", slug: "viewsonic" },
      { name: "Eurovision", slug: "eurovision" },
      { name: "BenQ", slug: "benq" },
      { name: "Gaming Monitor", slug: "gaming-monitor" },
      { name: "Corsair", slug: "corsair" },
      { name: "Curved Monitor", slug: "curved-monitor" },
      { name: "Walton", slug: "walton" },
      { name: "Touch Monitor", slug: "touch-monitor" },
      { name: "Dahua", slug: "dahua" },
      { name: "4K Monitor", slug: "4k-monitor" },
      { name: "PC Power", slug: "pc-power" },
      { name: "Portable Monitor", slug: "portable-monitor" },
      { name: "Hikvision", slug: "hikvision" },
      { name: "Monitor Arm", slug: "monitor-arm" },
      { name: "ThundeRobot", slug: "thunderobot" },
      { name: "Show All Monitor", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1527443224154-a3fbf46d93d3?w=400&h=280&fit=crop",
      alt: "Monitor Promo",
      label: "🖥️ 4K Gaming Monitors — Free Shipping",
      href: "/all-products?category=monitor",
    },
  },
  {
    id: "phone",
    label: "Phone",
    slug: "phone",
    icon: <FaMobileAlt />,
    brands: [
      { name: "Apple iPhone", slug: "apple" },
      { name: "Samsung", slug: "samsung" },
      { name: "Xiaomi", slug: "xiaomi" },
      { name: "OnePlus", slug: "oneplus" },
      { name: "Google Pixel", slug: "google" },
      { name: "Oppo", slug: "oppo" },
      { name: "Vivo", slug: "vivo" },
      { name: "Realme", slug: "realme" },
      { name: "Nokia", slug: "nokia" },
      { name: "Motorola", slug: "motorola" },
      { name: "Huawei", slug: "huawei" },
      { name: "Show All Phones", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=280&fit=crop",
      alt: "Phone Promo",
      label: "📱 iPhone 15 Series — Trade-in deals",
      href: "/all-products?category=phone",
    },
  },
  {
    id: "tablet",
    label: "Tablet",
    slug: "tablet",
    icon: <FaTabletAlt />,
    brands: [
      { name: "Apple iPad", slug: "apple" },
      { name: "Samsung Tab", slug: "samsung" },
      { name: "Lenovo Tab", slug: "lenovo" },
      { name: "Xiaomi Pad", slug: "xiaomi" },
      { name: "Huawei Pad", slug: "huawei" },
      { name: "Microsoft Surface", slug: "microsoft" },
      { name: "Amazon Fire", slug: "amazon" },
      { name: "Realme Pad", slug: "realme" },
      { name: "Oppo Pad", slug: "oppo" },
      { name: "Asus Pad", slug: "asus" },
      { name: "Kids Tablet", slug: "kids-tablet" },
      { name: "Show All Tablets", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=280&fit=crop",
      alt: "Tablet Promo",
      label: "📟 iPad Pro M4 — Now Available",
      href: "/all-products?category=tablet",
    },
  },
  {
    id: "camera",
    label: "Camera",
    slug: "camera",
    icon: <FaCamera />,
    brands: [
      { name: "Canon", slug: "canon" },
      { name: "Nikon", slug: "nikon" },
      { name: "Sony", slug: "sony" },
      { name: "Fujifilm", slug: "fujifilm" },
      { name: "Panasonic", slug: "panasonic" },
      { name: "GoPro", slug: "gopro" },
      { name: "DJI", slug: "dji" },
      { name: "Olympus", slug: "olympus" },
      { name: "Leica", slug: "leica" },
      { name: "Ricoh", slug: "ricoh" },
      { name: "Action Camera", slug: "action-camera" },
      { name: "Show All Cameras", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=280&fit=crop",
      alt: "Camera Promo",
      label: "📷 Sony A7 Series — Best Deals",
      href: "/all-products?category=camera",
    },
  },
  {
    id: "gaming",
    label: "Gaming",
    slug: "gaming",
    icon: <FaGamepad />,
    brands: [
      { name: "PlayStation 5", slug: "playstation" },
      { name: "Xbox Series X", slug: "xbox" },
      { name: "Nintendo Switch", slug: "nintendo" },
      { name: "Razer", slug: "razer" },
      { name: "SteelSeries", slug: "steelseries" },
      { name: "Logitech G", slug: "logitech" },
      { name: "Corsair", slug: "corsair" },
      { name: "HyperX", slug: "hyperx" },
      { name: "ASUS ROG", slug: "asus-rog" },
      { name: "MSI Gaming", slug: "msi" },
      { name: "Gaming Chairs", slug: "gaming-chair" },
      { name: "Show All Gaming", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=280&fit=crop",
      alt: "Gaming Promo",
      label: "🎮 PS5 Bundle Deals — Limited Stock",
      href: "/all-products?category=gaming",
    },
  },
  {
    id: "networking",
    label: "Networking",
    slug: "networking",
    icon: <FaNetworkWired />,
    brands: [
      { name: "TP-Link", slug: "tp-link" },
      { name: "Asus Router", slug: "asus" },
      { name: "Netgear", slug: "netgear" },
      { name: "D-Link", slug: "d-link" },
      { name: "Cisco", slug: "cisco" },
      { name: "Ubiquiti", slug: "ubiquiti" },
      { name: "MikroTik", slug: "mikrotik" },
      { name: "Tenda", slug: "tenda" },
      { name: "ZTE", slug: "zte" },
      { name: "Huawei Router", slug: "huawei" },
      { name: "Mesh Network", slug: "mesh-network" },
      { name: "Show All Networking", slug: "all" },
    ],
    promo: {
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=280&fit=crop",
      alt: "Networking Promo",
      label: "📡 Wi-Fi 7 Routers — Ultra Fast",
      href: "/all-products?category=networking",
    },
  },
];

const HALF = Math.ceil;

const MegaMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 120);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const activeCat = categories.find((c) => c.id === activeCategory);
  const col1 = activeCat ? activeCat.brands.slice(0, HALF(activeCat.brands.length / 2)) : [];
  const col2 = activeCat ? activeCat.brands.slice(HALF(activeCat.brands.length / 2)) : [];

  return (
    <div className="mega-menu-bar" onMouseLeave={handleMouseLeave}>
      {/* Category Nav Bar */}
      <nav className="mega-menu-nav">
        <div className="container">
          <ul className="mega-menu-list">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`mega-menu-item ${activeCategory === cat.id ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(cat.id)}
              >
                <Link href={`/all-products?category=${cat.slug}`} className="mega-menu-link">
                  <span className="mega-menu-icon">{cat.icon}</span>
                  <span className="mega-menu-label">{cat.label}</span>
                  <FaChevronDown className="mega-menu-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mega Dropdown */}
      {activeCat && (
        <div
          className={`mega-dropdown ${activeCategory ? "visible" : ""}`}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container">
            <div className="mega-dropdown-inner">
              {/* Left: brand columns */}
              <div className="mega-brands">
                <div className="mega-brands-header">
                  <span className="mega-cat-icon">{activeCat.icon}</span>
                  <h3 className="mega-cat-title">{activeCat.label}</h3>
                </div>

                <div className="mega-brands-grid">
                  {/* Column 1 */}
                  <ul className="mega-brand-col">
                    {col1.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/all-products?category=${activeCat.slug}&brand=${brand.slug}`}
                          className="mega-brand-link"
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {/* Column 2 */}
                  <ul className="mega-brand-col">
                    {col2.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/all-products?category=${activeCat.slug}&brand=${brand.slug}`}
                          className={`mega-brand-link ${brand.slug === "all" ? "mega-show-all" : ""}`}
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Promo Image */}
              <div className="mega-promo">
                <Link href={activeCat.promo.href} className="mega-promo-card">
                  <div className="mega-promo-img-wrapper">
                    <img
                      src={activeCat.promo.src}
                      alt={activeCat.promo.alt}
                      className="mega-promo-img"
                    />
                    <div className="mega-promo-overlay">
                      <span className="mega-promo-badge">Deals</span>
                      <p className="mega-promo-label">{activeCat.promo.label}</p>
                      <span className="mega-promo-cta">Shop Now →</span>
                    </div>
                  </div>
                </Link>
                {/* Quick links */}
                <div className="mega-quick-links">
                  <p className="mega-quick-title">Quick Links</p>
                  <div className="mega-quick-grid">
                    <Link href={`/all-products?category=${activeCat.slug}&filter=new`} className="mega-quick-link">New Arrivals</Link>
                    <Link href={`/all-products?category=${activeCat.slug}&filter=sale`} className="mega-quick-link">On Sale</Link>
                    <Link href={`/all-products?category=${activeCat.slug}&filter=top`} className="mega-quick-link">Top Rated</Link>
                    <Link href={`/all-products?category=${activeCat.slug}&filter=trending`} className="mega-quick-link">Trending</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
