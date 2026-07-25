import axios from "axios";
import * as SecureStore from "expo-secure-store";

const client = axios.create({
  baseURL: "https://shopease-auth-service.onrender.com/api/v1/auth",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;