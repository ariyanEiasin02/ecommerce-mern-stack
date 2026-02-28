"use client";
import React, { useEffect, useState } from "react";
import { adminCouponService } from "@/services/adminService";
import { toast } from "react-toastify";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  code: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: "",
  minPurchase: "",
  maxUses: "",
  expiresAt: "",
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminCouponService.getAll();
      setCoupons(data || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.expiresAt) {
      setApiError("Code, discount value, and expiry date are required");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minPurchase: Number(formData.minPurchase) || 0,
        maxUses: Number(formData.maxUses) || 0,
        expiresAt: formData.expiresAt,
      };
      const newCoupon = await adminCouponService.create(payload);
      setCoupons((prev) => [newCoupon, ...prev]);
      setFormData(emptyForm);
      setShowForm(false);
      toast.success("Coupon created successfully!");
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    setDeletingId(id);
    try {
      await adminCouponService.delete(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success(`Coupon "${code}" deleted`);
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

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
              <span className="breadcrumb-item active">Coupons</span>
            </nav>
          </div>
          <button className="btn-create" onClick={() => setShowForm(!showForm)}>
            <i className={`fi fi-rr-${showForm ? "cross" : "plus"}`}></i>
            <span>{showForm ? "Cancel" : "Add Coupon"}</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="table-container mb-3">
          <div className="table-header">
            <h2>New Coupon</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            {apiError && <div className="alert alert-danger mb-3">{apiError}</div>}
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Code *</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SUMMER20"
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Type *</label>
                <select className="form-select" name="discountType" value={formData.discountType} onChange={handleChange}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  Value ({formData.discountType === "percentage" ? "%" : "$"}) *
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Min Purchase ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Max Uses (0 = unlimited)</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Expires At *</label>
                <input
                  type="date"
                  className="form-control"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-dark w-100" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-ticket" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{coupons.length}</h3>
            <p>Total Coupons</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{coupons.filter((c) => c.isActive && !isExpired(c.expiresAt)).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-clock" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{coupons.filter((c) => isExpired(c.expiresAt)).length}</h3>
            <p>Expired</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Coupons</h2>
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
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Purchase</th>
                  <th>Usage</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No coupons found
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <span className="fw-bold" style={{ fontFamily: "monospace", letterSpacing: 1 }}>
                          {c.code}
                        </span>
                      </td>
                      <td>
                        <strong>
                          {c.discountType === "percentage"
                            ? `${c.discountValue}%`
                            : `$${c.discountValue}`}
                        </strong>
                      </td>
                      <td>${c.minPurchase}</td>
                      <td>
                        {c.usedCount} / {c.maxUses === 0 ? "∞" : c.maxUses}
                      </td>
                      <td>
                        {new Date(c.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        {isExpired(c.expiresAt) ? (
                          <span className="active-badge inactive">Expired</span>
                        ) : (
                          <span className={`active-badge ${c.isActive ? "active" : "inactive"}`}>
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                            disabled={deletingId === c._id}
                            onClick={() => handleDelete(c._id, c.code)}
                          >
                            <i className={deletingId === c._id ? "fi fi-rr-spinner" : "fi fi-rr-trash"}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
