"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddCategory = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: false,
    status: "waiting" as "waiting" | "rejected" | "approved",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData({ ...formData, name, slug });
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Category created:", formData);
      setIsSubmitting(false);
      router.push("/category/all");
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      isActive: false,
      status: "waiting",
    });
    setErrors({});
  };

  return (
    <div className="add-category-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <button className="filter-btn" onClick={() => router.back()}>
              <i className="fi fi-rr-arrow-left"></i>
            </button>
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
              <span className="breadcrumb-item active">Add New</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-card-header">
            <div>
              <h2>Add New Category</h2>
              <p>Create a new category for your products</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="name">
                      Category Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`form-control ${errors.name ? "error" : ""}`}
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={handleNameChange}
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="slug">
                      Slug <span className="required">*</span>
                    </label>
                    <div className="input-with-prefix">
                      <input
                        type="text"
                        id="slug"
                        className={`form-control with-prefix ${errors.slug ? "error" : ""}`}
                        placeholder="category-slug"
                        value={formData.slug}
                        onChange={(e) => {
                          setFormData({ ...formData, slug: e.target.value });
                          if (errors.slug) setErrors({ ...errors, slug: "" });
                        }}
                      />
                    </div>
                    {errors.slug && (
                      <span className="error-message">{errors.slug}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows={5}
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-card-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <i className="fi fi-rr-refresh"></i>
                Reset
              </button>
              <div className="button-group">
                <Link href="/category/all" className="btn-outline">
                  <i className="fi fi-rr-cross"></i>
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fi fi-rr-spinner"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fi fi-rr-check"></i>
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
