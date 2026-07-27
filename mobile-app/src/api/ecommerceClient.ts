import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ecommerceClient = axios.create({
  // baseURL: "https://shopease-ecommerce-service.onrender.com/api/v1",
  baseURL: "http://192.168.29.120:5001/api/v1",
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

export default ecommerceClient;
