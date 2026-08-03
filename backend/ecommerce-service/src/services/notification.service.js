import axios from "axios";

const authService = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 10000,
});

export const sendNotification = async ({
  userId,
  title,
  body,
  type,
  image = "",
  data = {},
}) => {
  try {
    await authService.post("/notification/send", {
      userId,
      title,
      body,
      type,
      image,
      data,
    });
  } catch (error) {
    console.error(
      "Notification Service Error:",
      error.response?.data || error.message
    );
  }
};