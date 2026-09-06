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

ecommerceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath =
        window.location.pathname === "/" ||
        window.location.pathname.startsWith("/forgot-password") ||
        window.location.pathname.startsWith("/verify-reset-otp") ||
        window.location.pathname.startsWith("/reset-password");

      if (!isAuthPath) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = "/?session_expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default ecommerceApi;
