import axios from "axios";

// Access token lives in memory only; the refresh token is an httpOnly cookie.
let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };
export const getAccessToken = () => accessToken;

const api = axios.create({ baseURL: "/api/v1", withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthCall = /\/auth\/(login|register|refresh|forgot-password|verify-reset-otp|reset-password)/.test(url);
    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshing = refreshing || api.post("/auth/refresh").finally(() => { refreshing = null; });
        const { data } = await refreshing;
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

// Backend errors look like { status, message, data: null }
export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.message || (err?.request ? "Cannot reach the server. Check your connection." : fallback);

export default api;
