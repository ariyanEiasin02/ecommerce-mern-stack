"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCategoryService, getAssetUrl } from "@/services/adminService";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentCategory?: { _id: string; name: string } | null;
  createdAt: string;
}

const SubCategoryPage = () => {
  const router = useRouter();
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getAll();
      setSubCategories(data.filter((c: Category) => c.parentCategory));
    } catch {
      toast.error("Failed to load sub-categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await adminCategoryService.delete(id);
      setSubCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success(`"${name}" deleted successfully`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete sub-category");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = subCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.parentCategory as any)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <div className="category-page">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: 300 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <Link href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home"></i>
                <span>Dashboard</span>
              </Link>
              <span className="breadcrumb-separator">/</span>
              <Link href="/category/all" className="breadcrumb-item">
                Category
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Sub Categories</span>
            </nav>
          </div>
          <button
            className="btn-create"
            onClick={() => router.push("/category/add")}
          >
            <i className="fi fi-rr-plus"></i>
            <span>Add Sub Category</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-apps" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{subCategories.length}</h3>
            <p>Total Sub Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{subCategories.filter((c) => c.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{subCategories.filter((c) => !c.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-folder" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>
              {[...new Set(subCategories.map((c) => (c.parentCategory as any)?._id))].length}
            </h3>
            <p>Parent Categories</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Sub Categories</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <i
                className="fi fi-rr-search"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              ></i>
              <input
                type="text"
                placeholder="Search sub-categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  height: 38,
                  paddingLeft: 36,
                  paddingRight: 12,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                  background: "#f8fafc",
                  minWidth: 220,
                }}
              />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Sub Category</th>
                <th>Slug</th>
                <th>Parent Category</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    {search ? "No results found" : "No sub-categories yet. Create one by selecting a parent category."}
                  </td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      {cat.image ? (
                        <img
                          src={getAssetUrl(cat.image!)}
                          alt={cat.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="fi fi-rr-picture" style={{ color: "#94a3b8" }}></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="category-name">
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="slug-text">{cat.slug}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          background: "#e0e7ff",
                          color: "#4338ca",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <i className="fi fi-rr-folder" style={{ fontSize: 11 }}></i>
                        {(cat.parentCategory as any)?.name || "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`active-badge ${cat.isActive ? "active" : "inactive"}`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span className="date">{formatDate(cat.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          disabled={deletingId === cat._id}
                          onClick={() => handleDelete(cat._id, cat.name)}
                        >
                          <i
                            className={
                              deletingId === cat._id ? "fi fi-rr-spinner" : "fi fi-rr-trash"
                            }
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{subCategories.length}</strong> sub-categories
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
