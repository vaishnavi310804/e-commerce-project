import Notification from "./notification.model.js";
import NotificationHistory from "./notificationHistory.model.js";
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
  adminUser = null,
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

  if (adminUser) {
    try {
      await NotificationHistory.create({
        title,
        message: body,
        type: "PROMOTIONAL",
        targetAudience: "ALL_CUSTOMERS",
        sentBy: {
          adminId: adminUser._id,
          name: adminUser.fullName || adminUser.name || adminUser.email || "Admin",
          email: adminUser.email || "",
          role: adminUser.roleId?.name || adminUser.role || "ADMIN",
        },
        recipientCount: customers.length,
      });
    } catch (historyErr) {
      console.error("Failed to create notification history record:", historyErr.message);
    }
  }

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

export const getNotificationHistoryService = async ({
  page = 1,
  limit = 10,
}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await NotificationHistory.countDocuments();
  const history = await NotificationHistory.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    history,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
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