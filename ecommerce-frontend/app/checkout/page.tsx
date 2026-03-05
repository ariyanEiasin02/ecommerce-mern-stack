'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import Breadcrumb from '@/components/common/Breadcrumb';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to checkout</h3>
        <Link href="/login" className="btn btn-primary mt-3">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your cart is empty</h3>
        <Link href="/all-products" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCouponApply = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await couponService.validateCoupon(coupon, total);
      setDiscount(res.discountAmount || 0);
      setCouponMsg(`Coupon applied! You save $${(res.discountAmount || 0).toFixed(2)}`);
    } catch (err: any) {
      setDiscount(0);
      setCouponMsg(err?.response?.data?.message || 'Invalid coupon');
    }
  };

  const finalTotal = Math.max(0, total - discount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await orderService.createOrder({
        shippingInfo: shipping,
        paymentMethod,
        couponCode: coupon || undefined,
      });

      await clearCart();
      router.push('/profile');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-section">
      <div className="container">
        <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        <h2 className="checkout-title">Checkout</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handlePlaceOrder}>
          <div className="row">
            <div className="col-lg-8">
              {/* Shipping Info */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Shipping Information</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text" className="form-control" name="fullName"
                        value={shipping.fullName} onChange={handleShippingChange} required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        type="text" className="form-control" name="address"
                        value={shipping.address} onChange={handleShippingChange} required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text" className="form-control" name="city"
                        value={shipping.city} onChange={handleShippingChange} required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text" className="form-control" name="state"
                        value={shipping.state} onChange={handleShippingChange} required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text" className="form-control" name="zipCode"
                        value={shipping.zipCode} onChange={handleShippingChange} required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <select className="form-select" name="country" value={shipping.country} onChange={handleShippingChange}>
                        <option value="US">United States</option>
                        <option value="BD">Bangladesh</option>
                        <option value="IN">India</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="text" className="form-control" name="phone"
                        value={shipping.phone} onChange={handleShippingChange} required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Payment Method</h5>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input" type="radio" name="payment"
                      id="cod" value="cod" checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input" type="radio" name="payment"
                      id="stripe" value="stripe" checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    <label className="form-check-label" htmlFor="stripe">Pay with Stripe</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-summary">
                <h5 className="cart-summary__title">Order Summary</h5>
                {items.map((item: any) => (
                  <div key={item._id || item.product?._id} className="d-flex justify-content-between mb-2" style={{ fontSize: '0.85rem' }}>
                    <span className="text-truncate" style={{ maxWidth: '60%' }}>
                      {item.product?.title} × {item.quantity}
                    </span>
                    <span>${((item.product?.price ?? 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-summary__row text-success">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                {/* Coupon */}
                <div className="mt-3">
                  <div className="input-group input-group-sm">
                    <input
                      type="text" className="form-control"
                      placeholder="Coupon code" value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={handleCouponApply}>
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <small className={discount > 0 ? 'text-success' : 'text-danger'}>{couponMsg}</small>
                  )}
                </div>

                <button type="submit" className="btn btn-primary cart-summary__btn" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
