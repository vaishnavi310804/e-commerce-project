import axios from "axios";

const authService = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 45000,
  headers: {
    "x-service-key": process.env.INTERNAL_SERVICE_KEY,
  },
});

export const sendNotification = async ({
  userId,
  title,
  body,
  type,
  image = "",
  data = {},
}) => {
  console.log("========== SEND NOTIFICATION ==========");

  try {

    const response = await authService.post("/notification/send", {
      userId,
      title,
      body,
      type,
      image,
      data,
    });

    console.log(
      "AUTH SERVICE NOTIFICATION RESPONSE:",
      response.status,
      response.data
    );

    console.log("NOTIFICATION REQUEST SUCCESS");
  } catch (error) {
    console.error("NOTIFICATION REQUEST FAILED");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Response:", error.response?.data);
    console.error("Status:", error.response?.status);
  }
};