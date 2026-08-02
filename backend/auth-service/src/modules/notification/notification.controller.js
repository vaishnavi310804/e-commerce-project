import { sendNotificationToUser } from "../../services/notification.service.js";

export const sendTestNotification = async (req, res, next) => {
  try {
    await sendNotificationToUser({
      userId: req.user._id,
      title: "Welcome to ShopEase",
      body: "Push notifications are working successfully!",
      data: {
        type: "TEST",
      },
    });

    res.status(200).json({
      success: true,
      message: "Test notification sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};