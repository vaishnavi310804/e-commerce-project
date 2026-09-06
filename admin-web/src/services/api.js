import axios from "axios";

const api = axios.create({
  baseURL: "https://shopease-auth-service.onrender.com/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
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

export default api;