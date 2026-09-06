import Notification from "./notification.model.js";
import User from "../auth/auth.model.js";
import { sendNotificationToUser } from "../../services/firebaseNotification.service.js";

export const createNotificationService = async ({
  userId,
  title,
  body,
  type,
  image = "",
  data = {},
}) => {
  const notification = await Notification.create({
    user: userId,
    title,
    body,
    type,
    image,
    data,
  });

  await sendNotificationToUser({
    userId,
    title,
    body,
    data,
  });

  return notification;
};

export const sendPromotionalNotificationService = async ({
  title,
  body,
  image = "",
  data = {},
}) => {
  const customers = await User.find({
    role: "CUSTOMER",
    isActive: true,
  }).select("_id fcmToken");

  if (!customers || customers.length === 0) {
    return { recipientCount: 0 };
  }

  const notificationDocs = customers.map((customer) => ({
    user: customer._id,
    title,
    body,
    type: "PROMOTIONAL",
    image,
    data: {
      ...data,
      type: "PROMOTIONAL",
    },
  }));

  await Notification.insertMany(notificationDocs);

  const fcmPromises = customers
    .filter((customer) => customer.fcmToken)
    .map((customer) =>
      sendNotificationToUser({
        userId: customer._id,
        title,
        body,
        data: {
          ...data,
          type: "PROMOTIONAL",
        },
      }).catch((err) => {
        console.error(`FCM dispatch error for customer ${customer._id}:`, err.message);
      })
    );

  await Promise.allSettled(fcmPromises);

  return {
    recipientCount: customers.length,
  };
};

export const getNotificationsService = async (userId) => {
  return await Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

export const getUnreadNotificationCountService = async (userId) => {
  return await Notification.countDocuments({
    user: userId,
    isRead: false,
  });
};

export const markNotificationReadService = async (
  notificationId,
  userId
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
    }
  );
};

export const markAllNotificationsReadService = async (userId) => {
  await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

export const deleteNotificationService = async (
  notificationId,
  userId
) => {
  return await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
};