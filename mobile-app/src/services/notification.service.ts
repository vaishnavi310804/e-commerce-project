import { Platform, PermissionsAndroid } from "react-native";
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging();

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
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