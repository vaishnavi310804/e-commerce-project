import axios from "axios";

const ecommerceApi = axios.create({
  baseURL: "https://shopease-ecommerce-service.onrender.com/api/v1",
});

ecommerceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default ecommerceApi;
