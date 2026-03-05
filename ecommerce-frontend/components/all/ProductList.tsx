"use client";
import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../card/ProductCard";
import SideBar from "./SideBar";
import Breadcrumb from "../common/Breadcrumb";
import { productService, ApiProduct, ProductFilters } from "@/services/productService";

interface ProductListProps {
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  initialCategory,
  initialSearch,
  initialSort,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState(initialSort || "");
  const [filters, setFilters] = useState<{
    categories: string[];
    brands: string[];
    rating: number | null;
    priceRange: number[];
  }>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    rating: null,
    priceRange: [0, 1000],
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProductFilters = { page, limit: 12 };
      if (sort) params.sort = sort;
      if (filters.categories.length > 0) params.category = filters.categories[0];
      if (filters.rating) params.rating = filters.rating;
      if (filters.priceRange[1] < 1000) params.maxPrice = filters.priceRange[1];
      if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
      if (filters.brands.length > 0) params.brand = filters.brands[0];
      if (initialSearch) params.search = initialSearch;

      const res = await productService.getProducts(params);
      setProducts(res.data);
      setTotalPages(res.pagination.pages);
      setTotal(res.pagination.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, filters, initialSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, filters]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const sortMap: Record<string, string> = {
      default: "",
      popularity: "-soldCount",
      rating: "-ratings",
      latest: "-createdAt",
      "price-low": "price",
      "price-high": "-price",
    };
    setSort(sortMap[val] || "");
  };

  const limit = 12;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <section className="product-list-section">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Shop", href: "/all-products" },
            { label: initialSearch ? `Search: "${initialSearch}"` : "All Products" },
          ]}
        />

        <button
          className="mobile-filter-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle filters"
        >
          <i className="fi fi-rr-filter"></i>
          <span>Filters</span>
        </button>

        <div className="row py-5">
          <div className={`col-lg-3 sidebar-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div
              className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
              onClick={toggleSidebar}
            ></div>
            <div className="sidebar-container">
              <div className="sidebar-header-mobile">
                <h5>
                  <i className="fi fi-rr-filter"></i>
                  Filters
                </h5>
                <button
                  className="sidebar-close-btn"
                  onClick={toggleSidebar}
                  aria-label="Close filters"
                >
                  <i className="fi fi-rr-cross"></i>
                </button>
              </div>
              <SideBar onFilterChange={setFilters} initialCategory={initialCategory} />
            </div>
          </div>

          <div className="col-lg-9">
            <div className="products-header">
              <div className="products-count">
                {total > 0 ? (
                  <>Showing <strong>{start}-{end}</strong> of <strong>{total}</strong> results</>
                ) : (
                  <span>No products found</span>
                )}
              </div>
              <div className="products-sort">
                <label htmlFor="sortBy">Sort by:</label>
                <select id="sortBy" className="sort-select" onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Average rating</option>
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {loading
                ? [...Array(8)].map((_, i) => (
                    <div className="col-xl-3 col-lg-4 col-md-4 col-6" key={i}>
                      <div style={{ height: 320, borderRadius: 8, background: "#f0f0f0" }} />
                    </div>
                  ))
                : products.map((product) => (
                    <div className="col-xl-3 col-lg-4 col-md-4 col-6" key={product._id}>
                      <ProductCard
                        id={product._id}
                        slug={product.slug}
                        name={product.title}
                        price={product.discount > 0 ? product.price - (product.price * product.discount / 100) : product.price}
                        originalPrice={product.discount > 0 ? product.price : undefined}
                        discount={product.discount}
                        images={product.images}
                        rating={product.ratings}
                        soldCount={product.soldCount}
                      />
                    </div>
                  ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-5 d-flex justify-content-center">
                <ul className="pagination">
                  <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
