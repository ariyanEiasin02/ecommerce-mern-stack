"use client";
import React, { useEffect, useState, useMemo } from "react";
import { adminUserService } from "@/services/adminService";
import { toast } from "react-toastify";
import { Table, Pagination, ConfirmDeleteModal, Button } from "@/components/ui";
import type { TableColumn } from "@/components/ui";

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
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      toast.success("User status updated");
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminUserService.delete(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setTotal((prev) => prev - 1);
      toast.success(`User "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers(newPage);
  };

  const columns: TableColumn<User>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        render: (u) => (
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: u.role === "superAdmin" ? "#e0e7ff" : "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600, fontSize: 14,
                color: u.role === "superAdmin" ? "#4338ca" : "#64748b",
              }}
            >
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <span>{u.name}</span>
          </div>
        ),
      },
      { key: "email", label: "Email" },
      {
        key: "role",
        label: "Role",
        render: (u) => (
          <span
            className="active-badge"
            style={u.role === "superAdmin" ? { backgroundColor: "#e0e7ff", color: "#3730a3" } : {}}
          >
            {u.role === "superAdmin" ? "Admin" : "User"}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (u) => (
          <span className={`active-badge ${u.isBlocked ? "inactive" : "active"}`}>
            {u.isBlocked ? "Blocked" : "Active"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Joined",
        render: (u) =>
          new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        render: (u) =>
          u.role !== "superAdmin" ? (
            <div className="action-buttons">
              <button
                className={`action-btn ${u.isBlocked ? "edit-btn" : "view-btn"}`}
                title={u.isBlocked ? "Unblock" : "Block"}
                disabled={togglingId === u._id}
                onClick={() => handleToggleBlock(u._id)}
              >
                <i className={u.isBlocked ? "fi fi-rr-unlock" : "fi fi-rr-lock"} />
              </button>
              <button
                className="action-btn delete-btn"
                title="Delete"
                onClick={() => setDeleteTarget(u)}
              >
                <i className="fi fi-rr-trash" />
              </button>
            </div>
          ) : null,
      },
    ],
    [togglingId]
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
              <span className="breadcrumb-item active">Users</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#e0e7ff" }}>
            <i className="fi fi-rr-users" style={{ color: "#6366f1" }} />
          </div>
          <div className="stat-info">
            <h3>{total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#ecfdf5" }}>
            <i className="fi fi-rr-check-circle" style={{ color: "#10b981" }} />
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => !u.isBlocked).length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i className="fi fi-rr-ban" style={{ color: "#ef4444" }} />
          </div>
          <div className="stat-info">
            <h3>{users.filter((u) => u.isBlocked).length}</h3>
            <p>Blocked</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Users</h2>
        </div>
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found" rowKey={(u) => u._id} />
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} total={total} />
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

export default UsersPage;
