"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminProductService, getAssetUrl } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Pagination, Button, ConfirmDeleteModal } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  category: { _id: string; name: string } | null;
  isActive: boolean;
  soldCount: number;
  createdAt: string;
}

const AllProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async (p = page, s = search) => {
    try {
      setLoading(true);
      const res = await adminProductService.getAll({ page: p, limit: 10, search: s });
      setProducts(res.data);
      setTotalPages(res.pagination?.pages || 1);
      setTotal(res.pagination?.total || 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage, search);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminProductService.delete(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setTotal((prev) => prev - 1);
      toast.success(`"${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const columns: TableColumn<Product>[] = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (p) =>
          p.images?.[0] ? (
            <img
              src={getAssetUrl(p.images[0].url)}
              alt={p.title}
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
        key: "title",
        label: "Title",
        render: (p) => (
          <span className="text-truncate d-inline-block" style={{ maxWidth: 200 }}>
            {p.title}
          </span>
        ),
      },
      {
        key: "category",
        label: "Category",
        render: (p) => <>{p.category?.name || "—"}</>,
      },
      {
        key: "price",
        label: "Price",
        render: (p) =>
          p.discount > 0 ? (
            <>
              <span className="text-decoration-line-through text-muted me-1">${p.price}</span>
              <strong>${(p.price * (1 - p.discount / 100)).toFixed(2)}</strong>
            </>
          ) : (
            <strong>${p.price}</strong>
          ),
      },
      {
        key: "stock",
        label: "Stock",
        render: (p) => (
          <span className={`active-badge ${p.stock > 0 ? "active" : "inactive"}`}>{p.stock}</span>
        ),
      },
      {
        key: "soldCount",
        label: "Sold",
        render: (p) => <>{p.soldCount}</>,
      },
      {
        key: "isActive",
        label: "Active",
        render: (p) => (
          <span className={`active-badge ${p.isActive ? "active" : "inactive"}`}>
            {p.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        render: (p) => (
          <div className="action-buttons">
            <button
              className="action-btn delete-btn"
              title="Delete"
              onClick={() => setDeleteTarget(p)}
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
              <span className="breadcrumb-item">Products</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">All</span>
            </nav>
          </div>
          <Button
            icon={<i className="fi fi-rr-plus" />}
            onClick={() => router.push("/products/add")}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-box" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{total}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{products.filter((p) => p.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-exclamation" style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-info">
            <h3>{products.filter((p) => p.stock === 0).length}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Products</h2>
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
            <Button type="submit" variant="outline" size="sm">
              <i className="fi fi-rr-search" />
            </Button>
          </form>
        </div>
        <Table columns={columns} data={products} loading={loading} emptyMessage="No products found" rowKey={(p) => p._id} />
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} total={total} />
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deleteTarget?.title || ""}
      />
    </div>
  );
};

export default AllProducts;
