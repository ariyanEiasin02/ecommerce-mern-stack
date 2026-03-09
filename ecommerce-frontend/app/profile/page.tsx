'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

const ProfilePage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'password'>('profile');
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

const handleProfileUpdate = async (e: React.FormEvent) => {
  console.log("ok");
}
  

const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("okk");
};
  
  return (
    <section className="profile-section">
      <div className="container">
        <Breadcrumb items={[{ label: 'My Account' }]} />

        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="profile-card">
              <div className="profile-card__header">
                <div className="profile-card__avatar">
                  <i className="fi fi-rr-user"></i>
                </div>
                <div>
                  <div className="profile-card__name">{"John Doe"}</div>
                  <div className="profile-card__email">{"john.doe@example.com"}</div>
                </div>
              </div>
              <ul className="list-group list-group-flush">
                <li
                  className={`list-group-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fi fi-rr-user me-2"></i> Profile
                </li>
                <li
                  className={`list-group-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fi fi-rr-shopping-bag me-2"></i> Orders
                </li>
                <li
                  className={`list-group-item ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fi fi-rr-lock me-2"></i> Change Password
                </li>
                <li className="list-group-item text-danger" style={{ cursor: 'pointer' }}>
                  <i className="fi fi-rr-sign-out-alt me-2"></i> Logout
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-9">
          

            {activeTab === 'profile' && (
              <div className="profile-card">
                <h5 className="mb-4">Edit Profile</h5>
                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h5 className="mb-4">My Orders</h5>
                {orders.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>No orders yet.</p>
                    <Link href="/all-products" className="btn btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  orders.map((order: any) => (
                    <div className="order-item" key={order._id}>
                      <div className="order-item__header">
                        <span className="order-item__id">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`order-item__status`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="order-item__date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="order-item__total">${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>
                        {order.items?.length || 0} item(s)
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-card">
                <h5 className="mb-4">Change Password</h5>
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
