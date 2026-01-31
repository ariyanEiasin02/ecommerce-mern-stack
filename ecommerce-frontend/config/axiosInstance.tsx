// lib/axiosInstance.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const API_URL: string =
  process.env.API_URL || "http://localhost:5000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50_000, // 50 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle unauthorized access (401) or forbidden (403)
      if (status === 401 || status === 403) {
        // Clear cookies and redirect to login
        Cookies.remove("user_token");
        Cookies.remove("user_role");
        Cookies.remove("user_id");

        // Only redirect if we're in the browser
        if (typeof window !== "undefined") {
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