"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminCategoryService, getAssetUrl } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Button, ConfirmDeleteModal } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

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
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminCategoryService.delete(deleteTarget._id);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const columns: TableColumn<Category>[] = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (cat) =>
          cat.image ? (
            <img
              src={getAssetUrl(cat.image)}
              alt={cat.name}
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
            />
          ) : (
            <div
              style={{
                width: 40, height: 40, borderRadius: 6, backgroundColor: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className="fi fi-rr-picture" style={{ color: "#94a3b8" }} />
            </div>
          ),
      },
      {
        key: "name",
        label: "Category Name",
        render: (cat) => (
          <div className="category-name">
            <span>{cat.name}</span>
          </div>
        ),
      },
      {
        key: "slug",
        label: "Slug",
        render: (cat) => <span className="slug-text">{cat.slug}</span>,
      },
      {
        key: "parent",
        label: "Parent",
        render: (cat) => (
          <span className="description-text">{cat.parentCategory?.name || "—"}</span>
        ),
      },
      {
        key: "isActive",
        label: "Active",
        render: (cat) => (
          <span className={`active-badge ${cat.isActive ? "active" : "inactive"}`}>
            {cat.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created Date",
        render: (cat) => (
          <div className="date-cell">
            <span className="date">{formatDate(cat.createdAt)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        render: (cat) => (
          <div className="action-buttons">
            <button
              className="action-btn edit-btn"
              title="Edit"
              onClick={() => router.push(`/category/edit/${cat._id}`)}
            >
              <i className="fi fi-rr-pencil" />
            </button>
            <button
              className="action-btn delete-btn"
              title="Delete"
              onClick={() => setDeleteTarget(cat)}
            >
              <i className="fi fi-rr-trash" />
            </button>
          </div>
        ),
      },
    ],
    [router]
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
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <a href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home" />
                <span>Dashboard</span>
              </a>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item">Category</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">List</span>
            </nav>
          </div>
          <Button
            icon={<i className="fi fi-rr-plus" />}
            onClick={() => router.push("/category/add")}
          >
            Create Category
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => c.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => !c.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-folder" style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-info">
            <h3>{categories.filter((c) => c.parentCategory).length}</h3>
            <p>Sub-categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-apps" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Categories</h2>
        </div>
        <Table
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="No categories found. Create your first category!"
          rowKey={(c) => c._id}
        />
        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>{categories.length}</strong> categories
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deleteTarget?.name || ""}
      />
    </div>
  );
};

export default CategoryList;
