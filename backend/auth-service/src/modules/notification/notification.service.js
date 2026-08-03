import Notification from "./notification.model.js";
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