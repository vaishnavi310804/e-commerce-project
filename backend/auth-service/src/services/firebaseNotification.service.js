import messaging from "../config/firebaseAdmin.js";
import User from "../modules/auth/auth.model.js";

export const sendNotificationToUser = async ({
  userId,
  title,
  body,
  data = {},
}) => {
  let fcmToken = null;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.fcmToken) {
      console.log("User has no FCM token.");
      return;
    }

    fcmToken = user.fcmToken;

    const message = {
      token: fcmToken,
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

    if (
      error?.code === "messaging/registration-token-not-registered" ||
      error?.message?.includes("NotRegistered")
    ) {
      console.log(`Clearing invalid FCM token for user: ${userId}`);

      await User.findOneAndUpdate(
        {
          _id: userId,
          fcmToken: fcmToken,
        },
        {
          $unset: {
            fcmToken: "",
          },
        },
      );

      console.log("Invalid FCM token cleared.");
    }

    throw error;
  }
};