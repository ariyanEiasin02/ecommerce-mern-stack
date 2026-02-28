"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminCategoryService } from "@/services/adminService";

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

const CategoryList = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getAll();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await adminCategoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="alert alert-danger m-4">{error}</div>
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
              <a href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home"></i>
                <span>Dashboard</span>
              </a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item">Category</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">List</span>
            </nav>
          </div>
          <button
            className="btn-create"
            onClick={() => router.push("/category/add")}
          >
            <i className="fi fi-rr-plus"></i>
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => c.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => !c.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-folder" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => c.parentCategory).length}</h3>
            <p>Sub-categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-apps" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Categories</h2>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Active</th>
                <th>Created Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No categories found. Create your first category!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      {cat.image ? (
                        <img
                          src={`http://localhost:5000${cat.image}`}
                          alt={cat.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            backgroundColor: "#f1f5f9",
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
                      <span className="description-text">
                        {cat.parentCategory?.name || "—"}
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
                          <i className={deletingId === cat._id ? "fi fi-rr-spinner" : "fi fi-rr-trash"}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>{categories.length}</strong> categories
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
