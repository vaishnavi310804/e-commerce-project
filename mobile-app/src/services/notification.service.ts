import { getMessaging, getToken, AuthorizationStatus } from "@react-native-firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging();

    const authStatus = await messaging.requestPermission();

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