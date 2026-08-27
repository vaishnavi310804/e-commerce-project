import api from "./api";

const authServiceBaseUrl = api.defaults.baseURL
  ? api.defaults.baseURL.replace(/\/auth\/?$/, "")
  : "https://shopease-auth-service.onrender.com/api/v1";

export const getAuditLogs = async (params) => {
  const response = await api.get("/audit-logs", {
    params,
    baseURL: authServiceBaseUrl,
  });
  return response.data;
};
