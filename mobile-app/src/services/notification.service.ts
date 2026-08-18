import { Platform, PermissionsAndroid } from "react-native";
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import { updateFcmToken } from "@/src/api/notification.api";

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging();

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Android notification permission denied");
          return null;
        }
      }
    }

    const authStatus = await requestPermission(messaging);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging);

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.log("FCM Error:", error);
    return null;
  }
};

export const syncFcmToken = async () => {
  try {
    const messaging = getMessaging();

    // Android 13+ notification permission
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (!hasPermission) {
        console.log("Notification permission not granted. Skipping FCM sync.");
        return null;
      }
    }

    // Check Firebase notification permission
    const authStatus = await requestPermission(messaging);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("Firebase notification permission not granted.");
      return null;
    }

    const token = await getToken(messaging);

    if (!token) {
      console.log("No FCM token available.");
      return null;
    }

    console.log("Syncing FCM token:", token);

    const response = await updateFcmToken(token);

    if (!response.success) {
      console.log("Failed to sync FCM token:", response.message);
      return null;
    }

    console.log("FCM token synced successfully.");

    return token;
  } catch (error) {
    console.log("FCM token sync error:", error);
    return null;
  }
};

export const syncFcmTokenValue = async (token: string) => {
  try {
    if (!token) {
      console.log("No FCM token to sync.");
      return null;
    }

    console.log("Syncing refreshed FCM token:", token);

    const response = await updateFcmToken(token);

    if (!response.success) {
      console.log(
        "Failed to sync refreshed FCM token:",
        response.message,
      );
      return null;
    }

    console.log("Refreshed FCM token synced successfully.");

    return token;
  } catch (error) {
    console.log(
      "FCM refreshed token sync error:",
      error,
    );

    return null;
  }
};