"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive:  boolean ;
  status: "waiting" | "rejected" | "approved";
  createdAt: string;
}

const CategoryList = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleStatusChange = (
    categoryId: string,
    newStatus: "waiting" | "rejected" | "approved",
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category._id === categoryId) {
        return { ...category, status: newStatus };
      }
      return category;
    });
    // Update the categories state with the new status
    console.log("Updated Categories:", updatedCategories);
    setOpenDropdown(null);
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "waiting":
        return "warning";
      default:
        return "secondary";
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
            <i
              className="fi fi-rr-check-circle"
              style={{ color: "#10b981" }}
            ></i>
          </div>
          <div className="stat-info">
            <h3>
              {categories.filter((cat) => cat.status === "approved").length}
            </h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <i className="fi fi-rr-clock" style={{ color: "#f59e0b" }}></i>
          </div>
          <div className="stat-info">
            <h3>
              {categories.filter((cat) => cat.status === "waiting").length}
            </h3>
            <p>Waiting</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <i
              className="fi fi-rr-cross-circle"
              style={{ color: "#ef4444" }}
            ></i>
          </div>
          <div className="stat-info">
            <h3>
              {categories.filter((cat) => cat.status === "rejected").length}
            </h3>
            <p>Rejected</p>
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
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Active</th>
                <th>Created Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
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
                      {cat.description || "No description"}
                    </span>
                  </td>
                  <td>
                    <div className="status-dropdown">
                      <button
                        className={`status-badge status-${getStatusColor(cat.status)}`}
                        onClick={() => toggleDropdown(cat._id)}
                      >
                        <span>
                          {cat.status.charAt(0).toUpperCase() +
                            cat.status.slice(1)}
                        </span>
                        <i className="fi fi-rr-angle-small-down"></i>
                      </button>
                      {openDropdown === cat._id && (
                        <div className="status-dropdown-menu">
                          <button
                            className="dropdown-item status-waiting"
                            onClick={() =>
                              handleStatusChange(cat._id, "waiting")
                            }
                          >
                            <i className="fi fi-rr-clock"></i>
                            <span>Waiting</span>
                          </button>
                          <button
                            className="dropdown-item status-approved"
                            onClick={() =>
                              handleStatusChange(cat._id, "approved")
                            }
                          >
                            <i className="fi fi-rr-check-circle"></i>
                            <span>Approved</span>
                          </button>
                          <button
                            className="dropdown-item status-rejected"
                            onClick={() =>
                              handleStatusChange(cat._id, "rejected")
                            }
                          >
                            <i className="fi fi-rr-cross-circle"></i>
                            <span>Rejected</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`active-badge ${cat.isActive ? "active" : "inactive"}`}
                    >
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
                      <button className="action-btn view-btn" title="View">
                        <i className="fi fi-rr-eye"></i>
                      </button>
                      <button className="action-btn edit-btn" title="Edit">
                        <i className="fi fi-rr-edit"></i>
                      </button>
                      <button className="action-btn delete-btn" title="Delete">
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <div className="showing-info">
            Showing <strong>1-{categories.length}</strong> of{" "}
            <strong>{categories.length}</strong> categories
          </div>
          <div className="pagination">
            <button className="page-btn" disabled>
              <i className="fi fi-rr-angle-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">
              <i className="fi fi-rr-angle-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
