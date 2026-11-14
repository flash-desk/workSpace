import api from "./client";

export const registerUser = (p) => api.post("/auth/register", p).then((r) => r.data);
export const activateAccount = (token) => api.get("/auth/activate-account", { params: { token } }).then((r) => r.data);
export const loginUser = (p) => api.post("/auth/login", p).then((r) => r.data);
export const refreshSession = () => api.post("/auth/refresh").then((r) => r.data);
export const logoutUser = () => api.post("/auth/logout").then((r) => r.data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data);
export const verifyResetOtp = (email, otp) => api.post("/auth/verify-reset-otp", { email, otp }).then((r) => r.data);
export const resetPassword = (resetToken, newPassword) =>
  api.post("/auth/reset-password", { resetToken, newPassword }).then((r) => r.data);
export const getMe = () => api.get("/users/me").then((r) => r.data);
