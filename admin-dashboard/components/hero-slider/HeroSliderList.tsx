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

  // ── Computed stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: banners.length,
    active: banners.filter((b) => b.isActive).length,
    slider: banners.filter((b) => b.position === "slider").length,
    rightTop: banners.filter((b) => b.position === "rightTop").length,
    rightBottom: banners.filter((b) => b.position === "rightBottom").length,
  }), [banners]);

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableColumn<HeroBanner>[] = useMemo(
    () => [
      {
        key: "sortOrder",
        label: "#",
        render: (b) => <span className="order-badge">{b.sortOrder}</span>,
      },
      {
        key: "image",
        label: "Image",
        render: (b) =>
          b.image ? (
            <img src={getAssetUrl(b.image)} alt="Banner" className="slider-thumb" />
          ) : (
            <div className="slider-thumb-placeholder">
              <i className="fi fi-rr-picture" />
            </div>
          ),
      },
      {
        key: "position",
        label: "Position",
        render: (b) => (
          <span className={`position-badge position-badge--${b.position}`}>
            {positionLabels[b.position]}
          </span>
        ),
      },
      {
        key: "link",
        label: "Link",
        render: (b) =>
          b.link ? (
            <span className="btn-link-text" title={b.link}>
              {b.link}
            </span>
          ) : (
            <span className="empty-cell">—</span>
          ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (b) => (
          <button
            className={`status-toggle-btn ${b.isActive ? "status-active" : "status-inactive"}`}
            onClick={() => handleToggleStatus(b)}
            disabled={togglingId === b._id}
            title={b.isActive ? "Click to deactivate" : "Click to activate"}
          >
            {togglingId === b._id ? (
              <span className="ui-btn__spinner" style={{ width: 13, height: 13 }} />
            ) : (
              <>
                <span className="status-dot" />
                {b.isActive ? "Active" : "Inactive"}
              </>
            )}
          </button>
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
      <div className="hero-slider-page">
        <div className="alert alert-danger m-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="hero-slider-page">
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
          <div className="stat-icon" style={{ backgroundColor: "#f0f9ff" }}>
            <i className="fi fi-rr-layers" style={{ color: "#0ea5e9" }} />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Banners</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef7cd" }}>
            <i className="fi fi-rr-picture" style={{ color: "#eab308" }} />
          </div>
          <div className="stat-info">
            <h3>{stats.slider}</h3>
            <p>Slider</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#f3e8ff" }}>
            <i className="fi fi-rr-apps" style={{ color: "#a855f7" }} />
          </div>
          <div className="stat-info">
            <h3>{stats.rightTop + stats.rightBottom}</h3>
            <p>Side Banners</p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fi fi-rr-picture" />
            Hero Banners
          </h3>
          <span className="total-count">{banners.length} banners</span>
        </div>
        <Table
          columns={columns}
          data={banners}
          loading={loading}
          rowKey={(b) => b._id}
          emptyMessage="No banners found. Click 'Add Banner' to create the first one."
        />
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Edit Banner" : "Add New Banner"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="slider-form">
          {/* Image Upload */}
          <div className="slider-images-row">
            <div
              className="slider-image-upload"
              onClick={() => imageRef.current?.click()}
              title="Click to upload banner image"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Banner preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <i className="fi fi-rr-picture" />
                  <span>Banner Image</span>
                  <small>Required · Click to upload</small>
                </div>
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className="upload-overlay">
                <i className="fi fi-rr-camera" />
                <span>Change</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="slider-form-grid">
            <div className="slider-form-group">
              <label className="slider-form-label">
                Position <span className="required">*</span>
              </label>
              <select
                className="slider-form-control"
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
              <div className="slider-form-group">
                <label className="slider-form-label">Sort Order</label>
                <input
                  type="number"
                  className="slider-form-control"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: Number(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="slider-form-group slider-form-group--full">
              <label className="slider-form-label">Link URL</label>
              <input
                type="text"
                className="slider-form-control"
                placeholder="e.g. /all-products or /category/summer-sale"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

            <div className="slider-form-group slider-form-group--switch">
              <label className="slider-form-label">Status</label>
              <label className="slider-toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span className="slider-toggle-track" />
                <span className="slider-toggle-label">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Position hint */}
          {formData.position !== "slider" && (
            <div className="position-hint">
              <i className="fi fi-rr-info" />
              <span>
                Only one active banner allowed for {positionLabels[formData.position]}. 
                Creating a new active banner will deactivate the existing one.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="slider-form-actions">
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
