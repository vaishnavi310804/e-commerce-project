import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/forgot-password", data);
  return response.data;
};

export const verifyResetOtp = async (data) => {
  const response = await api.post("/verify-reset-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/reset-password", data);
  return response.data;
};