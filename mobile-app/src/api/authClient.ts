import axios from "axios";
import * as SecureStore from "expo-secure-store";

const client = axios.create({
  baseURL: "https://shopease-auth-service.onrender.com/api/v1/auth",
  // baseURL: "http://192.168.29.120:5000/api/v1/auth",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
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

export default client;