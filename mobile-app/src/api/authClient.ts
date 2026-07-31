import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const client = axios.create({
  // baseURL: "https://shopease-auth-service.onrender.com/api/v1/auth",
  baseURL: "http://192.168.29.120:5000/api/v1/auth",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
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

export default client;