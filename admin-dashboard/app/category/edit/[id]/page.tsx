"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminCategoryService, getAssetUrl } from "@/services/adminService";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/common/QuillEditor"), { ssr: false });

const EditCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "",
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [all] = await Promise.all([adminCategoryService.getAll()]);
        setCategories(all);
        // Find the current category from the list
        const cat = all.find((c: any) => c._id === id);
        if (!cat) {
          toast.error("Category not found");
          router.push("/category/all");
          return;
        }
        setFormData({
          name: cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          parentCategory: cat.parentCategory?._id || "",
          isActive: cat.isActive,
        });
        if (cat.image) setCurrentImage(cat.image);
      } catch {
        toast.error("Failed to load category");
        router.push("/category/all");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

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
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("slug", formData.slug);
      if (formData.description) fd.append("description", formData.description);
      if (formData.parentCategory) fd.append("parentCategory", formData.parentCategory);
      fd.append("isActive", String(formData.isActive));
      if (image) fd.append("image", image);

      await adminCategoryService.update(id, fd);
      toast.success("Category updated successfully!");
      router.push("/category/all");
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-category-page">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: 400 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-category-page">
      {/* Header */}
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
              <span className="breadcrumb-item active">Edit</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-card-header">
            <div>
              <h2>Edit Category</h2>
              <p>Update category information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              {apiError && (
                <div className="alert alert-danger py-2 mb-3">{apiError}</div>
              )}

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>
                      Category Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "error" : ""}`}
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={handleNameChange}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>
                      Slug <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.slug ? "error" : ""}`}
                      placeholder="category-slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        if (errors.slug) setErrors({ ...errors, slug: "" });
                      }}
                    />
                    {errors.slug && <span className="error-message">{errors.slug}</span>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Parent Category</label>
                    <select
                      className="form-control"
                      value={formData.parentCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, parentCategory: e.target.value })
                      }
                    >
                      <option value="">None (Top Level)</option>
                      {categories
                        .filter((c: any) => !c.parentCategory && c._id !== id)
                        .map((cat: any) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={String(formData.isActive)}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.value === "true" })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Category Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="d-flex gap-3 mt-2">
                      {currentImage && !imagePreview && (
                        <div>
                          <p className="text-muted" style={{ fontSize: 12, marginBottom: 4 }}>
                            Current Image
                          </p>
                          <img
                            src={getAssetUrl(currentImage!)}
                            alt="Current"
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                          />
                        </div>
                      )}
                      {imagePreview && (
                        <div>
                          <p className="text-muted" style={{ fontSize: 12, marginBottom: 4 }}>
                            New Image
                          </p>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <QuillEditor
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  placeholder="Enter category description..."
                  minHeight={180}
                />
              </div>
            </div>

            <div className="form-card-footer">
              <Link href="/category/all" className="btn-secondary" style={{ textDecoration: "none" }}>
                <i className="fi fi-rr-cross"></i>
                Cancel
              </Link>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fi fi-rr-spinner"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fi fi-rr-check"></i>
                    Update Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
