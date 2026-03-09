// lib/axiosInstance.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Only try to get cookie on client side
    if (typeof window !== "undefined") {
      const token = Cookies.get("user_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // On server side, headers should be passed explicitly
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Only redirect for protected routes that require authentication
      // Don't redirect for 401/403 if we're not in browser or if it's an optional auth endpoint
      if (status === 401 || status === 403) {
        // Check if this is a request that explicitly requires auth
        const requiresAuth =
          error.config?.headers?.["X-Requires-Auth"] === "true";

        // Only clear cookies and redirect if we're in the browser and the request requires auth
        if (typeof window !== "undefined" && requiresAuth) {
          Cookies.remove("user_token");
          Cookies.remove("user_role");
          Cookies.remove("user_id");
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      console.error("API no response:", error.request);
    } else {
      console.error("API request error:", error.message);
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };