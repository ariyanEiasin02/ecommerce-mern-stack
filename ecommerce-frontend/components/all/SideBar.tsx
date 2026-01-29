"use client";
import React from "react";

const SideBar = () => {
  return (
    <aside className="ecom-sidebar">
      <h5 className="sidebar-title">Categories</h5>

      <div className="accordion" id="sidebarAccordion">
        {/* Category 1 */}
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
              <ul>
                <li>T-Shirts</li>
                <li>Shirts</li>
                <li>Jackets</li>
                <li>Jeans</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Category 2 */}
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
              <ul>
                <li>Dresses</li>
                <li>Tops</li>
                <li>Saree</li>
                <li>Handbags</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Category 3 */}
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
            </button>
          </h2>
          <div
            id="catThree"
            className="accordion-collapse collapse"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body">
              <ul>
                <li>Mobile Phones</li>
                <li>Laptops</li>
                <li>Headphones</li>
                <li>Smart Watch</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
