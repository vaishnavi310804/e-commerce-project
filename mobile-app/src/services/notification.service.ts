import * as Notifications from "expo-notifications";
import { getMessaging, getToken } from "@react-native-firebase/messaging";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    console.log("Notification Permission:", status);

    if (status !== "granted") {
      return null;
    }

    const messaging = getMessaging();

    const token = await getToken(messaging);

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.log("FCM Error:", error);
    return null;
  }
};