import messaging from "../config/firebaseAdmin.js";
import User from "../modules/auth/auth.model.js";

export const sendNotificationToUser = async ({
  userId,
  title,
  body,
  data = {},
}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.fcmToken) {
      console.log("User has no FCM token.");
      return;
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title,
        body,
      },
      data: Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
    };
    const response = await messaging.send(message);
    console.log("Notification sent:", response);
    return response;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};