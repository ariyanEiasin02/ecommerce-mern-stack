import { adminAxios } from "@/config/axiosInstance";
import Cookies from "js-cookie";

// Helper to resolve backend base URL for images
export const getAssetUrl = (path: string) => {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
    .replace(/\/api$/, "");
  return `${base}${path}`;
};

// Remove Content-Type for FormData so axios/browser sets multipart boundary correctly
const formDataConfig = {
  headers: { "Content-Type": undefined as unknown as string },
};

// ============ Auth ============
export const adminAuthService = {
  async login(email: string, password: string) {
    const res = await adminAxios.post("/auth/login", { email, password });
    // Backend sendTokenResponse spreads data at root: { success, token, user }
    const { token, user } = res.data;
    if (!user || user.role !== "superAdmin") {
      throw new Error("Not authorized as admin");
    }
    Cookies.set("admin_token", token, { expires: 7 });
    Cookies.set("admin_name", user.name, { expires: 7 });
    return user;
  },

  async getMe() {
    const res = await adminAxios.get("/auth/me");
    // Backend GET /auth/me returns { success, user }
    return res.data.user;
  },

  logout() {
    Cookies.remove("admin_token");
    Cookies.remove("admin_name");
  },
};

// ============ Categories ============
export const adminCategoryService = {
  // Admin route: includes inactive categories, sorted by createdAt desc
  async getAll() {
    const res = await adminAxios.get("/categories/admin/all");
    return res.data.data;
  },

  // Public route: only active categories (used for parent category dropdowns)
  async getPublic() {
    const res = await adminAxios.get("/categories");
    return res.data.data;
  },

  async create(data: FormData) {
    const res = await adminAxios.post("/categories", data, formDataConfig);
    return res.data.data;
  },

  async update(id: string, data: FormData) {
    const res = await adminAxios.put(`/categories/${id}`, data, formDataConfig);
    return res.data.data;
  },

  async delete(id: string) {
    const res = await adminAxios.delete(`/categories/${id}`);
    return res.data;
  },
};

// ============ Products ============
export const adminProductService = {
  async getAll(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const res = await adminAxios.get(`/products/admin/all?${query.toString()}`);
    return res.data;
  },

  async getById(id: string) {
    const res = await adminAxios.get(`/products/admin/${id}`);
    return res.data.data;
  },

  async create(data: FormData) {
    const res = await adminAxios.post("/products", data, formDataConfig);
    return res.data.data;
  },

  async update(id: string, data: FormData) {
    const res = await adminAxios.put(`/products/${id}`, data, formDataConfig);
    return res.data.data;
  },

  async delete(id: string) {
    const res = await adminAxios.delete(`/products/${id}`);
    return res.data;
  },
};

// ============ Orders ============
export const adminOrderService = {
  async getAll(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const res = await adminAxios.get(`/orders/admin/all?${query.toString()}`);
    return res.data;
  },

  async getById(id: string) {
    const res = await adminAxios.get(`/orders/${id}`);
    return res.data.data;
  },

  async updateStatus(id: string, status: string) {
    const res = await adminAxios.put(`/orders/${id}/status`, { status });
    return res.data.data;
  },
};

// ============ Users ============
export const adminUserService = {
  async getAll(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const res = await adminAxios.get(`/users?${query.toString()}`);
    return res.data;
  },

  async getById(id: string) {
    const res = await adminAxios.get(`/users/${id}`);
    return res.data.data;
  },

  async toggleBlock(id: string) {
    const res = await adminAxios.put(`/users/${id}/block`);
    return res.data;
  },

  async delete(id: string) {
    const res = await adminAxios.delete(`/users/${id}`);
    return res.data;
  },
};

// ============ Coupons ============
export const adminCouponService = {
  async getAll() {
    const res = await adminAxios.get("/coupons");
    return res.data.data;
  },

  async create(data: Record<string, any>) {
    const res = await adminAxios.post("/coupons", data);
    return res.data.data;
  },

  async update(id: string, data: Record<string, any>) {
    const res = await adminAxios.put(`/coupons/${id}`, data);
    return res.data.data;
  },

  async delete(id: string) {
    const res = await adminAxios.delete(`/coupons/${id}`);
    return res.data;
  },
};

// ============ Dashboard ============
export const adminDashboardService = {
  async getAnalytics() {
    const res = await adminAxios.get("/admin/dashboard");
    return res.data.data;
  },
};
