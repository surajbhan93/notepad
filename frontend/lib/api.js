import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
};

export const notesAPI = {
  getAll: (params = {}) => api.get("/notes", { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  share: (id, email) => api.post(`/notes/${id}/share`, { share_with_email: email }),
  unshare: (id, email) => api.delete(`/notes/${id}/share`, { data: { unshare_email: email } }),
  search: (q) => api.get("/notes/search", { params: { q } }),
};

export default api;
