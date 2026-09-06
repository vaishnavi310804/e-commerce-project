import {
  createNotificationService,
  sendPromotionalNotificationService,
  getNotificationHistoryService,
  deleteNotificationService,
  getNotificationsService,
  getUnreadNotificationCountService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notification.service.js";
import { createAuditLog } from "../audit/auditLog.service.js";

export const sendTestNotification = async (req, res, next) => {
  try {
    await createNotificationService({
      userId: req.user._id,
      title: "Welcome to ShopEase",
      body: "Push notifications are working successfully!",
      type: "TEST",
      data: {
        screen: "HOME",
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

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await getNotificationsService(req.user._id);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationCount = async (
  req,
  res,
  next
) => {
  try {
    const count = await getUnreadNotificationCountService(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (
  req,
  res,
  next
) => {
  try {
    const notification = await markNotificationReadService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (
  req,
  res,
  next
) => {
  try {
    await markAllNotificationsReadService(req.user._id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    await deleteNotificationService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const notification = await createNotificationService({
      userId: req.body.userId,
      title: req.body.title,
      body: req.body.body,
      type: req.body.type,
      image: req.body.image,
      data: req.body.data,
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const sendPromotionalNotification = async (req, res, next) => {
  try {
    const title = req.body.title?.trim();
    const message = (req.body.message || req.body.body)?.trim();

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const result = await sendPromotionalNotificationService({
      title,
      body: message,
      adminUser: req.user,
    });

    try {
      await createAuditLog({
        actorId: req.user._id,
        actorRole: req.user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
        module: "NOTIFICATIONS",
        action: "PROMOTIONAL_NOTIFICATION_SENT",
        targetId: null,
        targetType: "CUSTOMER_BROADCAST",
        description: `Admin ${req.user.fullName || req.user.email || req.user._id} sent a promotional notification to ${result.recipientCount} customers.`,
        changes: {
          before: null,
          after: {
            title,
            message,
            type: "PROMOTIONAL",
            recipientsCount: result.recipientCount,
          },
        },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    } catch (auditError) {
      console.error("Audit log creation error (non-fatal):", auditError.message);
    }

    return res.status(200).json({
      success: true,
      message: `Promotional notification sent successfully to ${result.recipientCount} customers.`,
      data: {
        recipientsCount: result.recipientCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await getNotificationHistoryService({
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.history,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};