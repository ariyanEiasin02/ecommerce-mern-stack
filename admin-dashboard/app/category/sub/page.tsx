"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const SubCategoryPage = () => {
  const router = useRouter();
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminCategoryService.delete(deleteTarget._id);
      setSubCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete sub-category");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = subCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.parentCategory as any)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

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
                width: 40, height: 40, borderRadius: 6, background: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className="fi fi-rr-picture" style={{ color: "#94a3b8" }} />
            </div>
          ),
      },
      {
        key: "name",
        label: "Sub Category",
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
        label: "Parent Category",
        render: (cat) => (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", background: "#e0e7ff", color: "#4338ca",
              borderRadius: 6, fontSize: 12, fontWeight: 600,
            }}
          >
            <i className="fi fi-rr-folder" style={{ fontSize: 11 }} />
            {(cat.parentCategory as any)?.name || "—"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (cat) => (
          <span className={`active-badge ${cat.isActive ? "active" : "inactive"}`}>
            {cat.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
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
    []
  );

  return (
    <div className="category-page">
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <nav className="breadcrumb-nav">
              <Link href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home" />
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
          <Button
            icon={<i className="fi fi-rr-plus" />}
            onClick={() => router.push("/category/add")}
          >
            Add Sub Category
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-apps" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{subCategories.length}</h3>
            <p>Total Sub Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{subCategories.filter((c) => c.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-cross-circle" style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <h3>{subCategories.filter((c) => !c.isActive).length}</h3>
            <p>Inactive</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-folder" style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-info">
            <h3>
              {[...new Set(subCategories.map((c) => (c.parentCategory as any)?._id))].length}
            </h3>
            <p>Parent Categories</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Sub Categories</h2>
          <div style={{ position: "relative" }}>
            <i
              className="fi fi-rr-search"
              style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#94a3b8", fontSize: 14,
              }}
            />
            <input
              type="text"
              placeholder="Search sub-categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 38, paddingLeft: 36, paddingRight: 12,
                border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13,
                outline: "none", background: "#f8fafc", minWidth: 220,
              }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage={search ? "No results found" : "No sub-categories yet. Create one by selecting a parent category."}
          rowKey={(c) => c._id}
        />
        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{subCategories.length}</strong> sub-categories
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

export default SubCategoryPage;
