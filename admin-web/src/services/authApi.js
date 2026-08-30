import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/admin/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetOtp = async (data) => {
  const response = await api.post("/auth/verify-reset-otp", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await api.get("/auth/admins");

  return response.data?.data || [];
};

export const createAdmin = async (data) => {
  const response = await api.post("/auth/admins", data);
  return response.data;
};

export const updateAdmin = async (id, data) => {
  const response = await api.put(`/auth/admins/${id}`, data);
  return response.data;
};

export const updateAdminStatus = async (id, isActive) => {
  const response = await api.patch(`/auth/admins/${id}/status`, { isActive });
  return response.data;
};