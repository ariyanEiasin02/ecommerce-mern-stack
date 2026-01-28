import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-4">

          {/* Brand / About */}
          <div className="col-lg-3 col-md-6">
            <h4 className="footer-title">E-SHOP</h4>
            <p className="footer-text">
              Your trusted online store for quality products, fast delivery,
              and secure payments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Top Categories</h5>
            <ul className="footer-links">
              <li><a href="#"></a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Customer Service</h5>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-contact">
              <li>Email: support@shopease.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} E-SHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
