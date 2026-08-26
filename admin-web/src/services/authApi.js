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

export const getAllAdmins = async () => {
  const response = await api.get("/admins");

  return response.data?.data || [];
};

export const createAdmin = async (data) => {
  const response = await api.post("/admins", data);
  return response.data;
};

export const updateAdmin = async (id, data) => {
  const response = await api.put(`/admins/${id}`, data);
  return response.data;
};

export const updateAdminStatus = async (id, isActive) => {
  const response = await api.patch(`/admins/${id}/status`, { isActive });
  return response.data;
};