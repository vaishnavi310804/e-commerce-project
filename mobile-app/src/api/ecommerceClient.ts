import axios from "axios";
import * as SecureStore from "expo-secure-store";

const ecommerceClient = axios.create({
  baseURL: "https://shopease-ecommerce-service.onrender.com/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

ecommerceClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      const cleanToken = token.replace(/^"|"$/g, "").trim();
      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
  } catch (error) {
    console.error("Error reading token from SecureStore:", error);
  }
  return config;
});

export default ecommerceClient;