import { BACKEND_URL } from "@/config/env";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const res = await axios.get("/api/auth-token");

    if (res?.data?.token && config?.headers) {
      config.headers.Authorization = `Bearer ${res.data.token}`;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await axios.delete("/api/auth");

      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

export default api;
