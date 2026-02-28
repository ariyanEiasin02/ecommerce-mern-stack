"use client";
import React, { useEffect, useState } from "react";
import { adminUserService } from "@/services/adminService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async (p = page) => {
    try {
      setLoading(true);
      const res = await adminUserService.getAll({ page: p, limit: 15 });
      setUsers(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
      setTotal(res.pagination?.total || 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleBlock = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await adminUserService.toggleBlock(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: res.user?.isBlocked ?? !u.isBlocked } : u))
      );
    } catch {
      alert("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminUserService.delete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers(newPage);
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
              <span className="breadcrumb-item active">Users</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-users" style={{ color: "#6366f1" }}></i>
          </div>
          <div className="stat-info">
            <h3>{total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }}></i>
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => !u.isBlocked).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-ban" style={{ color: "#ef4444" }}></i>
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.isBlocked).length}</h3>
            <p>Blocked</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Users</h2>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: u.role === "superAdmin" ? "#e0e7ff" : "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              fontSize: 14,
                              color: u.role === "superAdmin" ? "#4338ca" : "#64748b",
                            }}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className="active-badge"
                          style={
                            u.role === "superAdmin"
                              ? { backgroundColor: "#e0e7ff", color: "#3730a3" }
                              : {}
                          }
                        >
                          {u.role === "superAdmin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`active-badge ${u.isBlocked ? "inactive" : "active"}`}>
                          {u.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {u.role !== "superAdmin" && (
                            <>
                              <button
                                className={`action-btn ${u.isBlocked ? "edit-btn" : "view-btn"}`}
                                title={u.isBlocked ? "Unblock" : "Block"}
                                disabled={togglingId === u._id}
                                onClick={() => handleToggleBlock(u._id)}
                              >
                                <i className={u.isBlocked ? "fi fi-rr-unlock" : "fi fi-rr-lock"}></i>
                              </button>
                              <button
                                className="action-btn delete-btn"
                                title="Delete"
                                disabled={deletingId === u._id}
                                onClick={() => handleDelete(u._id, u.name)}
                              >
                                <i className={deletingId === u._id ? "fi fi-rr-spinner" : "fi fi-rr-trash"}></i>
                              </button>
                            </>
                          )}
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
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className="pagination">
              <button className="page-btn" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                <i className="fi fi-rr-angle-left"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const num = start + i;
                return (
                  <button key={num} className={`page-btn ${num === page ? "active" : ""}`} onClick={() => handlePageChange(num)}>
                    {num}
                  </button>
                );
              })}
              <button className="page-btn" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                <i className="fi fi-rr-angle-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
