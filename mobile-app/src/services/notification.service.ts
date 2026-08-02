import { getMessaging, getToken, requestPermission } from "@react-native-firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const authStatus = await requestPermission(getMessaging());

    const enabled =
      authStatus === 1 || authStatus === 2;

    if (!enabled) {
      return null;
    }

    const token = await getToken(getMessaging());

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};