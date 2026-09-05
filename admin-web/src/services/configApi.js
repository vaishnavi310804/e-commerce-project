import api from "./api";

export const getFeatureToggles = async () => {
  const response = await api.get("/config/features");
  return response.data;
};

export const updateFeatureToggle = async (key, payload) => {
  const response = await api.patch(`/config/features/${key}`, payload);
  return response.data;
};
