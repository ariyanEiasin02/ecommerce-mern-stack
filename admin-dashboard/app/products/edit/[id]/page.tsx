"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  adminProductService,
  adminCategoryService,
  getAssetUrl,
} from "@/services/adminService";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/common/QuillEditor"), {
  ssr: false,
});

interface ExistingImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    brand: "",
    tags: "",
    freeShipping: false,
    estimatedDays: "5",
    isActive: true,
  });

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [product, cats] = await Promise.all([
          adminProductService.getById(id),
          adminCategoryService.getAll(),
        ]);
        setCategories(cats);
        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          discount: String(product.discount ?? ""),
          stock: String(product.stock ?? ""),
          category: product.category?._id || product.category || "",
          brand: product.brand || "",
          tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
          freeShipping: product.shipping?.freeShipping ?? false,
          estimatedDays: String(product.shipping?.estimatedDays ?? 5),
          isActive: product.isActive !== false,
        });
        setExistingImages(product.images || []);
      } catch {
        toast.error("Failed to load product");
        router.push("/products/all");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    // Reset input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descText) newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      if (formData.discount) fd.append("discount", formData.discount);
      fd.append("stock", formData.stock || "0");
      fd.append("category", formData.category);
      if (formData.brand) fd.append("brand", formData.brand);
      if (formData.tags) {
        fd.append(
          "tags",
          JSON.stringify(formData.tags.split(",").map((t) => t.trim()).filter(Boolean))
        );
      }
      fd.append(
        "shipping",
        JSON.stringify({
          freeShipping: formData.freeShipping,
          estimatedDays: Number(formData.estimatedDays) || 5,
        })
      );
      fd.append("isActive", String(formData.isActive));
      // Send kept existing images so the backend can merge correctly
      fd.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach((file) => fd.append("images", file));

      await adminProductService.update(id, fd);
      toast.success("Product updated successfully!");
      router.push("/products/all");
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message || "Failed to update product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-category-page">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "#ff6154", width: 40, height: 40 }}
          />
          <p className="mt-3" style={{ color: "#64748b", fontSize: 14 }}>
            Loading product…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-category-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb-section">
            <button
              className="filter-btn"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <i className="fi fi-rr-arrow-left" />
            </button>
            <nav className="breadcrumb-nav">
              <Link href="/" className="breadcrumb-item">
                <i className="fi fi-rr-home" />
                <span>Dashboard</span>
              </Link>
              <span className="breadcrumb-separator">/</span>
              <Link href="/products/all" className="breadcrumb-item">
                Products
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
          <div className="form-header">
            <h2>Edit Product</h2>
            <p>Update the product details below</p>
          </div>

          {apiError && (
            <div className="alert alert-danger mx-4 mt-3">{apiError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-body">
              <div className="row g-3">

                {/* ── Basic Information ────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-info" />
                      Basic Information
                    </div>
                  </div>
                </div>

                {/* ── Basic Info ─────────────────────────────────── */}
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="form-label">Product Title *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.title ? "error" : ""}`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter product title"
                    />
                    {errors.title && (
                      <span className="error-message">{errors.title}</span>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className={`form-input ${errors.category ? "error" : ""}`}
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="error-message">{errors.category}</span>
                    )}
                  </div>
                </div>

                {/* ── Description ────────────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-text" />
                      Description
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <QuillEditor
                      value={formData.description}
                      onChange={(val) => {
                        setFormData((prev) => ({
                          ...prev,
                          description: val,
                        }));
                        if (errors.description)
                          setErrors((prev) => ({
                            ...prev,
                            description: "",
                          }));
                      }}
                      placeholder="Enter product description…"
                      minHeight={220}
                      hasError={!!errors.description}
                    />
                    {errors.description && (
                      <span className="error-message">
                        {errors.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Pricing ────────────────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-dollar" />
                      Pricing &amp; Inventory
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      className={`form-input ${errors.price ? "error" : ""}`}
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {errors.price && (
                      <span className="error-message">{errors.price}</span>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Discount (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* ── Brand / Tags ───────────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-tags" />
                      Additional Details
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-input"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g. electronics, gadgets, new"
                    />
                  </div>
                </div>

                {/* ── Shipping ───────────────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-truck-side" />
                      Shipping &amp; Visibility
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Estimated Delivery (days)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="estimatedDays"
                      value={formData.estimatedDays}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-group">
                    <label
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        name="freeShipping"
                        checked={formData.freeShipping}
                        onChange={handleChange}
                        style={{ width: 18, height: 18 }}
                      />
                      <span>Free Shipping</span>
                    </label>
                  </div>
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-group">
                    <label
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        style={{ width: 18, height: 18 }}
                      />
                      <span>Active (visible to customers)</span>
                    </label>
                  </div>
                </div>

                {/* ── Existing Images ────────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-picture" />
                      Product Images
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Current Images</label>
                    {existingImages.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {existingImages.map((img, i) => (
                          <div key={i} className="position-relative">
                            <img
                              src={getAssetUrl(img.url)}
                              alt={img.alt || `Image ${i + 1}`}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: img.isPrimary
                                  ? "2px solid #ff6154"
                                  : "2px solid #e5e7eb",
                              }}
                            />
                            {img.isPrimary && (
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: "rgba(255,97,84,0.85)",
                                  color: "#fff",
                                  fontSize: 9,
                                  fontWeight: 600,
                                  textAlign: "center",
                                  borderBottomLeftRadius: 6,
                                  borderBottomRightRadius: 6,
                                  padding: "2px 0",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                PRIMARY
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(i)}
                              title="Remove image"
                              style={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                fontSize: 14,
                                lineHeight: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: 13,
                          color: "#94a3b8",
                          marginTop: 4,
                        }}
                      >
                        No existing images.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Add New Images ─────────────────────────────── */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">
                      Add New Images
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 12,
                          color: "#94a3b8",
                          fontWeight: 400,
                        }}
                      >
                        ({10 - existingImages.length - newImages.length} slots
                        remaining)
                      </span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-input"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageChange}
                      disabled={
                        existingImages.length + newImages.length >= 10
                      }
                    />
                    {newPreviews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {newPreviews.map((src, i) => (
                          <div key={i} className="position-relative">
                            <img
                              src={src}
                              alt={`New ${i + 1}`}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "2px solid #e5e7eb",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              title="Remove image"
                              style={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                fontSize: 14,
                                lineHeight: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => router.push("/products/all")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving…
                  </>
                ) : (
                  <>
                    <i className="fi fi-rr-check" />
                    <span>Save Changes</span>
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

export default EditProduct;
