"use client";
import React, { useEffect, useState, useMemo } from "react";
import { adminCouponService } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Button, Input, ConfirmDeleteModal } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

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
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminCouponService.delete(deleteTarget._id);
      setCoupons((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      toast.success(`Coupon "${deleteTarget.code}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const columns: TableColumn<Coupon>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Code",
        render: (c) => (
          <span className="fw-bold" style={{ fontFamily: "monospace", letterSpacing: 1 }}>
            {c.code}
          </span>
        ),
      },
      {
        key: "discount",
        label: "Discount",
        render: (c) => (
          <strong>
            {c.discountType === "percentage" ? `${c.discountValue}%` : `$${c.discountValue}`}
          </strong>
        ),
      },
      {
        key: "minPurchase",
        label: "Min Purchase",
        render: (c) => <>${c.minPurchase}</>,
      },
      {
        key: "usage",
        label: "Usage",
        render: (c) => (
          <>
            {c.usedCount} / {c.maxUses === 0 ? "∞" : c.maxUses}
          </>
        ),
      },
      {
        key: "expiresAt",
        label: "Expires",
        render: (c) =>
          new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      {
        key: "status",
        label: "Status",
        render: (c) =>
          isExpired(c.expiresAt) ? (
            <span className="active-badge inactive">Expired</span>
          ) : (
            <span className={`active-badge ${c.isActive ? "active" : "inactive"}`}>
              {c.isActive ? "Active" : "Inactive"}
            </span>
          ),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        render: (c) => (
          <div className="action-buttons">
            <button
              className="action-btn delete-btn"
              title="Delete"
              onClick={() => setDeleteTarget(c)}
            >
              <i className="fi fi-rr-trash" />
            </button>
          </div>
        ),
      },
    ],
    []
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
              <span className="breadcrumb-item active">Coupons</span>
            </nav>
          </div>
          <Button
            variant={showForm ? "danger" : "primary"}
            icon={<i className={`fi fi-rr-${showForm ? "cross" : "plus"}`} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Coupon"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="table-container mb-3">
          <div className="table-header">
            <h2>New Coupon</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            {apiError && <div className="alert alert-danger mb-3">{apiError}</div>}
            <div className="row g-3">
              <div className="col-md-3">
                <Input
                  label="Code *"
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
                <Input
                  label={`Value (${formData.discountType === "percentage" ? "%" : "$"}) *`}
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder="10"
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Min Purchase ($)"
                  type="number"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Max Uses (0 = unlimited)"
                  type="number"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Expires At *"
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <Button type="submit" fullWidth loading={isSubmitting}>
                  Create Coupon
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-ticket" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{coupons.length}</h3>
            <p>Total Coupons</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{coupons.filter((c) => c.isActive && !isExpired(c.expiresAt)).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-clock" style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <h3>{coupons.filter((c) => isExpired(c.expiresAt)).length}</h3>
            <p>Expired</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Coupons</h2>
        </div>
        <Table columns={columns} data={coupons} loading={loading} emptyMessage="No coupons found" rowKey={(c) => c._id} />
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deleteTarget?.code || ""}
      />
    </div>
  );
};

export default CouponsPage;
