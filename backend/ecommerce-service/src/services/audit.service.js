import axios from "axios";

const authService = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "x-service-key": process.env.INTERNAL_SERVICE_KEY || "internal_secret_key",
  },
});

export const sendCustomerAuditLog = async (data) => {
  try {
    await authService.post("/audit-logs/internal", data);
  } catch (error) {
    console.error("Non-blocking Inter-service Audit Log Error:", error.message);
  }
};
