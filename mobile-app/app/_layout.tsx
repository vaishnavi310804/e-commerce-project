import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import {
  getMessaging,
  onMessage,
  setAutoInitEnabled,
  onNotificationOpenedApp,
  getInitialNotification,
} from "@react-native-firebase/messaging";

SplashScreen.preventAutoHideAsync();

/**
 * Tell Expo Notifications to display notifications
 * when the app is in the foreground.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Initialize Firebase Notification Service
  useEffect(() => {
    const messaging = getMessaging();
    setAutoInitEnabled(messaging, true);
  }, []);

  // Notification Interaction Handlers
  useEffect(() => {
    const messaging = getMessaging();

    // Handle notification tap when app is running in background
    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        console.log(
          "App opened from background via notification tap:",
          JSON.stringify(remoteMessage, null, 2)
        );
      }
    );

    // Handle notification tap when app was launched from quit state
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "App launched from quit state via notification tap:",
          JSON.stringify(remoteMessage, null, 2)
        );
      }
    });

    return () => unsubscribeOpenedApp();
  }, []);

  // Foreground Notification Handler
  useEffect(() => {
    const unsubscribe = onMessage(
      getMessaging(),
      async (remoteMessage) => {
        console.log(
          "Foreground Notification Title:",
          remoteMessage.notification?.title
        );

        console.log(
          "Foreground Notification Body:",
          remoteMessage.notification?.body
        );

        console.log(
          "Foreground Notification Data Payload:",
          remoteMessage.data
        );

        // Display the FCM notification visibly while app is open
        if (
          remoteMessage.notification?.title ||
          remoteMessage.notification?.body
        ) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title || "ShopEase",
              body: remoteMessage.notification?.body || "",
              data: remoteMessage.data || {},
              sound: "default",
            },
            trigger: null,
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}