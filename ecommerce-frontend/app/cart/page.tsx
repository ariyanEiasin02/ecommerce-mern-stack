'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/common/Breadcrumb';

const CartPage = () => {
  const { items, itemCount, total, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to view your cart</h3>
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
    <section className="cart-section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
        <h2 className="cart-title">Shopping Cart ({itemCount} items)</h2>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="fi fi-rr-shopping-cart" style={{ fontSize: '3rem', color: '#d1d5db' }}></i>
            <h4 className="mt-3">Your cart is empty</h4>
            <p className="text-muted">Looks like you haven&apos;t added any items yet.</p>
            <Link href="/all-products" className="btn btn-primary mt-2">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {items.map((item: any) => {
                const product = item.product;
                const imgUrl = product?.images?.[0] || '/hero1.webp';
                const src = imgUrl.startsWith('http') || imgUrl.startsWith('/') ? imgUrl : `http://localhost:5000${imgUrl}`;
                return (
                  <div className="cart-item" key={item._id || product?._id}>
                    <Image
                      src={src}
                      alt={product?.name || 'Product'}
                      width={100}
                      height={100}
                      className="cart-item__image"
                    />
                    <div className="cart-item__info">
                      <div className="cart-item__name">
                        <Link href={`/product/${product?.slug || ''}`}>{product?.name}</Link>
                      </div>
                      <div className="cart-item__price">${product?.price?.toFixed(2)}</div>
                    </div>
                    <div className="cart-item__qty">
                      <button
                        onClick={() => updateQuantity(product?._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(product?._id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <div className="cart-item__total">
                      ${(product?.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(product?._id)}
                      aria-label="Remove item"
                    >
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  </div>
                );
              })}
              <div className="d-flex justify-content-between mt-3">
                <Link href="/all-products" className="btn btn-outline-secondary">
                  Continue Shopping
                </Link>
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-summary">
                <h5 className="cart-summary__title">Order Summary</h5>
                <div className="cart-summary__row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="btn btn-primary cart-summary__btn">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
