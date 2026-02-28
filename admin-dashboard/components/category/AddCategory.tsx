"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCategoryService } from "@/services/adminService";

const AddCategory = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    adminCategoryService.getAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setFormData({ ...formData, name, slug });
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    setApiError("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("slug", formData.slug);
      if (formData.description) fd.append("description", formData.description);
      if (formData.parentCategory) fd.append("parentCategory", formData.parentCategory);
      if (image) fd.append("image", image);

      await adminCategoryService.create(fd);
      router.push("/category/all");
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", slug: "", description: "", parentCategory: "" });
    setImage(null);
    setImagePreview(null);
    setErrors({});
    setApiError("");
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
              {apiError && <div className="alert alert-danger py-2 mb-3">{apiError}</div>}
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

              {/* Parent Category */}
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="parentCategory">Parent Category</label>
                    <select
                      id="parentCategory"
                      className="form-control"
                      value={formData.parentCategory}
                      onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    >
                      <option value="">None (Top Level)</option>
                      {categories.filter((c: any) => !c.parentCategory).map((cat: any) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Category Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8, borderRadius: 8 }} />
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
