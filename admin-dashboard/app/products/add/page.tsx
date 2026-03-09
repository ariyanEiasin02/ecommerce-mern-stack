"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminProductService, adminCategoryService } from "@/services/adminService";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/common/QuillEditor"), { ssr: false });

const AddProduct = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
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
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    adminCategoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descText) newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
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
        fd.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim())));
      }
      fd.append(
        "shipping",
        JSON.stringify({
          freeShipping: formData.freeShipping,
          estimatedDays: Number(formData.estimatedDays) || 5,
        })
      );

      images.forEach((file) => fd.append("images", file));

      await adminProductService.create(fd);
      toast.success("Product created successfully!");
      router.push("/products/all");
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
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
              <Link href="/products/all" className="breadcrumb-item">
                Products
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Add New</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Add New Product</h2>
            <p>Fill in the product details below</p>
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

                {/* Title */}
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
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>
                </div>

                {/* Category */}
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

                {/* Description */}
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
                        setFormData((prev) => ({ ...prev, description: val }));
                        if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      placeholder="Enter product description..."
                      minHeight={220}
                      hasError={!!errors.description}
                    />
                    {errors.description && (
                      <span className="error-message">{errors.description}</span>
                    )}
                  </div>
                </div>

                {/* ── Pricing & Inventory ──────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-dollar" />
                      Pricing &amp; Inventory
                    </div>
                  </div>
                </div>

                {/* Price / Discount / Stock */}
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
                    {errors.price && <span className="error-message">{errors.price}</span>}
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

                {/* ── Additional Details ───────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-tags" />
                      Additional Details
                    </div>
                  </div>
                </div>

                {/* Brand / Tags */}
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

                {/* ── Shipping ─────────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-truck-side" />
                      Shipping
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Estimated Delivery (days)</label>
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
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-group">
                    <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
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

                {/* ── Product Images ────────────────────── */}
                <div className="col-12">
                  <div className="form-section">
                    <div className="form-section__title">
                      <i className="fi fi-rr-picture" />
                      Product Images
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Product Images (up to 10)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-input"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    {previews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {previews.map((src, i) => (
                          <div key={i} className="position-relative">
                            <img
                              src={src}
                              alt={`Preview ${i + 1}`}
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
                              onClick={() => removeImage(i)}
                              style={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                fontSize: 12,
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
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fi fi-rr-plus"></i>
                    <span>Create Product</span>
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

export default AddProduct;
