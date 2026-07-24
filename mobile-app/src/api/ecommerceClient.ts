import axios from "axios";
import * as SecureStore from "expo-secure-store";

const ecommerceClient = axios.create({
  baseURL: "http://192.168.29.120:5001/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

ecommerceClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default ecommerceClient;