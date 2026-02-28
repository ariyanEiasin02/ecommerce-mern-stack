"use client";
import React, { useEffect, useState } from "react";
import { adminDashboardService } from "@/services/adminService";

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  recentOrders: any[];
  topProducts: any[];
  orderStatusDistribution: { _id: string; count: number }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService
      .getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-danger m-4">Failed to load dashboard data</div>;
  }

  const getStatusCount = (status: string) =>
    data.orderStatusDistribution.find((s) => s._id === status)?.count || 0;

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <span className="breadcrumb-item">
                <i className="fi fi-rr-home"></i>
                <span>Dashboard</span>
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Overview</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-shopping-cart" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{data.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-dollar" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>${data.totalSales.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-box" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>{data.totalProducts}</h3>
            <p>Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-users" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{data.totalUsers}</h3>
            <p>Users</p>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="stats-grid" style={{ marginTop: 0 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-clock" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getStatusCount("pending")}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dbeafe" }}>
            <i className="fi fi-rr-time-forward" style={{ color: "#3b82f6" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getStatusCount("processing")}</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getStatusCount("delivered")}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{getStatusCount("cancelled")}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-7">
          <div className="table-container">
            <div className="table-header">
              <h2>Recent Orders</h2>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    data.recentOrders.slice(0, 8).map((order: any) => (
                      <tr key={order._id}>
                        <td>
                          <span className="slug-text">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>{order.user?.name || "N/A"}</td>
                        <td>
                          <strong>${order.totalPrice?.toFixed(2)}</strong>
                        </td>
                        <td>
                          <span
                            className={`active-badge ${
                              order.status === "delivered"
                                ? "active"
                                : order.status === "cancelled"
                                  ? "inactive"
                                  : ""
                            }`}
                            style={
                              order.status === "pending"
                                ? { backgroundColor: "#fef3c7", color: "#b45309" }
                                : order.status === "processing"
                                  ? { backgroundColor: "#dbeafe", color: "#2563eb" }
                                  : order.status === "shipped"
                                    ? { backgroundColor: "#e0e7ff", color: "#4338ca" }
                                    : {}
                            }
                          >
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="col-lg-5">
          <div className="table-container">
            <div className="table-header">
              <h2>Top Selling Products</h2>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted">
                        No products yet
                      </td>
                    </tr>
                  ) : (
                    data.topProducts.map((p: any) => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {p.images?.[0] ? (
                              <img
                                src={`http://localhost:5000${p.images[0].url || p.images[0]}`}
                                alt={p.title}
                                style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }}
                              />
                            ) : null}
                            <span className="text-truncate" style={{ maxWidth: 150 }}>
                              {p.title}
                            </span>
                          </div>
                        </td>
                        <td>{p.soldCount}</td>
                        <td>${p.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
