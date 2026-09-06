import api from "./api";

export const getSessions = async (params = {}) => {
  const response = await api.get("/auth/sessions", { params });
  return response.data;
};

export const forceLogoutSession = async (sessionId) => {
  const response = await api.delete(`/auth/sessions/${sessionId}`);
  return response.data;
};
