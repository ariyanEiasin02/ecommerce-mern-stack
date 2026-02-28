'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCard from '@/components/card/ProductCard';

const WishlistPage = () => {
  const { items, count, loading, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to view your wishlist</h3>
        <Link href="/login" className="btn btn-primary mt-3">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="wishlist-section">
      <div className="container">
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />
        <h2 className="wishlist-title">My Wishlist ({count} items)</h2>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="fi fi-rr-heart" style={{ fontSize: '3rem', color: '#d1d5db' }}></i>
            <h4 className="mt-3">Your wishlist is empty</h4>
            <p className="text-muted">Save items you love for later.</p>
            <Link href="/all-products" className="btn btn-primary mt-2">Explore Products</Link>
          </div>
        ) : (
          <div className="row g-4">
            {items.map((product: any) => (
              <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={product._id}>
                <ProductCard
                  id={product._id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  images={product.images || []}
                  rating={product.rating}
                  soldCount={product.soldCount}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
