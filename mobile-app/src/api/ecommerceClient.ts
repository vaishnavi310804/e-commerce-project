import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ecommerceClient = axios.create({
  baseURL: "https://shopease-ecommerce-service.onrender.com/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

ecommerceClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (token) {
      const cleanToken = token.replace(/^"|"$/g, "").trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
  } catch (error) {
    console.error("Error reading token from AsyncStorage:", error);
  }

  return config;
});

ecommerceClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && code === "SESSION_REVOKED") {
      const { handleSessionRevocation } = await import("../utils/sessionHandler");
      await handleSessionRevocation();
    }

    return Promise.reject(error);
  }
);

export default ecommerceClient;
