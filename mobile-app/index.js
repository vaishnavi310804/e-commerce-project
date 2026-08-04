import { getMessaging, setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import "expo-router/entry";

setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log("FCM background message received:", remoteMessage);
});
