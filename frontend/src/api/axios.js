import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const API = axios.create({ baseURL: BASE, timeout: 20000 });

// Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle responses + auto refresh
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        try {
          const res = await axios.post(`${BASE}/auth/refresh`, null, { params: { token: refresh } });
          const newToken = res.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          orig.headers.Authorization = `Bearer ${newToken}`;
          return API(orig);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (err.response?.status !== 401 && !orig._silent) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }

    return Promise.reject(err);
  }
);

export default API;
