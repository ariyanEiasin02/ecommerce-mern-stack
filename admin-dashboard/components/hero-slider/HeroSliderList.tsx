"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { adminHeroBannerService, getAssetUrl } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Button, ConfirmDeleteModal, Modal } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

interface HeroBanner {
  _id: string;
  image: string;
  link?: string;
  position: "slider" | "rightTop" | "rightBottom";
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

const positionLabels: Record<string, string> = {
  slider: "Slider",
  rightTop: "Right Top",
  rightBottom: "Right Bottom",
};

const emptyForm = {
  link: "",
  position: "slider" as "slider" | "rightTop" | "rightBottom",
  sortOrder: 0,
  isActive: true,
};

const HeroBannerList = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HeroBanner | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<HeroBanner | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status toggling
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await adminHeroBannerService.getAll();
      setBanners(data);
    } catch {
      setError("Failed to load hero banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditTarget(null);
    setFormData({ ...emptyForm });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditTarget(banner);
    setFormData({
      link: banner.link || "",
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    setImageFile(null);
    setImagePreview(banner.image ? getAssetUrl(banner.image) : null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  // ── Image change ───────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget && !imageFile) {
      toast.error("Banner image is required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("link", formData.link);
      fd.append("position", formData.position);
      fd.append("sortOrder", String(formData.sortOrder));
      fd.append("isActive", String(formData.isActive));
      if (imageFile) fd.append("image", imageFile);

      if (editTarget) {
        const updated = await adminHeroBannerService.update(editTarget._id, fd);
        setBanners((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b)).sort((a, b) => a.sortOrder - b.sortOrder)
        );
        toast.success("Banner updated successfully!");
      } else {
        const created = await adminHeroBannerService.create(fd);
        setBanners((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
        toast.success("Banner created successfully!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Status toggle ──────────────────────────────────────────────────────────
  const handleToggleStatus = async (banner: HeroBanner) => {
    setTogglingId(banner._id);
    try {
      const updated = await adminHeroBannerService.toggleStatus(banner._id);
      setBanners((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      toast.success(`Banner ${updated.isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminHeroBannerService.delete(deleteTarget._id);
      setBanners((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("Banner deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableColumn<HeroBanner>[] = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (b) =>
          b.image ? (
            <img
              src={getAssetUrl(b.image)}
              alt="Banner"
              style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 6 }}
            />
          ) : (
            <div
              style={{
                width: 80, height: 48, borderRadius: 6, backgroundColor: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className="fi fi-rr-picture" style={{ color: "#94a3b8" }} />
            </div>
          ),
      },
      {
        key: "position",
        label: "Position",
        render: (b) => (
          <span className={`active-badge position-${b.position}`}>
            {positionLabels[b.position]}
          </span>
        ),
      },
      {
        key: "sortOrder",
        label: "Order",
        render: (b) => <span style={{ fontWeight: 600, color: "#475569" }}>{b.sortOrder}</span>,
      },
      {
        key: "link",
        label: "Link",
        render: (b) =>
          b.link ? (
            <span className="slug-text" title={b.link} style={{ maxWidth: 180, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {b.link}
            </span>
          ) : (
            <span className="description-text">—</span>
          ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (b) => (
          <button
            className={`active-badge ${b.isActive ? "active" : "inactive"}`}
            onClick={() => handleToggleStatus(b)}
            disabled={togglingId === b._id}
            title={b.isActive ? "Click to deactivate" : "Click to activate"}
            style={{ cursor: "pointer", border: "none" }}
          >
            {togglingId === b._id ? (
              <span className="ui-btn__spinner" style={{ width: 13, height: 13 }} />
            ) : (
              b.isActive ? "Active" : "Inactive"
            )}
          </button>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (b) => (
          <div className="date-cell">
            <span className="date">{formatDate(b.createdAt)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        render: (b) => (
          <div className="action-buttons">
            <button
              className="action-btn edit-btn"
              title="Edit"
              onClick={() => openEditModal(b)}
            >
              <i className="fi fi-rr-pencil" />
            </button>
            <button
              className="action-btn delete-btn"
              title="Delete"
              onClick={() => setDeleteTarget(b)}
            >
              <i className="fi fi-rr-trash" />
            </button>
          </div>
        ),
      },
    ],
    [togglingId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (error) {
    return (
      <div className="category-page">
        <div className="alert alert-danger m-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <a href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home" />
                <span>Dashboard</span>
              </a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Hero Banners</span>
            </nav>
          </div>
          <Button icon={<i className="fi fi-rr-plus" />} onClick={openCreateModal}>
            Add Banner
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-layers" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{banners.length}</h3>
            <p>Total Banners</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{banners.filter((b) => b.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <h3>{banners.filter((b) => !b.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-picture" style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-info">
            <h3>{banners.filter((b) => b.position === "slider").length}</h3>
            <p>Slider Banners</p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Hero Banners</h2>
        </div>
        <Table
          columns={columns}
          data={banners}
          loading={loading}
          rowKey={(b) => b._id}
          emptyMessage="No banners found. Click 'Add Banner' to create the first one."
        />
        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>{banners.length}</strong> banners
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Edit Banner" : "Add New Banner"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="banner-form">
          {/* Image Upload */}
          <div className="banner-upload-area">
            <div
              className="banner-upload-zone"
              onClick={() => imageRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Banner preview" className="banner-upload-preview" />
              ) : (
                <div className="banner-upload-placeholder">
                  <i className="fi fi-rr-cloud-upload" />
                  <span>Click to upload banner image</span>
                  <small>PNG, JPG, WEBP up to 5MB</small>
                </div>
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="banner-upload-change">
                  <i className="fi fi-rr-camera" />
                  <span>Change Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="banner-form-fields">
            <div className="banner-form-row">
              <div className="banner-form-group">
                <label>
                  Position <span className="required">*</span>
                </label>
                <select
                  className="form-input"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value as any })
                  }
                >
                  <option value="slider">Slider (Main Carousel)</option>
                  <option value="rightTop">Right Top Banner</option>
                  <option value="rightBottom">Right Bottom Banner</option>
                </select>
              </div>

              {formData.position === "slider" && (
                <div className="banner-form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>

            <div className="banner-form-group">
              <label>Link URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. /all-products or /category/summer-sale"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div className="banner-form-group">
              <label>Status</label>
              <label className="banner-toggle">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className="banner-toggle-track" />
                <span className="banner-toggle-label">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Position hint */}
          {formData.position !== "slider" && (
            <div className="banner-hint">
              <i className="fi fi-rr-info" />
              <span>
                Only one active banner allowed for {positionLabels[formData.position]}. 
                Creating a new active banner will deactivate the existing one.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="banner-form-actions">
            <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editTarget ? "Update Banner" : "Create Banner"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={`${positionLabels[deleteTarget?.position || "slider"]} banner`}
      />
    </div>
  );
};

export default HeroBannerList;
