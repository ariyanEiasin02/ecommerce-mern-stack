"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminProductService } from "@/services/adminService";
import { toast } from "react-toastify";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await adminProductService.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
      toast.success(`"${title}" deleted successfully`);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

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
              <span className="breadcrumb-item">Products</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">All</span>
            </nav>
          </div>
          <button className="btn-create" onClick={() => router.push("/products/add")}>
            <i className="fi fi-rr-plus"></i>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-box" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{total}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{products.filter((p) => p.isActive).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-exclamation" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>{products.filter((p) => p.stock === 0).length}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Table */}
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
            <button type="submit" className="btn btn-sm btn-outline-secondary">
              <i className="fi fi-rr-search"></i>
            </button>
          </form>
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Active</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.images?.[0] ? (
                          <img
                            src={`http://localhost:5000${p.images[0].url}`}
                            alt={p.title}
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
                        <span className="text-truncate d-inline-block" style={{ maxWidth: 200 }}>
                          {p.title}
                        </span>
                      </td>
                      <td>{p.category?.name || "—"}</td>
                      <td>
                        {p.discount > 0 ? (
                          <>
                            <span className="text-decoration-line-through text-muted me-1">
                              ${p.price}
                            </span>
                            <strong>${(p.price * (1 - p.discount / 100)).toFixed(2)}</strong>
                          </>
                        ) : (
                          <strong>${p.price}</strong>
                        )}
                      </td>
                      <td>
                        <span
                          className={`active-badge ${p.stock > 0 ? "active" : "inactive"}`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.soldCount}</td>
                      <td>
                        <span className={`active-badge ${p.isActive ? "active" : "inactive"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                            disabled={deletingId === p._id}
                            onClick={() => handleDelete(p._id, p.title)}
                          >
                            <i
                              className={
                                deletingId === p._id ? "fi fi-rr-spinner" : "fi fi-rr-trash"
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-footer">
            <div className="showing-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} products)
            </div>
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <i className="fi fi-rr-angle-left"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const num = start + i;
                return (
                  <button
                    key={num}
                    className={`page-btn ${num === page ? "active" : ""}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <i className="fi fi-rr-angle-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
