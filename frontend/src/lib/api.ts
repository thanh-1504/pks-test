import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

const plainAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh-token"];

let isRefreshing = false;
let waitingQueue: Array<(token: string) => void> = [];
function processQueue(newToken: string) {
  waitingQueue.forEach((resolve) => resolve(newToken));
  waitingQueue = [];
}
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const url: string = originalRequest?.url ?? "";
    if (AUTH_ROUTES.some((route) => url.includes(route))) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }
    if (isRefreshing) {
      return new Promise((resolve) => {
        waitingQueue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await plainAxios.post<{ accessToken: string }>(
        "/auth/refresh-token",
        { refreshToken },
      );
      const newToken = res.data.accessToken;

      setAccessToken(newToken);
      processQueue(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
