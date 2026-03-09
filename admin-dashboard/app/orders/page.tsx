"use client";
import React, { useEffect, useState, useMemo } from "react";
import { adminOrderService } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Pagination, Button } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

interface Order {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  items: any[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingInfo: { city?: string; country?: string };
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
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchOrders(newPage, statusFilter);
  };

  const columns: TableColumn<Order>[] = useMemo(
    () => [
      {
        key: "orderId",
        label: "Order ID",
        render: (o) => <span className="slug-text">#{o._id.slice(-6).toUpperCase()}</span>,
      },
      {
        key: "customer",
        label: "Customer",
        render: (o) => (
          <div>
            <div className="fw-semibold">{o.user?.name || "N/A"}</div>
            <small className="text-muted">{o.user?.email}</small>
          </div>
        ),
      },
      {
        key: "items",
        label: "Items",
        render: (o) => <>{o.items?.length || 0}</>,
      },
      {
        key: "totalPrice",
        label: "Total",
        render: (o) => <strong>${o.totalPrice?.toFixed(2)}</strong>,
      },
      {
        key: "payment",
        label: "Payment",
        render: (o) => (
          <>
            <span className="text-uppercase" style={{ fontSize: 11, fontWeight: 600 }}>
              {o.paymentMethod}
            </span>
            {o.isPaid && (
              <i className="fi fi-rr-check-circle ms-1" style={{ color: "#10b981", fontSize: 12 }} />
            )}
          </>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (o) => (
          <span className="active-badge" style={statusStyle(o.status)}>
            {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Date",
        render: (o) =>
          new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      {
        key: "actions",
        label: "Update Status",
        className: "text-center",
        render: (o) => (
          <select
            className="form-select form-select-sm"
            value={o.status}
            disabled={updatingId === o._id || o.status === "cancelled" || o.status === "delivered"}
            onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
            style={{ width: 130, fontSize: 12 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        ),
      },
    ],
    [updatingId]
  );

  return (
    <div className="category-page">
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <a href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home" />
                <span>Dashboard</span>
              </a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Orders</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap px-3">
        <Button
          variant={!statusFilter ? "primary" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("")}
        >
          All ({total})
        </Button>
        {STATUS_OPTIONS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "primary" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Orders</h2>
        </div>
        <Table columns={columns} data={orders} loading={loading} emptyMessage="No orders found" rowKey={(o) => o._id} />
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} total={total} />
      </div>
    </div>
  );
};

export default OrdersPage;
