import api from "./api";

export const sendPromotionalNotification = async (data) => {
  const response = await api.post("/notification/admin/promotional", data);
  return response.data;
};
