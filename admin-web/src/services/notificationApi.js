import api from "./api";

export const sendPromotionalNotification = async (data) => {
  const response = await api.post("/notification/admin/promotional", data);
  return response.data;
};

export const getNotificationHistory = async (params = {}) => {
  const response = await api.get("/notification/admin/history", { params });
  return response.data;
};
