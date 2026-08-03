import {
  createNotificationService,
  deleteNotificationService,
  getNotificationsService,
  getUnreadNotificationCountService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notification.service.js";

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