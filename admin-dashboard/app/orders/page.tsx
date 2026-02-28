"use client";
import React, { useEffect, useState } from "react";
import { adminOrderService } from "@/services/adminService";

interface Order {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  items: any[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingAddress: { city?: string; country?: string };
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusStyle = (status: string) => {
  switch (status) {
    case "delivered":
      return { backgroundColor: "#ecfdf5", color: "#065f46" };
    case "cancelled":
      return { backgroundColor: "#fee2e2", color: "#991b1b" };
    case "processing":
      return { backgroundColor: "#dbeafe", color: "#1e40af" };
    case "shipped":
      return { backgroundColor: "#e0e7ff", color: "#3730a3" };
    default:
      return { backgroundColor: "#fef3c7", color: "#92400e" };
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async (p = page, status = statusFilter) => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page: p, limit: 12 };
      if (status) params.status = status;
      const res = await adminOrderService.getAll(params);
      setOrders(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
      setTotal(res.pagination?.total || 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
    fetchOrders(1, status);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await adminOrderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchOrders(newPage, statusFilter);
  };

  return (
    <div className="category-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <a href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home"></i>
                <span>Dashboard</span>
              </a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Orders</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="d-flex gap-2 mb-3 flex-wrap px-3">
        <button
          className={`btn btn-sm ${!statusFilter ? "btn-dark" : "btn-outline-secondary"}`}
          onClick={() => handleFilterChange("")}
        >
          All ({total})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => handleFilterChange(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Orders</h2>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-center">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="slug-text">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{order.user?.name || "N/A"}</div>
                          <small className="text-muted">{order.user?.email}</small>
                        </div>
                      </td>
                      <td>{order.items?.length || 0}</td>
                      <td>
                        <strong>${order.totalPrice?.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className="text-uppercase" style={{ fontSize: 11, fontWeight: 600 }}>
                          {order.paymentMethod}
                        </span>
                        {order.isPaid && (
                          <i className="fi fi-rr-check-circle ms-1" style={{ color: "#10b981", fontSize: 12 }}></i>
                        )}
                      </td>
                      <td>
                        <span className="active-badge" style={statusStyle(order.status)}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.status}
                          disabled={updatingId === order._id || order.status === "cancelled" || order.status === "delivered"}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{ width: 130, fontSize: 12 }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-footer">
            <div className="showing-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className="pagination">
              <button className="page-btn" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                <i className="fi fi-rr-angle-left"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const num = start + i;
                return (
                  <button key={num} className={`page-btn ${num === page ? "active" : ""}`} onClick={() => handlePageChange(num)}>
                    {num}
                  </button>
                );
              })}
              <button className="page-btn" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                <i className="fi fi-rr-angle-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
